/*
 ROAD DATA EVALUATION
 This script shows the number of ROAD available for each type of OSM_TAG with their distinct Category Names.
*/
select * from 
(select distinct aeroway as cat_name, 'aeroway' as osm_tag, count(*) from planet_osm_roads where  aeroway is not null group by aeroway
UNION
select distinct amenity as cat_name, 'amenity' as osm_tag, count(*) from planet_osm_roads where  amenity is not null group by amenity
UNION
select distinct barrier as cat_name, 'barrier' as osm_tag, count(*) from planet_osm_roads where  barrier is not null group by barrier
UNION
select distinct building as cat_name, 'building' as osm_tag, count(*) from planet_osm_roads where  building is not null group by building
UNION
select distinct denomination as cat_name, 'denomination' as osm_tag, count(*) from planet_osm_roads where  denomination is not null group by denomination
UNION
select distinct highway as cat_name, 'highway' as osm_tag, count(*) from planet_osm_roads where  highway is not null group by highway
UNION
select distinct historic as cat_name, 'historic' as osm_tag, count(*) from planet_osm_roads where  historic is not null group by historic
UNION
select distinct landuse as cat_name, 'landuse' as osm_tag, count(*) from planet_osm_roads where  landuse is not null group by landuse
UNION
select distinct leisure as cat_name, 'leisure' as osm_tag, count(*) from planet_osm_roads where  leisure is not null group by leisure
UNION
select distinct man_made as cat_name, 'man_made' as osm_tag, count(*) from planet_osm_roads where  man_made is not null group by man_made
UNION
select distinct military as cat_name, 'military' as osm_tag, count(*) from planet_osm_roads where  military is not null group by military
UNION
select distinct "natural" as cat_name, 'natural' as osm_tag, count(*) from planet_osm_roads where  "natural" is not null group by "natural"
UNION
select distinct "operator" as cat_name, 'operator' as osm_tag, count(*) from planet_osm_roads where  "operator" is not null group by "operator"
UNION
select distinct place as cat_name, 'place' as osm_tag, count(*) from planet_osm_roads where  place is not null group by place
UNION
select distinct power as cat_name, 'power' as osm_tag, count(*) from planet_osm_roads where  power is not null group by power
UNION
select distinct public_transport as cat_name, 'public_transport' as osm_tag, count(*) from planet_osm_roads where  public_transport is not null group by public_transport
UNION
select distinct railway as cat_name, 'railway' as osm_tag, count(*) from planet_osm_roads where  railway is not null group by railway
UNION
select distinct religion as cat_name, 'religion' as osm_tag, count(*) from planet_osm_roads where  religion is not null group by religion
UNION
select distinct route as cat_name, 'route' as osm_tag, count(*) from planet_osm_roads where  route is not null group by route
UNION
select distinct shop as cat_name, 'shop' as osm_tag, count(*) from planet_osm_roads where  shop is not null group by shop
UNION
select distinct sport as cat_name, 'sport' as osm_tag, count(*) from planet_osm_roads where  sport is not null group by sport
UNION
select distinct tourism as cat_name, 'tourism' as osm_tag, count(*) from planet_osm_roads where  tourism is not null group by tourism
UNION
select distinct waterway as cat_name, 'waterway' as osm_tag, count(*) from planet_osm_roads where  waterway is not null group by waterway) A
order by count desc;