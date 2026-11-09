-- ==========================================
-- FINGERPRINT AUTHENTICATION SYSTEM
-- PostgreSQL Database Schema
-- ==========================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(120) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    role VARCHAR(20) NOT NULL DEFAULT 'user'
        CHECK (role IN ('user', 'admin')),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WebAuthn authenticators table
CREATE TABLE IF NOT EXISTS authenticators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    credential_id TEXT NOT NULL UNIQUE,

    public_key BYTEA NOT NULL,

    counter BIGINT NOT NULL DEFAULT 0,

    transports TEXT[] DEFAULT '{}',

    device_type VARCHAR(30),

    backed_up BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    last_used_at TIMESTAMPTZ
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS idx_authenticators_user_id
ON authenticators(user_id);

-- 4. Authentication history
CREATE TABLE IF NOT EXISTS authentication_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id UUID REFERENCES users(id)
        ON DELETE SET NULL,

    event_type VARCHAR(40) NOT NULL,

    success BOOLEAN NOT NULL DEFAULT FALSE,

    ip_address INET,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Index for authentication history
CREATE INDEX IF NOT EXISTS idx_auth_logs_user
ON authentication_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_auth_logs_created
ON authentication_logs(created_at DESC);