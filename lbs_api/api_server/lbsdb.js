// Import PostgrSQL connector module
var pg = require('pg');	

// MIME Type definitions by extensions
var mime = { "txt": "text/html", "csv": "text/csv", "xml": "text/xml", "json": "text/json", "jsonp": "text/jsonp" }

/*
 * Query to database with given SQL on given connection.
 * Return the results in given callback.
 */
function sendDbQuery(conString, sql, callback){
	var client = new pg.Client(conString);
	client.connect(function(err){
		// Connection error check
		if(err){callback(err,null);}
		console.log("Database Query: " + sql);
		
		// Query to database
		client.query(sql, function(err, result){
			// Query error check
			if(err){callback(err,null);}
            
            // Close connection
            // client.end();

			// Return data
			callback(err,result.rows);	
		});			
	});
}

/*
 * Execute to database with given SQL on given connection.
 * Call callback with true if execution is successful, false otherwise.
 */
function sendDbExecute(conString, sql, callback){
	var client = new pg.Client(conString);
	client.connect(function(err){
		// Connection error check
		if(err){callback(err,null);}
		console.log("Database Execute: " + sql);
		
		// execute to database
		client.query(sql, function(err, result){
			// Query error check
			if(err){callback(err,false);}

            // Close connection
            // client.end();

			// Return data
			callback(err,true);	
		});			
	});
}

/*
 * Exporting MIME data.
 * Supported data types.
 */
exports.mime = mime;

/*
 * Exporting parseQuery.
 * Parse  supported Query String parameters in given request.
 * Non-blocking.
 * Response 400 with Error if the requested extension sis not supported.
 * Proceed to next middlware step if All Ok.
 */
exports.parseQuery = function(req, res, next){
	process.nextTick(function(){
		var data = {};
		data["ext"]  = req.params.ext;
		var qv = ["p","l","c","poi_id","cat_id","q","lon","lat","radius"];

		for(var i in qv){
			var v = req.query[qv[i]];
			if(v) data[qv[i]] = v;
		}

		if(!mime[data["ext"]]){
			console.log("ExtensionError: " + data["ext"]);
			res.statusCode = 400; // Bad request.
			res.end("Unknow content-type request " + data["ext"]);
			return;
		}

		req.qData = data;
		next();
	});
}

/*
 * Exporting formatData.
 * Format the given result data according to given extension.
 * Non-blocking.
 * Send callback with formatted data.
 */
exports.formatData = function(ext, rows, callback){
	process.nextTick(function(){
		var body = "";
		if(rows.length > 0 ){
			var keys = Object.keys(rows[0]);
			if(ext == 'csv' || ext == "txt"){ 
				for(d in rows){ 
					var values = keys.map(function(v) { return rows[d][v]; });
					body += values.join(",") + "\n";
				}
			}else if(ext == 'xml'){
				body = "<data>";
				for(d in rows){ 
					body += "<item>"
					for(k in keys){
						body += "<" + keys[k] + ">" + rows[d][keys[k]] + "</" + keys[k] + ">"; 
					}
					body += "</item>"
			}
				body += "</data>"
			}else if(ext == 'json'){
				body =JSON.stringify(rows);
			}else if(ext == 'jsonp'){
				body = 'jsonCallback('+ JSON.stringify(rows) +')';
			}else{ // others
				for(d in rows){ 
					var values = keys.map(function(v) { return rows[d][v]; });
					body += values.join(",") + "\n";
				}
			}
		}
		callback(body);
	});
}

/**
 * Exporting listPoiCategories.
 * Prepare SQL to query for POI categories list with given params.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 */
exports.listPoiCategories = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 999999
		var sql = "SELECT id, name from poi_categories limit " + l + " offset " + ((p*l) - l);

		sendDbQuery(conString, sql, callback);
	});
}

/*
 * Exporting listPoi.
 * Prepare SQL to query POI list with given params.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 */
exports.listPoi = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 999999
		    cat_id = qData["cat_id"] ? qData["cat_id"] : 2;
		var sql = "";
		if(cat_id == "")
			sql = "SELECT id, name, name_mm, cat_id, lon, lat,  room_no, building_no, building_name, street, quarter, township, city, country, zip_code   FROM poi cat_id = " + cat_id + " order by id limit " + l + " offset " + ((p*l) - l);
		else
			sql = "SELECT id, name, name_mm, cat_id, lon, lat, room_no, building_no, building_name, street, quarter, township, city, country, zip_code FROM poi WHERE cat_id = " + cat_id + " order by id limit " + l + " offset " + ((p*l) - l);

		sendDbQuery(conString, sql, callback);
	});
}

/*
 * Exporting searchPoiCategories.
 * Prepare SQL to query (search) POI categories with given params.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 */
exports.searchPoiCategories = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 20
		    q = qData["q"] ? qData["q"].trim() : "";	// Default 20

		if(q == ""){callback(new Error("Query must not be empty."),null);}

		var sql = "SELECT id, name, geom FROM poi_categories where name like '%" + q + "%' order by id limit " + l + " offset " + ((p*l) - l);
		sendDbQuery(conString, sql, callback);
	});
}
exports.serachPoibyId = function(conString, qData, callback) {
	var id = qData["poi_id"];
	process.nextTick(function(){
		sql = "SELECT id, name, name_mm, cat_id, ST_X(geom) as lon, ST_Y(geom) as lat, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM poi where id="+id+"";
		sendDbQuery(conString, sql, callback);
	});
}
exports.latlngPoi = function(conString, qData, callback) {
	var id = qData["poi_id"];
	process.nextTick(function(){
		sql = "SELECT ST_X(geom) as lon, ST_Y(geom) as lat FROM poi where id="+id+"";
		sendDbQuery(conString, sql, callback);
	});
}
/*
 * Exporting searchPoi
 * Prepare SQL to search POI names using given connection string and query data.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 */
exports.searchPoi = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 20
		    q = qData["q"] ? qData["q"].trim() : "";
		    i = qData["i"] ? qData["i"].trim() : "";
		    cat_id = qData["cat_id"] ? qData["cat_id"] : "";

		var sql = "";
		if(q == ""){callback(new Error("Query must not be empty."),null);}

		if( poi_id != "")
			sql = "SELECT * FROM (SELECT id, name, name_mm, cat_id, ST_X(geom) as lon, ST_Y(geom) as lat, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM osm_poi UNION SELECT id, name, name_mm, cat_id, geom, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM poi) as A where A.id="+ poi_id +" A.name like '%" + q + "%' order by id limit " + l + " offset " + ((p*l) - l);
		else if(cat_id != ""){
			sql = "SELECT * FROM (SELECT id, name, name_mm, cat_id, ST_X(geom) as lon, ST_Y(geom) as lat, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM osm_poi UNION SELECT id, name, name_mm, cat_id, geom, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM poi) as A where A.cat_id = " + cat_id + " AND A.name like '%" + q + "%' order by id limit " + l + " offset " + ((p*l) - l);
		}
		else{
			sql = "SELECT * FROM (SELECT id, name, name_mm, cat_id, ST_X(geom) as lon, ST_Y(geom) as lat, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM osm_poi UNION SELECT id, name, name_mm, cat_id, geom, room_no, building_no, building_name, street, quarter, township, city, country, zip_code  FROM poi) as A where A.name like '%" + q + "%' order by id limit " + l + " offset " + ((p*l) - l);
		}
			
		sendDbQuery(conString, sql, callback);
	});
}

/*
 * Exporting nearbyPoi.
 * Prepare SQL to serach nearby POI around given coordinates of given radius.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 */
exports.nearbyPoi = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var radius = qData["radius"] ? parseInt(qData["radius"]) : 300;	// Default 1
		    lon = qData["lon"] ? qData["lon"] : "";	// Default 20
		    lat = qData["lat"] ? qData["lat"] : "";	// Default 20
		    p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 20
		    cat_id = qData["cat_id"] ? qData["cat_id"] : "";

		var wherec = "";
		if (cat_id != ""){
			wherec = " WHERE cat_id = " + cat_id;
		}

		if(lon == ""){callback(new Error("Longitude must not be empty."),null);return;}
		if(lat == ""){callback(new Error("Latitude must not be empty."),null);return;}
		if(!radius){callback(new Error("Invalid radius range."),null);return;}
		if(radius > 50000 || radius <= 0){callback(new Error("Invalid radius range."),null);return;}

		var sql = "SELECT * FROM(SELECT id,name,name_mm,cat_id, room_no, building_no, building_name, street, quarter, township, city, country, zip_code,  ST_X(geom) as lon, ST_Y(geom) as lat, st_distance(st_transform(st_setsrid(Pointfromtext('POINT("+lon+" "+lat+")'),4326),32646),st_transform(geom,32646)) as distance FROM osm_poi" + wherec + " union SELECT id,name,name_mm,cat_id, room_no, building_no, building_name, street, quarter, township, city, country, zip_code, ST_X(geom) as lon, ST_Y(geom) as lat, st_distance(st_transform(st_setsrid(Pointfromtext('POINT("+lon+" "+lat+")'),4326),32646),st_transform(geom,32646)) as distance FROM poi" + wherec + ") A where A.distance < " + radius + " and name is not null order by A.distance limit " + l + " offset " + ((p*l - l));

		sendDbQuery(conString, sql, callback);
	});
}

/*
 * Exporting nearbyRoads.
 * Prepare SQL to search nearby roads around given coordinates of given radius.
 * Non-blocking.
 * Call to sendDbQuery by passing the callback.
 * Default radius 300m.
 * Max radius 50km.
 */
exports.nearbyRoads = function(conString, qData, callback){
	process.nextTick(function(){
		// Prepare SQL
		var radius = qData["radius"] ? parseInt(qData["radius"]) : 300;	// Default 1
		    lon = qData["lon"] ? qData["lon"] : "";	// Default 20
		    lat = qData["lat"] ? qData["lat"] : "";	// Default 20
		    p = qData["p"] ? qData["p"] : 1;	// Default 1
		    l = qData["l"] ? qData["l"] : 999999;	// Default 20

		if(lon == ""){callback(new Error("Longitude must not be empty."),null);return;}
		if(lat == ""){callback(new Error("Latitude must not be empty."),null);return;}
		if(!radius){callback(new Error("Invalid radius range."),null);return;}
		if(radius > 50000 || radius <= 0){callback(new Error("Invalid radius range."),null);return;}

		var sql = "SELECT id,name,name_mm, road_category,osm_id,distance,ST_X(nearest_point) as lon, ST_Y(nearest_point) as lat FROM(SELECT id,name,name_mm,road_category, osm_id, st_distance(st_transform(st_setsrid(Pointfromtext('POINT("+lon+" "+lat+")'),4326),32646),st_transform(geom,32646)) as distance, ST_Line_Interpolate_Point(geom,ST_Line_Locate_Point(geom,GeomFromText('POINT(" + lon + " "+ lat +")',4326))) as nearest_point FROM osm_road) A where A.distance < " + radius + "  and name is not null order by A.distance limit " + l + " offset " + (p*l - l);

		sendDbQuery(conString, sql, callback);
	});

}

/*
 * Exporting creatPoi.
 * Prepare SQL to insert a new POI record.
 * Non-blocking.
 * Call to sendDbExecute by passing the callback.
 */
exports.createPoi = function(conString, pData, callback){
	process.nextTick(function(){
		var sql = "INSERT INTO poi(name, cat_id, geom, room_no, building_no, building_name, street, quarter, township, city, country, zip_code ) VALUES('" + pData.name + "', " + pData.cat_id + ", ST_GeomFromText('POINT("+ pData.lon + " " + pData.lat + ")',4326),'"+pData.room_no+"','"+pData.building_no+"','"+pData.building_name+"','"+pData.street+"','"+pData.quarter+"','"+pData.township+"','"+pData.city+"','"+pData.country+"','"+pData.zip_code+"')";
		sendDbExecute(conString, sql, callback);
	});	
}


/*
 * Exporting putPoi.
 * Prepare SQL to put POI record.
 * Non-blocking.
 * Call to sendDbExecute by passing the callback.
 */
exports.updatePoi = function(conString, pData, callback){
	process.nextTick(function(){
		var sql = "UPDATE poi SET name='"+pData.name+"', cat_id="+pData.name+", geom=ST_GeomFromText('POINT("+ pData.lon + " " + pData.lat + ")',4326), room_no='"+pData.room_no+"', building_no='"+pData.building_no+"', building_name='"+pData.building_name+"', street='"+pData.street+"', quarter='"+pData.quarter+"', township='"+pData.township+"', city='"+pData.city+"', country='"+pData.country+"', zip_code="+pData.zip_code+" WHERE id="+pData.id+"";
		sendDbExecute(conString, sql, callback);
	});	
}

/*
 * Exporting putPoi.
 * Prepare SQL to put POI record.
 * Non-blocking.
 * Call to sendDbExecute by passing the callback.
 */
exports.addOrupdatePoi = function(conString, pData, callback){
	process.nextTick(function(){
		var sql = "UPDATE poi SET name='"+pData.name+"', cat_id="+pData.name+", geom=ST_GeomFromText('POINT("+ pData.lon + " " + pData.lat + ")',4326), room_no='"+pData.room_no+"', building_no='"+pData.building_no+"', building_name='"+pData.building_name+"', street='"+pData.street+"', quarter='"+pData.quarter+"', township='"+pData.township+"', city='"+pData.city+"', country='"+pData.country+"', zip_code="+pData.zip_code+" WHERE id="+pData.id+"";
		sendDbExecute(conString, sql, callback);
	});	
}
