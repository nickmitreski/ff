-- Add Performance Indexes Migration
-- Note: Using regular CREATE INDEX instead of CONCURRENTLY due to transaction block limitations

-- API Costs table indexes
CREATE INDEX IF NOT EXISTS idx_api_costs_date ON api_costs(date);
CREATE INDEX IF NOT EXISTS idx_api_costs_provider_service ON api_costs(provider, service);
CREATE INDEX IF NOT EXISTS idx_api_costs_created_at ON api_costs(created_at);

-- Revenues table indexes
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON revenues(category);
CREATE INDEX IF NOT EXISTS idx_revenues_created_at ON revenues(created_at);

-- Expenses table indexes
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_due_date ON jobs(due_date);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

-- Subscriptions table indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);

-- Contact submissions table indexes (already exist, but ensuring they're there)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_timestamp ON contact_submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Chat tables indexes (already exist, but ensuring they're there)
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_financial_summary_revenues ON revenues(date, category, amount);
CREATE INDEX IF NOT EXISTS idx_financial_summary_expenses ON expenses(date, category, amount);
CREATE INDEX IF NOT EXISTS idx_job_management ON jobs(status, due_date, client_id);
CREATE INDEX IF NOT EXISTS idx_subscription_management ON subscriptions(status, next_billing_date, customer_email);

-- Add check constraints for data validation (using DO blocks to check if they exist)
DO $$
BEGIN
    -- Add constraint to api_costs if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_cost_positive' AND conrelid = 'api_costs'::regclass
    ) THEN
        ALTER TABLE api_costs ADD CONSTRAINT check_cost_positive CHECK (cost > 0);
    END IF;
END $$;

DO $$
BEGIN
    -- Add constraint to revenues if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_amount_positive' AND conrelid = 'revenues'::regclass
    ) THEN
        ALTER TABLE revenues ADD CONSTRAINT check_amount_positive CHECK (amount > 0);
    END IF;
END $$;

DO $$
BEGIN
    -- Add constraint to expenses if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_amount_positive' AND conrelid = 'expenses'::regclass
    ) THEN
        ALTER TABLE expenses ADD CONSTRAINT check_amount_positive CHECK (amount > 0);
    END IF;
END $$;

DO $$
BEGIN
    -- Add constraint to jobs if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_progress_range' AND conrelid = 'jobs'::regclass
    ) THEN
        ALTER TABLE jobs ADD CONSTRAINT check_progress_range CHECK (progress >= 0 AND progress <= 100);
    END IF;
END $$;

DO $$
BEGIN
    -- Add constraint to subscriptions if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_amount_positive' AND conrelid = 'subscriptions'::regclass
    ) THEN
        ALTER TABLE subscriptions ADD CONSTRAINT check_amount_positive CHECK (amount > 0);
    END IF;
END $$;

-- Add email validation constraint for contact submissions
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_email' AND conrelid = 'contact_submissions'::regclass
    ) THEN
        ALTER TABLE contact_submissions ADD CONSTRAINT valid_email 
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    END IF;
END $$;

-- Add phone validation constraint for clients (optional field)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_phone' AND conrelid = 'clients'::regclass
    ) THEN
        ALTER TABLE clients ADD CONSTRAINT valid_phone 
        CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');
    END IF;
END $$;

-- Add due date validation constraint for jobs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'valid_due_date' AND conrelid = 'jobs'::regclass
    ) THEN
        ALTER TABLE jobs ADD CONSTRAINT valid_due_date 
        CHECK (due_date IS NULL OR due_date >= created_at);
    END IF;
END $$; 