-- Create uploads table to track uploaded audio/video files
CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL UNIQUE,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'uploaded',
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster queries
CREATE INDEX idx_uploads_status ON uploads(status);

-- Create index on created_at for sorting
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- Create index on user_id for user-specific queries
CREATE INDEX idx_uploads_user_id ON uploads(user_id);
