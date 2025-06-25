-- Tool Directory Database Schema
-- This file contains the complete database schema for Module 2: Tool Directory

-- Tool categories (predefined)
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Icon name for UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Use cases for tools
CREATE TABLE use_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Main tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  website_url TEXT NOT NULL,
  logo_url TEXT,
  
  -- Categorization
  primary_category_id UUID REFERENCES categories(id),
  use_case_ids UUID[] DEFAULT '{}', -- Array of use case IDs
  
  -- Vendor information
  vendor_id UUID, -- References profiles(id) from Module 1
  vendor_contact_email TEXT,
  
  -- Tool details
  pricing_model TEXT CHECK (pricing_model IN ('free', 'freemium', 'paid', 'custom')),
  pricing_details TEXT,
  integration_difficulty INTEGER CHECK (integration_difficulty BETWEEN 1 AND 5),
  
  -- Metadata
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || description || ' ' || COALESCE(long_description, ''))
  ) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX tools_search_idx ON tools USING GIN (search_vector);
CREATE INDEX tools_category_idx ON tools (primary_category_id);
CREATE INDEX tools_approved_idx ON tools (approved);
CREATE INDEX tools_vendor_idx ON tools (vendor_id);

-- Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved tools"
  ON tools FOR SELECT
  USING (approved = TRUE);

CREATE POLICY "Vendors can view their own tools"
  ON tools FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own tools"
  ON tools FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own tools"
  ON tools FOR UPDATE
  USING (vendor_id = auth.uid());

-- Seed data for categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Sales', 'sales', 'Tools for sales teams and revenue generation', 'TrendingUp'),
('Marketing', 'marketing', 'Marketing automation and campaign management', 'Megaphone'),
('Customer Success', 'customer-success', 'Customer support and success tools', 'Users'),
('Human Resources', 'hr', 'HR management and employee tools', 'UserCheck'),
('Finance', 'finance', 'Financial planning and accounting tools', 'DollarSign');

-- Seed data for use cases
INSERT INTO use_cases (name, slug, category_id, description) VALUES
-- Sales use cases
('Lead Generation', 'lead-generation', (SELECT id FROM categories WHERE slug = 'sales'), 'Find and qualify potential customers'),
('CRM Management', 'crm-management', (SELECT id FROM categories WHERE slug = 'sales'), 'Manage customer relationships'),
('Sales Analytics', 'sales-analytics', (SELECT id FROM categories WHERE slug = 'sales'), 'Track and analyze sales performance'),

-- Marketing use cases  
('Email Marketing', 'email-marketing', (SELECT id FROM categories WHERE slug = 'marketing'), 'Email campaign automation'),
('Social Media', 'social-media', (SELECT id FROM categories WHERE slug = 'marketing'), 'Social media management'),
('Content Creation', 'content-creation', (SELECT id FROM categories WHERE slug = 'marketing'), 'Create marketing content'),

-- Customer Success use cases
('Help Desk', 'help-desk', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Customer support ticketing'),
('Live Chat', 'live-chat', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Real-time customer chat'),
('Knowledge Base', 'knowledge-base', (SELECT id FROM categories WHERE slug = 'customer-success'), 'Self-service documentation'),

-- HR use cases
('Recruiting', 'recruiting', (SELECT id FROM categories WHERE slug = 'hr'), 'Talent acquisition and hiring'),
('Performance Management', 'performance-management', (SELECT id FROM categories WHERE slug = 'hr'), 'Employee performance tracking'),
('Payroll', 'payroll', (SELECT id FROM categories WHERE slug = 'hr'), 'Payroll and benefits management'),

-- Finance use cases
('Accounting', 'accounting', (SELECT id FROM categories WHERE slug = 'finance'), 'Financial record keeping'),
('Invoicing', 'invoicing', (SELECT id FROM categories WHERE slug = 'finance'), 'Invoice generation and management'),
('Expense Management', 'expense-management', (SELECT id FROM categories WHERE slug = 'finance'), 'Track and manage expenses'); 