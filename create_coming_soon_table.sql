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