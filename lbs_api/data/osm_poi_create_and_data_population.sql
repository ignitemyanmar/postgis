
CREATE TABLE osm_poi
(
  id serial NOT NULL,
  name character varying(255),
  name_mm character varying(255),
  cat_id integer,
  osm_cat_name character varying(255),
  osm_tag character varying(255),
  osm_id integer,
  geom geometry(Point,4326)
)

insert into osm_poi(name, cat_id, osm_cat_name, osm_tag, osm_id, geom)
 select poi.name, cat.id, poi.osm_cat_name, poi.osm_tag, poi.osm_id, geom from osm_poi1 poi
 left outer join poi_categories cat on poi.cat_name = cat.name
 
 