-- profiles tablosuna subscription_plan sütununu ekler
-- Varsayılan değer 'free' olarak ayarlanır
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'free';