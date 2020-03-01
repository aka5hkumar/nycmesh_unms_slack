CREATE TABLE device_uptime (
  id serial primary key,
  device_id text,
  hostname text,
  timestamp timestamptz
);
