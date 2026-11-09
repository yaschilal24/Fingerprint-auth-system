import dotenv from "dotenv";

import { query } from "../config/database.js";

dotenv.config();

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
    console.error(
        "Usage: npm run create-admin -- user@example.com"
    );

    process.exit(1);
}

const createAdmin = async () => {
    try {
        const result = await query(
            `UPDATE users
             SET role = 'admin',
                 updated_at = NOW()
             WHERE email = $1
             RETURNING id, full_name, email, role`,
            [email]
        );

        if (result.rows.length === 0) {
            console.error(
                "User not found. Register this user first."
            );

            process.exitCode = 1;
            return;
        }

        console.log("Administrator created successfully.");

        console.table(result.rows);
    } catch (error) {
        console.error("Administrator creation failed:", error.message);
        process.exitCode = 1;
    } finally {
        const { default: pool } = await import("../config/database.js");

        await pool.end();
    }
};

createAdmin();