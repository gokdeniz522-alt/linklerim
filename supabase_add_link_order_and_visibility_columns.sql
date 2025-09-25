-- Add 'order' column to 'links' table
ALTER TABLE links
ADD COLUMN "order" INT;

-- Set initial order for existing links (optional, but good for existing data)
-- This assigns a sequential order based on 'created_at'
UPDATE links
SET "order" = sub.rn
FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) as rn
    FROM links
) as sub
WHERE links.id = sub.id;

-- Make 'order' column NOT NULL and add a default value for new rows
ALTER TABLE links
ALTER COLUMN "order" SET NOT NULL,
ALTER COLUMN "order" SET DEFAULT 0; -- Or a more dynamic default if needed, but 0 is fine for initial

-- Add 'is_visible' column to 'links' table
ALTER TABLE links
ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;