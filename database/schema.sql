-- ============================================================================
-- Supabase Database Schema for Mohcareer Platform
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CONTENT ITEMS TABLE (General content management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'hero', 'about', 'header', 'footer', etc.
  key TEXT NOT NULL,
  content_ar JSONB, -- Arabic content (can be string, object, or array)
  content_en JSONB, -- English content (can be string, object, or array)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  UNIQUE(section, key)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_section ON content_items(section);
CREATE INDEX IF NOT EXISTS idx_content_items_key ON content_items(key);
CREATE INDEX IF NOT EXISTS idx_content_items_updated_at ON content_items(updated_at);

-- ============================================================================
-- 2. SERVICES TABLE (Structured service management)
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  features_ar JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  features_en JSONB DEFAULT '[]'::jsonb, -- Array of feature strings
  price DECIMAL(10,2) NOT NULL,
  sessions INTEGER NOT NULL DEFAULT 1,
  duration TEXT NOT NULL, -- e.g., "1 ساعة", "2 hours"
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT services_price_positive CHECK (price > 0),
  CONSTRAINT services_sessions_positive CHECK (sessions > 0)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_updated_at ON services(updated_at);

-- ============================================================================
-- 3. FAQ TABLE (Frequently Asked Questions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON faqs(sort_order);

-- ============================================================================
-- 4. TESTIMONIALS TABLE (Client reviews)
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text_ar TEXT NOT NULL,
  text_en TEXT NOT NULL,
  client_name_ar TEXT DEFAULT 'عميل',
  client_name_en TEXT DEFAULT 'Client',
  client_title_ar TEXT DEFAULT 'عميل مميز',
  client_title_en TEXT DEFAULT 'Distinguished Client',
  is_featured BOOLEAN DEFAULT false, -- For highlighting special testimonials
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort_order ON testimonials(sort_order);

-- ============================================================================
-- 5. ADMIN USERS TABLE (Extend auth.users with admin-specific fields)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. AUDIT LOG TABLE (Track all changes for security)
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, record_id, operation, old_values, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, record_id, operation, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, record_id, operation, new_values, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add audit triggers
CREATE TRIGGER content_items_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON content_items FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER services_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON services FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER faqs_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON faqs FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER testimonials_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON testimonials FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for content_items
CREATE POLICY "Public can read content_items" ON content_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage content_items" ON content_items FOR ALL USING (auth.role() = 'authenticated');

-- Policies for services
CREATE POLICY "Public can read active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

-- Policies for faqs
CREATE POLICY "Public can read active faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Policies for testimonials
CREATE POLICY "Public can read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- Policies for admin_users
CREATE POLICY "Users can read own profile" ON admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON admin_users FOR UPDATE USING (auth.uid() = id);

-- Policies for audit_logs
CREATE POLICY "Authenticated users can read audit_logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- 9. INITIAL DATA SETUP
-- ============================================================================

-- Insert a default admin user (you'll need to update this with actual user ID after creating user)
-- INSERT INTO admin_users (id, full_name, role) VALUES 
-- ('your-user-id-here', 'Mohaned Al-Ghamdi', 'super_admin');

-- Sample data will be inserted via the migration script

-- ============================================================================
-- 10. HELPFUL VIEWS
-- ============================================================================

-- View for getting all content in a structured format
CREATE OR REPLACE VIEW content_view AS
SELECT 
  section,
  key,
  content_ar,
  content_en,
  updated_at
FROM content_items
ORDER BY section, key;

-- View for getting active services with all details
CREATE OR REPLACE VIEW active_services_view AS
SELECT 
  id,
  title_ar,
  title_en,
  description_ar,
  description_en,
  features_ar,
  features_en,
  price,
  sessions,
  duration,
  sort_order,
  updated_at
FROM services
WHERE is_active = true
ORDER BY sort_order;

-- View for getting active FAQs
CREATE OR REPLACE VIEW active_faqs_view AS
SELECT 
  id,
  question_ar,
  question_en,
  answer_ar,
  answer_en,
  sort_order,
  updated_at
FROM faqs
WHERE is_active = true
ORDER BY sort_order;

-- View for getting active testimonials
CREATE OR REPLACE VIEW active_testimonials_view AS
SELECT 
  id,
  text_ar,
  text_en,
  client_name_ar,
  client_name_en,
  client_title_ar,
  client_title_en,
  is_featured,
  sort_order,
  created_at
FROM testimonials
WHERE is_active = true
ORDER BY sort_order;

-- ============================================================================
-- INSTRUCTIONS FOR SETUP:
-- ============================================================================
-- 1. Create a new Supabase project at https://supabase.com
-- 2. Go to SQL Editor in your Supabase dashboard
-- 3. Run this entire SQL script
-- 4. Create your admin user via Supabase Auth
-- 5. Update the admin_users table with your actual user ID
-- 6. Set up environment variables in your .env.local file
-- 7. Run the migration script to populate with existing data
-- ============================================================================
