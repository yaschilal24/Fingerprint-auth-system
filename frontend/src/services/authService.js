import {
    browserSupportsWebAuthn,
    startRegistration,
    startAuthentication,
} from "@simplewebauthn/browser";

import api from "./api";

// =======================================
// CHECK DEVICE SUPPORT
// =======================================

export const checkWebAuthnSupport = () => {
    return browserSupportsWebAuthn();
};

// =======================================
// REGISTER AUTHENTICATOR
// =======================================

export const registerWithFingerprint = async ({
    fullName,
    email,
}) => {
    if (!browserSupportsWebAuthn()) {
        throw new Error(
            "Your browser does not support WebAuthn."
        );
    }

    // Step 1: Request registration options
    const optionsResponse = await api.post(
        "/auth/register/options",
        {
            fullName,
            email,
        }
    );

    const options = optionsResponse.data.options;

    // Step 2: Ask the device to create a credential
    const credential = await startRegistration({
        optionsJSON: options,
    });

    // Step 3: Send credential to backend for verification
    const verificationResponse = await api.post(
        "/auth/register/verify",
        credential
    );

    return verificationResponse.data;
};

// =======================================
// LOGIN WITH AUTHENTICATOR
// =======================================

export const loginWithFingerprint = async ({
    email,
}) => {
    if (!browserSupportsWebAuthn()) {
        throw new Error(
            "Your browser does not support WebAuthn."
        );
    }

    // Step 1: Request authentication options
    const optionsResponse = await api.post(
        "/auth/login/options",
        {
            email,
        }
    );

    const options = optionsResponse.data.options;

    // Step 2: Ask device to authenticate
    const credential = await startAuthentication({
        optionsJSON: options,
    });

    // Step 3: Verify authentication response
    const verificationResponse = await api.post(
        "/auth/login/verify",
        credential
    );

    return verificationResponse.data;
};

// =======================================
// GET CURRENT USER
// =======================================

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};

// =======================================
// LOGOUT
// =======================================

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
};