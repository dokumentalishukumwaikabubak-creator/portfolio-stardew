-- Portfolio Website Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Portfolio items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  full_description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  category_id INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for category_id (no foreign key constraint)
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category_id ON portfolio_items(category_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_featured ON portfolio_items(is_featured);

-- 4. Personal info table
CREATE TABLE IF NOT EXISTS personal_info (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  title VARCHAR(255),
  bio TEXT,
  email VARCHAR(255),
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level INTEGER DEFAULT 1,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view portfolio items" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public can view personal info" ON personal_info FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON skills FOR SELECT USING (true);

-- RLS Policies for authenticated users (admin) full access
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage portfolio items" ON portfolio_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage personal info" ON personal_info FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Insert sample data
INSERT INTO personal_info (name, title, bio, email) VALUES 
('John Doe', 'Full Stack Developer', 'Passionate developer dengan pengalaman membangun aplikasi web modern menggunakan Next.js, React, dan Node.js.', 'john@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, description) VALUES
('Web Development', 'web-development', 'Full stack web applications'),
('Mobile Apps', 'mobile-apps', 'Native dan cross-platform mobile apps'),
('UI/UX Design', 'ui-ux-design', 'User interface dan experience design'),
('Open Source', 'open-source', 'Open source contributions dan projects')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (name, level, category) VALUES
('React', 5, 'Frontend'),
('Next.js', 5, 'Frontend'),
('TypeScript', 4, 'Frontend'),
('Node.js', 4, 'Backend'),
('Supabase', 4, 'Backend'),
('Tailwind CSS', 5, 'Frontend'),
('PostgreSQL', 3, 'Backend'),
('Git', 4, 'Tools')
ON CONFLICT DO NOTHING;
