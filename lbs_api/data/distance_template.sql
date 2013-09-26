/*
	Myanmar UTM 46N, 47N
	EPSG:32646 and EPSG:32647
*/
Select osm_id, "name", astext(way), st_distance(
		st_transform(st_setsrid(Pointfromtext('POINT(96.1588068 16.7743793)'),4326),32646), 
			st_transform(way,32646)
				) as dis from planet_osm_point A
					order by dis;
