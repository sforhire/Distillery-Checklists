
-- ENABLE UUID EXTENSION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHECKLIST TEMPLATES
-- Stores the master definitions for each checklist category
CREATE TABLE IF NOT EXISTS checklist_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL UNIQUE, -- 'opening', 'closing', 'managerial'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TEMPLATE ITEMS
-- Stores the current active items for the templates. 
-- Changing these does NOT affect existing logs.
CREATE TABLE IF NOT EXISTS checklist_template_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES checklist_templates(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CHECKLIST ENTRIES (THE LOGS)
-- Stores the actual sessions started by staff.
CREATE TABLE IF NOT EXISTS checklist_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  created_by_name TEXT,
  entry_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE -- NULL means 'In Progress'
);

-- 4. ENTRY ITEMS (THE SNAPSHOT)
-- When a log is started, a snapshot of the template items is copied here.
-- This ensures historical logs never change even if the master template is edited.
CREATE TABLE IF NOT EXISTS checklist_entry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID REFERENCES checklist_entries(id) ON DELETE CASCADE,
  item_text_snapshot TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  checked BOOLEAN DEFAULT FALSE,
  item_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CLEAN SEED (Safe to run multiple times, but clears existing templates/items)
TRUNCATE checklist_template_items CASCADE;
TRUNCATE checklist_templates CASCADE;

-- INITIAL TEMPLATE CATEGORIES
INSERT INTO checklist_templates (type) VALUES 
  ('opening'), 
  ('closing'), 
  ('managerial');

-- SEEDING OPENING CHECKLIST ITEMS (From Distillery Photos)
WITH opening_template AS (SELECT id FROM checklist_templates WHERE type = 'opening' LIMIT 1)
INSERT INTO checklist_template_items (template_id, text, order_index)
SELECT id, text, idx FROM opening_template, (VALUES 
  ('Put Sign Out', 0),
  ('Open Sign On', 1),
  ('Front Door Unlocked', 2),
  ('Doors Opened', 3),
  ('Uplights On', 4),
  ('Music On', 5),
  ('Bar/Store Lights On', 6),
  ('Lamps/Candles Out', 7),
  ('Paper Towels Stocked', 8),
  ('Toilet Paper Stocked', 9),
  ('Dishwasher On', 10),
  ('Outstanding Dishes Washed', 11),
  ('Oven On', 12),
  ('Ice In Well', 13),
  ('Sinks Filled', 14),
  ('Bar Mats Out', 15),
  ('Bottles Restocked On Back Bar', 16)
) AS t(text, idx);

-- SEEDING CLOSING CHECKLIST ITEMS (From Distillery Photos)
WITH closing_template AS (SELECT id FROM checklist_templates WHERE type = 'closing' LIMIT 1)
INSERT INTO checklist_template_items (template_id, text, order_index)
SELECT id, text, idx FROM closing_template, (VALUES 
  ('Sign Brought In', 0),
  ('Front Door Locked', 1),
  ('Doors Secured', 2),
  ('Uplights Off', 3),
  ('Lamps/Candles On Chargers', 4),
  ('Trash Taken Out', 5),
  ('Bathroom Trash Taken Out', 6),
  ('Oven Off', 7),
  ('Dishwasher Off', 8),
  ('Liquors Capped', 9),
  ('Sinks Clean', 10),
  ('Bar Mats Put Away', 11)
) AS t(text, idx);
