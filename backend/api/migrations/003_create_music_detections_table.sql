-- Create music_detections table to store identified tracks
CREATE TABLE IF NOT EXISTS music_detections (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(100) REFERENCES jobs(id) ON DELETE CASCADE,
    upload_id INTEGER REFERENCES uploads(id) ON DELETE CASCADE,
    recognized BOOLEAN DEFAULT FALSE,
    confidence VARCHAR(50),
    title VARCHAR(500),
    artist VARCHAR(500),
    album VARCHAR(500),
    fonte VARCHAR(100),
    score FLOAT DEFAULT 0,
    timestamp_start VARCHAR(50),
    timestamp_end VARCHAR(50),
    policy VARCHAR(50) DEFAULT 'unknown',
    gmusic_id VARCHAR(100),
    validated BOOLEAN DEFAULT NULL,
    validated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_music_detections_job_id ON music_detections(job_id);
CREATE INDEX idx_music_detections_upload_id ON music_detections(upload_id);
CREATE INDEX idx_music_detections_validated ON music_detections(validated);
