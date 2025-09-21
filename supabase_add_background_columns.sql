ALTER TABLE public.profiles
ADD COLUMN background_type TEXT DEFAULT 'none',
ADD COLUMN background_value TEXT;