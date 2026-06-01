-- Status monitoring tables
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS status_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  group_name  TEXT NOT NULL DEFAULT 'General',
  description TEXT,
  is_private  BOOLEAN NOT NULL DEFAULT FALSE,
  type        TEXT NOT NULL DEFAULT 'website', -- website | api | server
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS status_checks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id      UUID NOT NULL REFERENCES status_services(id) ON DELETE CASCADE,
  status          TEXT NOT NULL,  -- up | degraded | down
  response_time_ms INTEGER,
  status_code     INTEGER,
  error_message   TEXT,
  checked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast history lookups
CREATE INDEX IF NOT EXISTS idx_status_checks_service_time
  ON status_checks (service_id, checked_at DESC);

-- RLS: allow public reads (status page is public)
ALTER TABLE status_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_checks   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read services"
  ON status_services FOR SELECT USING (TRUE);

CREATE POLICY "public can read checks"
  ON status_checks FOR SELECT USING (TRUE);

-- Only service role can insert/update (used by the check API)
CREATE POLICY "service role can manage services"
  ON status_services FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "service role can insert checks"
  ON status_checks FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Sample public services (edit as needed)
INSERT INTO status_services (name, url, group_name, description, is_private, type) VALUES
  ('dhruvagrawat.com', 'https://dhruvagrawat.com', 'Personal', 'Main portfolio site', FALSE, 'website')
ON CONFLICT DO NOTHING;
