DROP TABLE osm_road;
CREATE TABLE osm_road(
	id SERIAL,
	name character varying(255),
	name_mm character varying(255),
	road_category character varying(50),
	is_oneway boolean,
	is_bridge boolean,
	osm_id integer,
	geom geometry(LineString,4326));
insert into osm_road(name,name_mm,is_bridge, is_oneway,osm_id,road_category,geom)
select name, 
	'' as name_mm,
	(case when bridge is not null then true else false end) as is_bridge,
	(case when oneway is not null then (
		case when lower(oneway) = 'yes' then true else false end) 
		else false end) as is_oneway,
	osm_id, 
	highway as road_category,
	way as geom
	from planet_osm_line
	where highway is not null;

DROP INDEX osm_road_name_index;
CREATE INDEX osm_road_name_index
  ON osm_road
  USING btree
  ("name",name_mm, road_category);

 
DROP INDEX osm_road_name_geom_index
CREATE INDEX osm_road_name_geom_index
  ON osm_road
  USING gist
  (geom gist_geometry_ops);