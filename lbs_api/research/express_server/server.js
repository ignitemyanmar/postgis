var pg = require('pg');
var express = require('express');
var app = express();
app.use(express.bodyParser());
var conString = "tcp://postgres:12345678@localhost/myanmar_osm";

app.configure(function(){
	app.use(express.static(__dirname + '/public'));
});
app.get('/hello.:ext', function(req,res){
	var data = ["aok","bok","cok"]
	var body = "";
	ext = req.params.ext
	if(ext == 'txt'){
		res.setHeader('Content-Type', 'text/html');
		for(d in data){body += data[d] + "\n";}
	}else if(ext == 'csv'){
		res.setHeader('Content-Type', 'text/csv');
		body = data.join(",")
	}else if(ext == 'xml'){
		res.setHeader('Content-Type', 'text/xml');
		body = "<data>";
		for(d in data){
			body += "<item>" + data[d] + "</item>";
		}
		body += "</data>"
	}else if(ext == 'json'){
		res.setHeader('Content-Type', 'text/json');
		body = JSON.stringify(data);
	}
	res.setHeader('Content-Length', body.length);
	res.end(body);
});

app.get('/nearby_poi', function(req,res){
	var client = new pg.Client(conString);
	var lat = req.query.lat;
	var lon = req.query.lon;
	var radius = req.query.radius;
	if (!radius) radius = "300";
	console.log(lat);
	console.log(lon);
	client.connect(function(err) {
		client.query("SELECT * FROM(SELECT id,name,name_mm,cat_name, osm_tag, osm_id,ST_X(geom) as lon, ST_Y(geom) as lat, st_distance(st_transform(st_setsrid(Pointfromtext('POINT("+lon+" "+lat+")'),4326),32646),st_transform(geom,32646)) as distance FROM osm_point_of_interest) A where A.distance < " + radius + " and name is not null order by A.distance;", function(err, result) {
			if(err){
				res.end(err.toString());
			}
			var data = [];
			for(var ri in result.rows){
				var rc = result.rows[ri];
				//data.push([rc.id, rc.name, rc.name_mm, rc.cat_name, rc.distance]);
				data.push([rc.id, rc.name, rc.lat, rc.lon, rc.cat_name]);
			}
			res.send(JSON.stringify(data)); // Async function
		})
	});
});

app.get('/nearby_roads', function(req,res){
	var client = new pg.Client(conString);
	var lat = req.query.lat;
	var lon = req.query.lon;
	var radius = req.query.radius;
	if (!radius) radius = "300";
	client.connect(function(err) {
		client.query("SELECT id,name,name_mm, road_category,osm_id,distance,ST_X(nearest_point) as lon, ST_Y(nearest_point) as lat FROM(SELECT id,name,name_mm,road_category, osm_id, st_distance(st_transform(st_setsrid(Pointfromtext('POINT("+lon+" "+lat+")'),4326),32646),st_transform(geom,32646)) as distance, ST_Line_Interpolate_Point(geom,ST_Line_Locate_Point(geom,GeomFromText('POINT(" + lon + " "+ lat +")',4326))) as nearest_point FROM osm_road) A where A.distance < " + radius + "  and name is not null order by A.distance limit 20;", function(err, result) {
			if(err){
				res.end(err.toString());
			}
			var data = [];
			for(var ri in result.rows){
				var rc = result.rows[ri];
				//data.push([rc.id, rc.name, rc.name_mm, rc.cat_name, rc.distance]);
				data.push([rc.id, rc.name, rc.road_category, rc.distance, rc.lon, rc.lat]);
			}
			res.send(JSON.stringify(data)); // Async function
		})
	});
});

// Application started listening at PORT
app.listen(3000);

console.log('Listening on port 3000');
