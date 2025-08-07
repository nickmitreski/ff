-- Create storage buckets for the application

-- Create images bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create videos bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('videos', 'videos', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create avatars bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create documents bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('documents', 'documents', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create coming soon notifications table
CREATE TABLE IF NOT EXISTS public.coming_soon_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  feature_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  notified boolean DEFAULT false,
  notified_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE public.coming_soon_notifications ENABLE ROW LEVEL SECURITY;

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

-- Create policies for images bucket
DO $$
BEGIN
  -- Allow public read access to images bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Public Read Access for images',
      'images',
      '{"name":"Public Read Access for images","owner":null,"resource":"object","action":"read","roles":["anon"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to upload to images bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Upload Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Upload Access for images',
      'images',
      '{"name":"Authenticated Upload Access for images","owner":"auth.uid()","resource":"object","action":"insert","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to update their own images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Update Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Update Access for images',
      'images',
      '{"name":"Authenticated Update Access for images","owner":"auth.uid()","resource":"object","action":"update","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to delete their own images
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Delete Access for images' AND bucket_id = 'images'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Delete Access for images',
      'images',
      '{"name":"Authenticated Delete Access for images","owner":"auth.uid()","resource":"object","action":"delete","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;
END $$;

-- Create policies for videos bucket
DO $$
BEGIN
  -- Allow public read access to videos bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access for videos' AND bucket_id = 'videos'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Public Read Access for videos',
      'videos',
      '{"name":"Public Read Access for videos","owner":null,"resource":"object","action":"read","roles":["anon"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to upload to videos bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Upload Access for videos' AND bucket_id = 'videos'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Upload Access for videos',
      'videos',
      '{"name":"Authenticated Upload Access for videos","owner":"auth.uid()","resource":"object","action":"insert","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;
END $$;

-- Create policies for avatars bucket
DO $$
BEGIN
  -- Allow public read access to avatars bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Public Read Access for avatars' AND bucket_id = 'avatars'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Public Read Access for avatars',
      'avatars',
      '{"name":"Public Read Access for avatars","owner":null,"resource":"object","action":"read","roles":["anon"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to upload to avatars bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Upload Access for avatars' AND bucket_id = 'avatars'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Upload Access for avatars',
      'avatars',
      '{"name":"Authenticated Upload Access for avatars","owner":"auth.uid()","resource":"object","action":"insert","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;
END $$;

-- Create policies for documents bucket (private)
DO $$
BEGIN
  -- Allow authenticated users to read their own documents
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Read Access for documents' AND bucket_id = 'documents'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Read Access for documents',
      'documents',
      '{"name":"Authenticated Read Access for documents","owner":"auth.uid()","resource":"object","action":"read","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;

  -- Allow authenticated users to upload to documents bucket
  IF NOT EXISTS (
    SELECT 1 FROM storage.policies 
    WHERE name = 'Authenticated Upload Access for documents' AND bucket_id = 'documents'
  ) THEN
    INSERT INTO storage.policies (name, bucket_id, definition)
    VALUES (
      'Authenticated Upload Access for documents',
      'documents',
      '{"name":"Authenticated Upload Access for documents","owner":"auth.uid()","resource":"object","action":"insert","roles":["authenticated"],"condition":null}'::jsonb
    );
  END IF;
END $$;
