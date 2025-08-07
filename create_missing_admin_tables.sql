-- Create missing admin tables for the dashboard
-- This file creates all the tables that admin components are trying to access

-- 1. TODOS TABLE
CREATE TABLE IF NOT EXISTS public.todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  task text NOT NULL,
  is_completed boolean DEFAULT false
);

-- Enable RLS for todos
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies for todos table
CREATE POLICY "Users can manage their own todos"
  ON public.todos
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for todos
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON public.todos(created_at);
CREATE INDEX IF NOT EXISTS idx_todos_is_completed ON public.todos(is_completed);

-- 2. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  title text,
  content text
);

-- Enable RLS for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for notes table
CREATE POLICY "Users can manage their own notes"
  ON public.notes
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for notes
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at);

-- 3. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'lead' CHECK (status IN ('active', 'inactive', 'lead')),
  notes text
);

-- Enable RLS for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for clients table
CREATE POLICY "Users can manage their own clients"
  ON public.clients
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for clients
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

-- 4. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  due_date timestamptz,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'review', 'completed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  assigned_to text[],
  budget decimal(10,2),
  invoiced_amount decimal(10,2),
  paid_amount decimal(10,2)
);

-- Enable RLS for jobs
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for jobs table
CREATE POLICY "Users can manage their own jobs"
  ON public.jobs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON public.jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON public.jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_due_date ON public.jobs(due_date);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id text NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  plan_name text NOT NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  interval text DEFAULT 'month' CHECK (interval IN ('month', 'year')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  next_billing_date timestamptz,
  payment_method text
);

-- Enable RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions table
CREATE POLICY "Users can manage their own subscriptions"
  ON public.subscriptions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON public.subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON public.subscriptions(next_billing_date);

-- 6. API COSTS TABLE
CREATE TABLE IF NOT EXISTS public.api_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  service text NOT NULL,
  cost decimal(10,2) NOT NULL,
  period text NOT NULL,
  date timestamptz DEFAULT now(),
  notes text
);

-- Enable RLS for api_costs
ALTER TABLE public.api_costs ENABLE ROW LEVEL SECURITY;

-- Create policies for api_costs table
CREATE POLICY "Users can manage their own api costs"
  ON public.api_costs
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for api_costs
CREATE INDEX IF NOT EXISTS idx_api_costs_user_id ON public.api_costs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_costs_provider ON public.api_costs(provider);
CREATE INDEX IF NOT EXISTS idx_api_costs_date ON public.api_costs(date);
CREATE INDEX IF NOT EXISTS idx_api_costs_period ON public.api_costs(period);

-- 7. REVENUES TABLE
CREATE TABLE IF NOT EXISTS public.revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  source text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date timestamptz DEFAULT now(),
  description text,
  category text NOT NULL
);

-- Enable RLS for revenues
ALTER TABLE public.revenues ENABLE ROW LEVEL SECURITY;

-- Create policies for revenues table
CREATE POLICY "Users can manage their own revenues"
  ON public.revenues
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for revenues
CREATE INDEX IF NOT EXISTS idx_revenues_user_id ON public.revenues(user_id);
CREATE INDEX IF NOT EXISTS idx_revenues_source ON public.revenues(source);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON public.revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON public.revenues(category);

-- 8. EXPENSES TABLE
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  amount decimal(10,2) NOT NULL,
  date timestamptz DEFAULT now(),
  description text,
  recurring boolean DEFAULT false
);

-- Enable RLS for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses table
CREATE POLICY "Users can manage their own expenses"
  ON public.expenses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for expenses
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON public.expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON public.expenses(recurring);

-- 9. API KEYS TABLE (if not exists)
CREATE TABLE IF NOT EXISTS public.api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  api_key text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text,
  last_used_at timestamptz,
  usage_count integer DEFAULT 0
);

-- Enable RLS for api_keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for api_keys table
CREATE POLICY "Users can manage their own api keys"
  ON public.api_keys
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for api_keys
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON public.api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON public.api_keys(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON public.api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 