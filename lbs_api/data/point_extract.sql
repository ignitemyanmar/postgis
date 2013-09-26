/*
 SQLs to extract POI data from POINT table.
*/

drop table osm_point_of_interest;
create table osm_point_of_interest(
	id serial,
	name character varying(255),
	name_mm character varying(255),
	cat_name character varying(255),
	osm_tag character varying(255),
	osm_id integer,
	geom geometry(Point,4326)
);

insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(aeroway) as cat_name,'aeroway'as osm_tag, way as geometry from planet_osm_point where  aeroway  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(amenity) as cat_name,'amenity'as osm_tag, way as geometry from planet_osm_point where  amenity  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(barrier) as cat_name,'barrier'as osm_tag, way as geometry from planet_osm_point where  barrier  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(building) as cat_name,'building'as osm_tag, way as geometry from planet_osm_point where  building  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(denomination) as cat_name,'denomination'as osm_tag, way as geometry from planet_osm_point where  denomination  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(highway) as cat_name,'highway'as osm_tag, way as geometry from planet_osm_point where  highway  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(historic) as cat_name,'historic'as osm_tag, way as geometry from planet_osm_point where  historic  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(landuse) as cat_name,'landuse'as osm_tag, way as geometry from planet_osm_point where  landuse  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(leisure) as cat_name,'leisure'as osm_tag, way as geometry from planet_osm_point where  leisure  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(man_made) as cat_name,'man_made'as osm_tag, way as geometry from planet_osm_point where  man_made  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(military) as cat_name,'military'as osm_tag, way as geometry from planet_osm_point where  military  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower("natural") as cat_name,'natural'as osm_tag, way as geometry from planet_osm_point where  "natural"  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower("operator") as cat_name,'operator'as osm_tag, way as geometry from planet_osm_point where  "operator"  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(place) as cat_name,'place'as osm_tag, way as geometry from planet_osm_point where  place  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(power) as cat_name,'power'as osm_tag, way as geometry from planet_osm_point where  power  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(public_transport) as cat_name,'public_transport'as osm_tag, way as geometry from planet_osm_point where  public_transport  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(railway) as cat_name,'railway'as osm_tag, way as geometry from planet_osm_point where  railway  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(religion) as cat_name,'religion'as osm_tag, way as geometry from planet_osm_point where  religion  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(route) as cat_name,'route'as osm_tag, way as geometry from planet_osm_point where  route  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(shop) as cat_name,'shop'as osm_tag, way as geometry from planet_osm_point where  shop  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(sport) as cat_name,'sport'as osm_tag, way as geometry from planet_osm_point where  sport  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(tourism) as cat_name,'tourism'as osm_tag, way as geometry from planet_osm_point where  tourism  is not null order by cat_name;
insert into osm_point_of_interest(osm_id,"name", name_mm,cat_name,osm_tag,geom)
select osm_id, "name",''as  name_mm, lower(waterway) as cat_name,'waterway'as osm_tag, way as geometry from planet_osm_point where  waterway  is not null order by cat_name;

DROP INDEX osm_point_of_interest_name_index;
CREATE INDEX osm_point_of_interest_name_index
  ON osm_point_of_interest
  USING btree
  ("name",name_mm);
  
DROP INDEX osm_point_of_interest_geom_index
CREATE INDEX osm_point_of_interest_geom_index
  ON osm_point_of_interest
  USING gist
  (geom gist_geometry_ops);
