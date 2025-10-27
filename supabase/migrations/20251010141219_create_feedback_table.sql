/*
  # Create feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `name` (text, client name)
      - `rating` (integer, 1-5 stars)
      - `comment` (text, feedback comment)
      - `created_at` (timestamptz, submission date)
      - `is_approved` (boolean, for moderation)
  
  2. Security
    - Enable RLS on `feedback` table
    - Add policy for anyone to submit feedback (insert)
    - Add policy for anyone to read approved feedback (select)
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT true
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved feedback"
  ON feedback
  FOR SELECT
  TO anon, authenticated
  USING (is_approved = true);
