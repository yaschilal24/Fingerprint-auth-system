import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import {
    rpName,
    rpID,
    expectedOrigin,
} from "../config/webauthn.js";

// =======================================
// GENERATE REGISTRATION OPTIONS
// =======================================

export const createRegistrationOptions = async ({
    userID,
    email,
    fullName,
    authenticators = [],
}) => {
    return await generateRegistrationOptions({
        rpName,

        rpID,

        userID: new Uint8Array(
            Buffer.from(userID.replaceAll("-", ""), "hex")
        ),

        userName: email,

        userDisplayName: fullName,

        attestationType: "none",

        excludeCredentials: authenticators.map((authenticator) => ({
            id: authenticator.credential_id,

            transports: authenticator.transports || [],
        })),

        authenticatorSelection: {
            residentKey: "preferred",

            userVerification: "required",
        },
    });
};

// =======================================
// VERIFY REGISTRATION
// =======================================

export const verifyRegistration = async ({
    response,
    expectedChallenge,
}) => {
    return await verifyRegistrationResponse({
        response,

        expectedChallenge,

        expectedOrigin,

        expectedRPID: rpID,

        requireUserVerification: true,
    });
};

// =======================================
// GENERATE LOGIN OPTIONS
// =======================================

export const createAuthenticationOptions = async ({
    authenticators,
}) => {
    return await generateAuthenticationOptions({
        rpID,

        allowCredentials: authenticators.map((authenticator) => ({
            id: authenticator.credential_id,

            transports: authenticator.transports || [],
        })),

        userVerification: "required",
    });
};

// =======================================
// VERIFY LOGIN
// =======================================

export const verifyAuthentication = async ({
    response,
    expectedChallenge,
    authenticator,
}) => {
    return await verifyAuthenticationResponse({
        response,

        expectedChallenge,

        expectedOrigin,

        expectedRPID: rpID,

        requireUserVerification: true,

        credential: {
            id: authenticator.credential_id,

            publicKey: new Uint8Array(
                authenticator.public_key
            ),

            counter: Number(authenticator.counter),

            transports: authenticator.transports || [],
        },
    });
};