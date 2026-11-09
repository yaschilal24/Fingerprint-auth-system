import { randomUUID } from "node:crypto";

import { z } from "zod";

import { query, getClient } from "../config/database.js";

import {
    createRegistrationOptions,
    verifyRegistration,
    createAuthenticationOptions,
    verifyAuthentication,
} from "../services/webauthnService.js";

// =======================================
// VALIDATION
// =======================================

const registrationSchema = z.object({
    fullName: z.string().trim().min(2).max(120),

    email: z.string().trim().email().max(255),
});

const loginSchema = z.object({
    email: z.string().trim().email().max(255),
});

const saveSession = (session) =>
    new Promise((resolve, reject) => {
        session.save((error) => {
            if (error) reject(error);
            else resolve();
        });
    });

const regenerateSession = (session) =>
    new Promise((resolve, reject) => {
        session.regenerate((error) => {
            if (error) reject(error);
            else resolve();
        });
    });

// =======================================
// REGISTER OPTIONS
// =======================================

export const registerOptions = async (req, res) => {
    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid registration information.",
            errors: parsed.error.flatten(),
        });
    }

    const fullName = parsed.data.fullName;
    const email = parsed.data.email.toLowerCase();

    const existing = await query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existing.rows.length > 0) {
        return res.status(409).json({
            success: false,
            message: "This email is already registered.",
        });
    }

    const userID = randomUUID();

    const options = await createRegistrationOptions({
        userID,
        email,
        fullName,
    });

    req.session.pendingRegistration = {
        userID,
        email,
        fullName,
        challenge: options.challenge,
    };

    await saveSession(req.session);

    res.json({
        success: true,
        options,
    });
};

// =======================================
// VERIFY REGISTRATION
// =======================================

export const verifyRegister = async (req, res) => {
    const pending = req.session.pendingRegistration;

    if (!pending) {
        return res.status(400).json({
            success: false,
            message: "Registration session expired. Try again.",
        });
    }

    const verification = await verifyRegistration({
        response: req.body,
        expectedChallenge: pending.challenge,
    });

    if (!verification.verified || !verification.registrationInfo) {
        return res.status(400).json({
            success: false,
            message: "Fingerprint credential verification failed.",
        });
    }

    const {
        credential,
        credentialDeviceType,
        credentialBackedUp,
    } = verification.registrationInfo;

    const client = await getClient();

    try {
        await client.query("BEGIN");

        const userResult = await client.query(
            `INSERT INTO users (id, full_name, email)
             VALUES ($1, $2, $3)
             RETURNING id, full_name, email, role`,
            [
                pending.userID,
                pending.fullName,
                pending.email,
            ]
        );

        const transports =
            credential.transports ||
            req.body.response?.transports ||
            [];

        await client.query(
            `INSERT INTO authenticators
            (
                user_id,
                credential_id,
                public_key,
                counter,
                transports,
                device_type,
                backed_up
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                pending.userID,
                credential.id,
                Buffer.from(credential.publicKey),
                credential.counter,
                transports,
                credentialDeviceType,
                credentialBackedUp,
            ]
        );

        await client.query("COMMIT");

        const user = userResult.rows[0];

        await regenerateSession(req.session);

        req.session.user = {
            id: user.id,
            fullName: user.full_name,
            email: user.email,
            role: user.role,
        };

        await saveSession(req.session);

        await query(
            `INSERT INTO authentication_logs
             (user_id, event_type, success, ip_address)
             VALUES ($1, $2, $3, $4)`,
            [user.id, "registration", true, req.ip]
        );

        res.status(201).json({
            success: true,
            message: "Your authenticator was registered successfully.",
            user: req.session.user,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

// =======================================
// LOGIN OPTIONS
// =======================================

export const loginOptions = async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address.",
        });
    }

    const email = parsed.data.email.toLowerCase();

    const userResult = await query(
        `SELECT id, full_name, email, role
         FROM users
         WHERE email = $1 AND is_active = TRUE`,
        [email]
    );

    if (userResult.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Account or registered authenticator not found.",
        });
    }

    const user = userResult.rows[0];

    const authenticatorResult = await query(
        `SELECT credential_id, transports
         FROM authenticators
         WHERE user_id = $1`,
        [user.id]
    );

    if (authenticatorResult.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No registered authenticator found.",
        });
    }

    const options = await createAuthenticationOptions({
        authenticators: authenticatorResult.rows,
    });

    req.session.pendingAuthentication = {
        userID: user.id,
        challenge: options.challenge,
    };

    await saveSession(req.session);

    res.json({
        success: true,
        options,
    });
};

// =======================================
// VERIFY LOGIN
// =======================================

export const verifyLogin = async (req, res) => {
    const pending = req.session.pendingAuthentication;

    if (!pending) {
        return res.status(400).json({
            success: false,
            message: "Login session expired. Try again.",
        });
    }

    const credentialID = req.body?.id;

    if (typeof credentialID !== "string" || !credentialID) {
        return res.status(400).json({
            success: false,
            message: "Invalid authentication credential.",
        });
    }

    const result = await query(
        `SELECT
            id,
            full_name,
            email,
            role,
            is_active
         FROM users
         WHERE id = $1`,
        [pending.userID]
    );

    if (
        result.rows.length === 0 ||
        !result.rows[0].is_active
    ) {
        return res.status(401).json({
            success: false,
            message: "Account is unavailable.",
        });
    }

    const user = result.rows[0];

    const authenticatorResult = await query(
        `SELECT *
         FROM authenticators
         WHERE user_id = $1 AND credential_id = $2`,
        [user.id, credentialID]
    );

    if (authenticatorResult.rows.length === 0) {
        return res.status(401).json({
            success: false,
            message: "Authenticator not recognized.",
        });
    }

    const authenticator = authenticatorResult.rows[0];

    const verification = await verifyAuthentication({
        response: req.body,
        expectedChallenge: pending.challenge,
        authenticator,
    });

    if (!verification.verified) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed.",
        });
    }

    await query(
        `UPDATE authenticators
         SET counter = $1,
             last_used_at = NOW()
         WHERE id = $2`,
        [
            verification.authenticationInfo.newCounter,
            authenticator.id,
        ]
    );

    await regenerateSession(req.session);

    req.session.user = {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
    };

    await saveSession(req.session);

    await query(
        `INSERT INTO authentication_logs
         (user_id, event_type, success, ip_address)
         VALUES ($1, $2, $3, $4)`,
        [user.id, "login", true, req.ip]
    );

    res.json({
        success: true,
        message: "Authentication successful!",
        user: req.session.user,
    });
};

// =======================================
// CURRENT USER
// =======================================

export const getCurrentUser = (req, res) => {
    res.json({
        success: true,
        user: req.session.user || null,
    });
};

// =======================================
// LOGOUT
// =======================================

export const logout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie("fingerprint.sid", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });

        res.json({
            success: true,
            message: "You have logged out successfully.",
        });
    });
};