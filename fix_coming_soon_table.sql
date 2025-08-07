-- Fix coming soon notifications table structure
-- This script will update the existing table to have the correct column structure

-- First, let's check if the table exists and what columns it has
-- If the table doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.coming_soon_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  feature_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  notified boolean DEFAULT false,
  notified_at timestamptz
);

-- If the table exists but has the old 'game_name' column, rename it to 'feature_name'
DO $$
BEGIN
  -- Check if game_name column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coming_soon_notifications' 
    AND column_name = 'game_name'
  ) THEN
    -- Rename game_name to feature_name
    ALTER TABLE public.coming_soon_notifications 
    RENAME COLUMN game_name TO feature_name;
  END IF;
  
  -- Check if feature_name column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'coming_soon_notifications' 
    AND column_name = 'feature_name'
  ) THEN
    -- Add feature_name column
    ALTER TABLE public.coming_soon_notifications 
    ADD COLUMN feature_name text NOT NULL DEFAULT 'Unknown Feature';
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.coming_soon_notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert coming_soon_notifications" ON public.coming_soon_notifications;
DROP POLICY IF EXISTS "Allow authenticated users to read coming_soon_notifications" ON public.coming_soon_notifications;
DROP POLICY IF EXISTS "Allow authenticated users to update coming_soon_notifications" ON public.coming_soon_notifications;
DROP POLICY IF EXISTS "Allow authenticated users to delete coming_soon_notifications" ON public.coming_soon_notifications;

-- Create policies for coming_soon_notifications table
CREATE POLICY "Allow public to insert coming_soon_notifications"
  ON public.coming_soon_notifications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read coming_soon_notifications"
  ON public.coming_soon_notifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update coming_soon_notifications"
  ON public.coming_soon_notifications
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete coming_soon_notifications"
  ON public.coming_soon_notifications
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coming_soon_notifications_email ON public.coming_soon_notifications(email);
CREATE INDEX IF NOT EXISTS idx_coming_soon_notifications_feature_name ON public.coming_soon_notifications(feature_name);
CREATE INDEX IF NOT EXISTS idx_coming_soon_notifications_created_at ON public.coming_soon_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_coming_soon_notifications_notified ON public.coming_soon_notifications(notified);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'coming_soon_notifications' 
ORDER BY ordinal_position; 