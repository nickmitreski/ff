-- Fix Data Type Inconsistencies Migration
-- Convert text date fields to proper date type

-- First, check if the problematic migration exists and fix the data types
-- This addresses the issue in migration 20250611041104_copper_term.sql where date fields were defined as text

-- Fix api_costs table date field
-- Note: This will only work if the existing data can be converted to date format
DO $$
BEGIN
    -- Check if the column exists and is text type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'api_costs' 
        AND column_name = 'date' 
        AND data_type = 'text'
    ) THEN
        -- Convert text to date, handling potential invalid data
        ALTER TABLE api_costs ALTER COLUMN date TYPE date USING 
            CASE 
                WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN date::date
                WHEN date ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN to_date(date, 'MM/DD/YYYY')
                WHEN date ~ '^\d{1,2}-\d{1,2}-\d{4}$' THEN to_date(date, 'MM-DD-YYYY')
                ELSE NULL
            END;
    END IF;
END $$;

-- Fix revenues table date field
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'revenues' 
        AND column_name = 'date' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE revenues ALTER COLUMN date TYPE date USING 
            CASE 
                WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN date::date
                WHEN date ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN to_date(date, 'MM/DD/YYYY')
                WHEN date ~ '^\d{1,2}-\d{1,2}-\d{4}$' THEN to_date(date, 'MM-DD-YYYY')
                ELSE NULL
            END;
    END IF;
END $$;

-- Fix expenses table date field
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'expenses' 
        AND column_name = 'date' 
        AND data_type = 'text'
    ) THEN
        ALTER TABLE expenses ALTER COLUMN date TYPE date USING 
            CASE 
                WHEN date ~ '^\d{4}-\d{2}-\d{2}$' THEN date::date
                WHEN date ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN to_date(date, 'MM/DD/YYYY')
                WHEN date ~ '^\d{1,2}-\d{1,2}-\d{4}$' THEN to_date(date, 'MM-DD-YYYY')
                ELSE NULL
            END;
    END IF;
END $$;

-- Add NOT NULL constraints after successful conversion
DO $$
BEGIN
    -- Only add NOT NULL if the conversion was successful and no NULL values exist
    IF NOT EXISTS (SELECT 1 FROM api_costs WHERE date IS NULL) THEN
        ALTER TABLE api_costs ALTER COLUMN date SET NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM revenues WHERE date IS NULL) THEN
        ALTER TABLE revenues ALTER COLUMN date SET NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM expenses WHERE date IS NULL) THEN
        ALTER TABLE expenses ALTER COLUMN date SET NOT NULL;
    END IF;
END $$; 