CREATE TABLE public.jobstories (
    id SERIAL PRIMARY KEY,
    context_id integer NOT NULL,
    motivation_id integer NOT NULL,
    outcome_id integer NOT NULL,
    usertype_ids text[],
    modified timestamp without time zone
);


CREATE TABLE public.contexts (
    id SERIAL PRIMARY KEY,
    description text NOT NULL,
    modified timestamp without time zone
);


CREATE TABLE public.motivations (
    id SERIAL PRIMARY KEY,
    description text,
    modified timestamp without time zone
);


CREATE TABLE public.outcomes (
    id SERIAL PRIMARY KEY,
    description text,
    modified timestamp without time zone
);


CREATE TABLE public.products (
    id text PRIMARY KEY,
    title text
);


CREATE TABLE public.usertypes (
    id text PRIMARY KEY,
    title text NOT NULL,
    product_id text NOT NULL
);
