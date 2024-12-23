-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing projects table if it exists
DROP TABLE IF EXISTS projects;

-- Table creation
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- Auto-generated UUID as the primary key
    title TEXT NOT NULL,                           -- Required title
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Auto-set creation timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Auto-set updated timestamp
    user_id UUID NOT NULL,                         -- Reference to the user ID (foreign key)
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Trigger function to update the 'updated_at' column on row updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update 'updated_at' before every update
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Create assets table with proper structure
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    title TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    content TEXT DEFAULT '',
    token_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create asset processing jobs table with proper structure
CREATE TABLE asset_processing_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL UNIQUE,
    project_id UUID NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    last_heart_beat TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Add trigger for updating the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_processing_jobs_updated_at
    BEFORE UPDATE ON asset_processing_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
