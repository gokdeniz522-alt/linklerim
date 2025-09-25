-- Enable Row Level Security for the 'links' table if not already enabled
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to SELECT (read) their own links
DROP POLICY IF EXISTS "Allow authenticated users to view their own links" ON links;
CREATE POLICY "Allow authenticated users to view their own links"
ON links FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy to allow authenticated users to INSERT (create) their own links
DROP POLICY IF EXISTS "Allow authenticated users to create links" ON links;
CREATE POLICY "Allow authenticated users to create links"
ON links FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy to allow authenticated users to UPDATE (modify) their own links
DROP POLICY IF EXISTS "Allow authenticated users to update their own links" ON links;
CREATE POLICY "Allow authenticated users to update their own links"
ON links FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy to allow authenticated users to DELETE their own links
DROP POLICY IF EXISTS "Allow authenticated users to delete their own links" ON links;
CREATE POLICY "Allow authenticated users to delete their own links"
ON links FOR DELETE
TO authenticated
USING (auth.uid() = user_id);