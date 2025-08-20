-- Add set code and total_cards columns to existing sets table
-- This migration is safe to run on existing databases

ALTER TABLE sets 
ADD COLUMN IF NOT EXISTS code VARCHAR(50),
ADD COLUMN IF NOT EXISTS total_cards INTEGER;

-- Update any existing data that might need it
-- No changes needed since these fields are optional
