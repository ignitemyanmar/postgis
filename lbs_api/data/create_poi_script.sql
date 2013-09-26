CREATE TABLE poi
(
  id serial NOT NULL,
  name character varying(255),
  name_mm character varying(255),
  cat_id integer,
  geom geometry(Point,4326)
)