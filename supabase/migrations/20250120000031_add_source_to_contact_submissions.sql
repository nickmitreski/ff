-- Add source field to contact_submissions table to track where enquiries come from
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS source text DEFAULT 'general';

-- Add index for better querying by source
CREATE INDEX IF NOT EXISTS idx_contact_submissions_source ON public.contact_submissions(source);

-- Update existing records to have 'general' as source
UPDATE public.contact_submissions 
SET source = 'general' 
WHERE source IS NULL; 