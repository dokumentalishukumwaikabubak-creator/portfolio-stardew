-- Add start_date and end_date fields to portfolio_items table
-- Run this migration in your Supabase SQL Editor

ALTER TABLE portfolio_items 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add comment for clarity
COMMENT ON COLUMN portfolio_items.start_date IS 'Project start date';
COMMENT ON COLUMN portfolio_items.end_date IS 'Project end date (NULL means ongoing/current)';

