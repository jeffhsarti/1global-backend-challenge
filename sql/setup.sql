-- Creates the schema
CREATE SCHEMA IF NOT EXISTS devices;

-- Creates the DEVICE_STATE enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'device_state') THEN
    CREATE TYPE devices.device_state AS ENUM ('AVAILABLE', 'IN_USE', 'INACTIVE');
  END IF;
END
$$;

-- Creates the table
CREATE TABLE IF NOT EXISTS devices.device (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  state devices.device_state NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Creates indexes
CREATE INDEX IF NOT EXISTS idx_devices_state ON devices.device (state);
CREATE INDEX IF NOT EXISTS idx_devices_name ON devices.device (name);
CREATE INDEX IF NOT EXISTS idx_devices_brand ON devices.device (brand);
CREATE INDEX IF NOT EXISTS idx_devices_state_name_asc ON devices.device(state, name);
CREATE INDEX IF NOT EXISTS idx_devices_state_brand_asc ON devices.device(state, brand);
