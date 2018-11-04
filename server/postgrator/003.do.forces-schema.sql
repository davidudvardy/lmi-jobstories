CREATE TYPE force_direction AS ENUM ('positive', 'negative');
CREATE TABLE public.forces (
    id SERIAL PRIMARY KEY,
    description text NOT NULL,
    direction force_direction NOT NULL,
    modified timestamp without time zone
);


ALTER TABLE jobstories ADD COLUMN forces_ids integer[];