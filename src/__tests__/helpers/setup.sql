-- (pg-mem does not support IF NOT EXISTS syntax)
-- Creates the schema
CREATE SCHEMA devices;

-- Creates the DEVICE_STATE enum
CREATE TYPE devices.device_state AS ENUM ('AVAILABLE','IN_USE','INACTIVE');

-- Creates the table
CREATE TABLE devices.device (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  state devices.device_state NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Creates indexes
CREATE INDEX idx_devices_state        ON devices.device(state);
CREATE INDEX idx_devices_name         ON devices.device(name);
CREATE INDEX idx_devices_brand        ON devices.device(brand);
CREATE INDEX idx_devices_state_name   ON devices.device(state, name);
CREATE INDEX idx_devices_state_brand  ON devices.device(state, brand);
