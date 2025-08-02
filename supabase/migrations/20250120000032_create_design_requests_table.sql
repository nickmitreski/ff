-- Create design_requests table
CREATE TABLE IF NOT EXISTS public.design_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  service_type text NOT NULL,
  request_details text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new',
  admin_notes text,
  responded_at timestamptz,
  response_by text
);

-- Enable Row Level Security
ALTER TABLE public.design_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for design_requests table
CREATE POLICY "Allow public to insert design_requests"
  ON public.design_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read design_requests"
  ON public.design_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update design_requests"
  ON public.design_requests
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete design_requests"
  ON public.design_requests
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_design_requests_timestamp ON public.design_requests(timestamp);
CREATE INDEX IF NOT EXISTS idx_design_requests_email ON public.design_requests(email);
CREATE INDEX IF NOT EXISTS idx_design_requests_service_type ON public.design_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_design_requests_status ON public.design_requests(status); 