ALTER TABLE profiles
ADD COLUMN youtube_url TEXT,
ADD COLUMN youtube_visibility TEXT NOT NULL DEFAULT 'visible';