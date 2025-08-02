-- Fix missing user_id columns in existing tables
-- This script adds user_id columns to tables that were created without them

-- Add user_id column to api_costs if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'api_costs' AND column_name = 'user_id') THEN
        ALTER TABLE public.api_costs ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to revenues if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'revenues' AND column_name = 'user_id') THEN
        ALTER TABLE public.revenues ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to expenses if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'expenses' AND column_name = 'user_id') THEN
        ALTER TABLE public.expenses ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to clients if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'clients' AND column_name = 'user_id') THEN
        ALTER TABLE public.clients ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to jobs if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'jobs' AND column_name = 'user_id') THEN
        ALTER TABLE public.jobs ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to subscriptions if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'subscriptions' AND column_name = 'user_id') THEN
        ALTER TABLE public.subscriptions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to api_keys if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'api_keys' AND column_name = 'user_id') THEN
        ALTER TABLE public.api_keys ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to todos if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'todos' AND column_name = 'user_id') THEN
        ALTER TABLE public.todos ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add user_id column to notes if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'notes' AND column_name = 'user_id') THEN
        ALTER TABLE public.notes ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Create indexes for user_id columns if they don't exist
CREATE INDEX IF NOT EXISTS idx_api_costs_user_id ON public.api_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_revenues_user_id ON public.revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- Drop existing overly permissive policies if they exist
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

DROP POLICY IF EXISTS "Allow authenticated users to read api keys" ON api_keys;
DROP POLICY IF EXISTS "Allow authenticated users to insert api keys" ON api_keys;
DROP POLICY IF EXISTS "Allow authenticated users to update api keys" ON api_keys;
DROP POLICY IF EXISTS "Allow authenticated users to delete api keys" ON api_keys;

-- Create secure user-specific policies for all tables
CREATE POLICY "Users can manage their own api costs"
  ON api_costs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own revenues"
  ON revenues
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own api keys"
  ON api_keys
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own todos"
  ON todos
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own notes"
  ON notes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid()); 