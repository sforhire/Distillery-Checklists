
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Checklist Templates
create table if not exists checklist_templates (
  id uuid primary key default uuid_generate_v4(),
  type text not null unique, -- 'opening', 'closing', 'managerial'
  created_at timestamp with time zone default now()
);

-- 2. Template Items
create table if not exists checklist_template_items (
  id uuid primary key default uuid_generate_v4(),
  template_id uuid references checklist_templates(id) on delete cascade,
  text text not null,
  order_index integer not null default 0,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. Checklist Entries (The actual log)
create table if not exists checklist_entries (
  id uuid primary key default uuid_generate_v4(),
  type text not null,
  created_by_name text,
  entry_notes text,
  created_at timestamp with time zone default now(),
  completed_at timestamp with time zone -- null means 'In Progress'
);

-- 4. Entry Items (The snapshot)
create table if not exists checklist_entry_items (
  id uuid primary key default uuid_generate_v4(),
  entry_id uuid references checklist_entries(id) on delete cascade,
  item_text_snapshot text not null,
  order_index integer not null,
  checked boolean default false,
  item_notes text,
  created_at timestamp with time zone default now()
);

-- Clear existing to ensure fresh seed
truncate checklist_template_items cascade;
truncate checklist_templates cascade;

-- Initial Templates Seed
insert into checklist_templates (type) values ('opening'), ('closing'), ('managerial');

-- Opening Checklist Items
with opening_template as (select id from checklist_templates where type = 'opening' limit 1)
insert into checklist_template_items (template_id, text, order_index)
select id, text, idx from opening_template, (values 
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
) as t(text, idx);

-- Closing Checklist Items
with closing_template as (select id from checklist_templates where type = 'closing' limit 1)
insert into checklist_template_items (template_id, text, order_index)
select id, text, idx from closing_template, (values 
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
) as t(text, idx);
