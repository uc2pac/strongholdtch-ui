-- Migration: Change card number from INTEGER to VARCHAR to support alphanumeric values like "4a", "4b"

-- First, drop the unique constraint that includes the number column
ALTER TABLE cards DROP CONSTRAINT IF EXISTS cards_set_id_number_key;

-- Change the number column type from INTEGER to VARCHAR(20)
ALTER TABLE cards ALTER COLUMN number TYPE VARCHAR(20) USING number::text;

-- Recreate the unique constraint with the new VARCHAR type
ALTER TABLE cards ADD CONSTRAINT cards_set_id_number_key UNIQUE(set_id, number);

-- Update the index to work with VARCHAR
DROP INDEX IF EXISTS idx_cards_number;
CREATE INDEX idx_cards_number ON cards(set_id, number);
