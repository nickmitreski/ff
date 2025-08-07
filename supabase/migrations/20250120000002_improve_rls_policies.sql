-- Improve RLS Policies Migration
-- Replace overly permissive policies with more secure user-specific access

-- First, we need to add user_id columns to tables that don't have them
-- This allows for proper user-specific access control

-- Add user_id column to tables that need it
ALTER TABLE api_costs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE revenues ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create a function to get current user ID safely
CREATE OR REPLACE FUNCTION auth.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to read api costs" ON api_costs;
DROP POLICY IF EXISTS "Allow authenticated users to insert api costs" ON api_costs;
DROP POLICY IF EXISTS "Allow authenticated users to update api costs" ON api_costs;
DROP POLICY IF EXISTS "Allow authenticated users to delete api costs" ON api_costs;

DROP POLICY IF EXISTS "Allow authenticated users to read revenues" ON revenues;
DROP POLICY IF EXISTS "Allow authenticated users to insert revenues" ON revenues;
DROP POLICY IF EXISTS "Allow authenticated users to update revenues" ON revenues;
DROP POLICY IF EXISTS "Allow authenticated users to delete revenues" ON revenues;

DROP POLICY IF EXISTS "Allow authenticated users to read expenses" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated users to insert expenses" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated users to update expenses" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated users to delete expenses" ON expenses;

DROP POLICY IF EXISTS "Allow authenticated users to read clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to insert clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to update clients" ON clients;
DROP POLICY IF EXISTS "Allow authenticated users to delete clients" ON clients;

DROP POLICY IF EXISTS "Allow authenticated users to read jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated users to insert jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated users to update jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated users to delete jobs" ON jobs;

DROP POLICY IF EXISTS "Allow authenticated users to read subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated users to insert subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated users to update subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated users to delete subscriptions" ON subscriptions;

-- Create secure user-specific policies for api_costs
CREATE POLICY "Users can manage their own api costs"
  ON api_costs
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Create secure user-specific policies for revenues
CREATE POLICY "Users can manage their own revenues"
  ON revenues
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Create secure user-specific policies for expenses
CREATE POLICY "Users can manage their own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Create secure user-specific policies for clients
CREATE POLICY "Users can manage their own clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Create secure user-specific policies for jobs
CREATE POLICY "Users can manage their own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Create secure user-specific policies for subscriptions
CREATE POLICY "Users can manage their own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- For contact_submissions, keep public insert but restrict read/update/delete to authenticated users
-- This allows contact forms to work without authentication
DROP POLICY IF EXISTS "Allow public to insert contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to delete contact_submissions" ON contact_submissions;

CREATE POLICY "Allow public to insert contact submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- For chat tables, keep existing policies but add user_id if needed
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update chat policies to be user-specific
DROP POLICY IF EXISTS "Allow insert for anonymous users" ON chat_sessions;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON chat_sessions;

CREATE POLICY "Users can manage their own chat sessions"
  ON chat_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.current_user_id())
  WITH CHECK (user_id = auth.current_user_id());

-- Allow anonymous users to create chat sessions (for public chat)
CREATE POLICY "Allow anonymous users to create chat sessions"
  ON chat_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Chat messages should be accessible to users who own the session
DROP POLICY IF EXISTS "Allow insert for anonymous users" ON chat_messages;
DROP POLICY IF EXISTS "Allow select for authenticated users" ON chat_messages;

CREATE POLICY "Users can manage messages in their sessions"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.current_user_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.session_id 
      AND chat_sessions.user_id = auth.current_user_id()
    )
  );

-- Allow anonymous users to insert messages (for public chat)
CREATE POLICY "Allow anonymous users to insert chat messages"
  ON chat_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for user_id columns for better performance
CREATE INDEX IF NOT EXISTS idx_api_costs_user_id ON api_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_revenues_user_id ON revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id); 