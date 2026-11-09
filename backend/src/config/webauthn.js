
import dotenv from "dotenv";

dotenv.config();

export const rpName =
  process.env.RP_NAME || "BioSecure Fingerprint Authentication";

export const rpID =
  process.env.RP_ID || "localhost";

export const expectedOrigin =
  process.env.EXPECTED_ORIGIN || "http://localhost:5173";

export const webauthnConfig = {
  rpName,
  rpID,
  expectedOrigin,
};
