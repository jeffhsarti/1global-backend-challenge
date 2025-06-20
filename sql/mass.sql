-- Installing the pgcrypto extension for uuid creation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Inserts tons of devices with random UUIDs, names, brands, and states
DO $$
DECLARE
  states TEXT[] := ARRAY['AVAILABLE', 'IN_USE', 'INACTIVE'];
  brands TEXT[] := ARRAY['Samsung', 'Apple', 'Xiaomi', 'Motorola', 'LG', 'Asus', 'Lenovo'];
  adjectives TEXT[] := ARRAY['Smart', 'Power', 'Ultra', 'Pro', 'Mini', 'Max', 'Lite'];
  nouns TEXT[] := ARRAY['Device', 'Gadget', 'Tool', 'Machine', 'Widget', 'Gear', 'Thing'];
  i INTEGER;
  rand_state TEXT;
  rand_brand TEXT;
  rand_name TEXT;
BEGIN
  FOR i IN 1..1000000 LOOP
    rand_state := states[1 + floor(random() * array_length(states, 1))];
    rand_brand := brands[1 + floor(random() * array_length(brands, 1))];
    rand_name := adjectives[1 + floor(random() * array_length(adjectives, 1))] || '_' ||
                 nouns[1 + floor(random() * array_length(nouns, 1))] || '_' || i;

    INSERT INTO devices.device (
      id, name, brand, state, "createdAt", "updatedAt"
    ) VALUES (
      gen_random_uuid(),
      rand_name,
      rand_brand,
      rand_state::devices.device_state,
      NOW() - (floor(random() * 365) || ' days')::INTERVAL,
      NOW()
    );
  END LOOP;
END $$;
