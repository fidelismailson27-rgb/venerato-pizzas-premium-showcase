-- Non-destructive media bucket bootstrap.
-- Existing RLS policies are defined in 20260627172724_24787e81-3886-4285-9d54-384a98cd7799.sql.
-- This migration only creates the bucket when it is missing.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  26214400,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;
