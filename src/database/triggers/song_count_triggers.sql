-- Trigger functions to auto-increment song count fields
-- Run this after applying the Drizzle migration

-- Trigger function to increment view_count
CREATE OR REPLACE FUNCTION increment_song_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs 
  SET view_count = view_count + 1 
  WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to increment play_count
CREATE OR REPLACE FUNCTION increment_song_play_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs 
  SET play_count = play_count + 1 
  WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to increment download_count
CREATE OR REPLACE FUNCTION increment_song_download_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE songs 
  SET download_count = download_count + 1 
  WHERE id = NEW.song_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_increment_song_view_count
AFTER INSERT ON song_views
FOR EACH ROW
EXECUTE FUNCTION increment_song_view_count();

CREATE TRIGGER trigger_increment_song_play_count
AFTER INSERT ON song_plays
FOR EACH ROW
EXECUTE FUNCTION increment_song_play_count();

CREATE TRIGGER trigger_increment_song_download_count
AFTER INSERT ON song_downloads
FOR EACH ROW
EXECUTE FUNCTION increment_song_download_count();
