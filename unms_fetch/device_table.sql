CREATE TABLE unms_api.device_uptime (
  id serial primary key,
  device_id text unique,
  hostname text,
  timestamp timestamptz,
  previoustimestamp timestamptz
);