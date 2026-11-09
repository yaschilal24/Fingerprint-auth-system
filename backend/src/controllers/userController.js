import { query } from "../config/database.js";

// =======================================
// GET ALL REGISTERED USERS
// =======================================

export const getAllUsers = async (req, res) => {
    const result = await query(
        `SELECT
            u.id,
            u.full_name,
            u.email,
            u.role,
            u.is_active,
            u.created_at,
            COUNT(a.id)::INTEGER AS authenticator_count
         FROM users u
         LEFT JOIN authenticators a
            ON a.user_id = u.id
         GROUP BY u.id
         ORDER BY u.created_at DESC`
    );

    res.json({
        success: true,
        total: result.rows.length,
        users: result.rows,
    });
};

// =======================================
// GET USER PROFILE
// =======================================

export const getUserProfile = async (req, res) => {
    const result = await query(
        `SELECT
            id,
            full_name,
            email,
            role,
            created_at
         FROM users
         WHERE id = $1`,
        [req.session.user.id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    res.json({
        success: true,
        user: result.rows[0],
    });
};

// =======================================
// GET AUTHENTICATION HISTORY
// =======================================

export const getAuthenticationHistory = async (req, res) => {
    const result = await query(
        `SELECT
            id,
            event_type,
            success,
            created_at
         FROM authentication_logs
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 20`,
        [req.session.user.id]
    );

    res.json({
        success: true,
        history: result.rows,
    });
};

// =======================================
// DEACTIVATE USER
// =======================================

export const deactivateUser = async (req, res) => {
    const { id } = req.params;

    if (id === req.session.user.id) {
        return res.status(400).json({
            success: false,
            message: "You cannot deactivate your own account.",
        });
    }

    const result = await query(
        `UPDATE users
         SET is_active = FALSE,
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, full_name, email`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    res.json({
        success: true,
        message: "User deactivated successfully.",
        user: result.rows[0],
    });
};