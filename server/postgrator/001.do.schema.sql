CREATE TABLE public.jobstories (
    id integer NOT NULL,
    context_id integer NOT NULL,
    motivation_id integer NOT NULL,
    outcome_id integer NOT NULL,
    usertype_ids text[],
    modified timestamp without time zone
);


CREATE TABLE public.contexts (
    id integer NOT NULL,
    description text NOT NULL,
    modified timestamp without time zone
);


CREATE TABLE public.motivations (
    id integer NOT NULL,
    description text,
    modified timestamp without time zone
);


CREATE TABLE public.outcomes (
    id integer NOT NULL,
    description text,
    modified text
);


CREATE TABLE public.products (
    id text NOT NULL,
    title text
);


CREATE TABLE public.usertypes (
    id text NOT NULL,
    title text NOT NULL,
    product_id text NOT NULL
);
