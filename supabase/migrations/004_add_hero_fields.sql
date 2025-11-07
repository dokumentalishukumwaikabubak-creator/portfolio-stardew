-- Add hero section fields to personal_info table
ALTER TABLE personal_info
ADD COLUMN hero_title text,
ADD COLUMN hero_subtitle text,
ADD COLUMN hero_tagline text;