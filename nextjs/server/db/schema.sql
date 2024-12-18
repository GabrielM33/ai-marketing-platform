-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Table creation
CREATE TABLE projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- Auto-generated UUID as the primary key
    title TEXT NOT NULL,                           -- Required title
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Auto-set creation timestamp
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,  -- Auto-set updated timestamp
    user_id UUID NOT NULL,                         -- Reference to the user ID (foreign key)
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
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
