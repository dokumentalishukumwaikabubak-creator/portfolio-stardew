ALTER TABLE personal_info
ADD COLUMN hero_title text,
ADD COLUMN hero_subtitle text,
ADD COLUMN hero_tagline text;

-- Migrate existing data if needed
UPDATE personal_info
SET 
  hero_title = title,
  hero_subtitle = 'Creative Developer',
  hero_tagline = bio
WHERE hero_title IS NULL;