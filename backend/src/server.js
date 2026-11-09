import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import helmet from "helmet";
import PgSession from "connect-pg-simple";
import userRoutes from "./routes/userRoutes.js";

import pool, {
    testDatabaseConnection,
} from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";

import {
    notFound,
    errorHandler,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

const CLIENT_URL =
    process.env.CLIENT_URL || "http://localhost:5173";

// =======================================
// ENVIRONMENT VALIDATION
// =======================================

if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32
) {
    throw new Error(
        "SESSION_SECRET must contain at least 32 characters."
    );
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing.");
}

// =======================================
// PROXY CONFIGURATION
// =======================================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// =======================================
// SECURITY MIDDLEWARE
// =======================================

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

app.use(
    cors({
    origin:"http://localhost:5173",


        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
); 

app.use(express.json({
    limit: "20kb",
}));

app.use(express.urlencoded({
    extended: true,
    limit: "20kb",
}));

// =======================================
// SESSION CONFIGURATION
// =======================================

const PgStore = PgSession(session);

app.use(
    session({
        name: "fingerprint.sid",

        store: new PgStore({
            pool,

            tableName: "user_sessions",

            createTableIfMissing: true,

            pruneSessionInterval: 15 * 60,
        }),

        secret: process.env.SESSION_SECRET,

        resave: false,

        saveUninitialized: false,

        rolling: true,

        cookie: {
            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "lax",

            maxAge: 1000 * 60 * 60 * 24,

            path: "/",
        },

    })
);

// =======================================
// HEALTH CHECK
// =======================================

app.get("/api/health", (req, res) => {
    res.json({
        success: true,

        message: "Fingerprint Authentication API is running.",

        timestamp: new Date().toISOString(),

        environment: process.env.NODE_ENV || "development",
    });
});

// =======================================
// AUTHENTICATION ROUTES
// =======================================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// =======================================
// ERROR HANDLING
// =======================================

app.use(notFound);

app.use(errorHandler);

// =======================================
// START SERVER
// =======================================

const startServer = async () => {
    const databaseConnected =
        await testDatabaseConnection();

    if (!databaseConnected) {
        console.error(
            "Server startup stopped: Database unavailable."
        );

        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log("------------------------------------");
        console.log("Fingerprint Authentication System");
        console.log("------------------------------------");
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`API: http://localhost:${PORT}/api`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log("------------------------------------");
    });
};

startServer();