-- Enable Row Level Security for the 'links' table if not already enabled
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to update their own links
CREATE POLICY "Allow authenticated users to update their own links"
ON links FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);