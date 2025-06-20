-- Installing the pgcrypto extension for uuid creation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Inserts tons of devices with random UUIDs, names, brands, and states
INSERT INTO devices.device AS d (id, name, brand, state, "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  (ARRAY['Smart','Power','Ultra','Pro','Mini','Max','Lite'])[floor(random()*7+1)] || '_' ||
  (ARRAY['Device','Gadget','Tool','Machine','Widget','Gear','Thing'])[floor(random()*7+1)] || '_' ||
  gs,
  (ARRAY['Samsung','Apple','Xiaomi','Motorola','LG','Asus','Lenovo'])[floor(random()*7+1)],
  (ARRAY['AVAILABLE','IN_USE','INACTIVE'])[floor(random()*3+1)]::devices.device_state,
  NOW() - (random()*365 || ' days')::interval,
  NOW()
FROM generate_series(1,1000000) AS gs;
