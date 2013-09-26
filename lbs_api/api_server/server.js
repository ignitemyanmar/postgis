// Load express framework
var express = require('express');

// Load Database Layer library
var lbsdb = require('./lbsdb');

// API authentication credentials
var auth_clients = {
	"uname1": "passwd1",
	"uname2": "passwd2"
}


/*
 * Object initializations
 */
var app = express();
var conString = "tcp://postgres:ignite@localhost/lbsapi"; // Change this accordingly
//var conString = "tcp://postgres:/@localhost/lbsapi";
var mime = lbsdb.mime;
var api_auth = express.basicAuth(function(uname,passwd) {return auth_clients[uname] == passwd;});
var port = 3000;

/*
 * Express application additional plugin configurations
 */
app.use(express.bodyParser()); // Request body parser
//app.use(api_auth); // Authentication parser


/*
 * Check if a given value is a Number.
 * return true/false
 */
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 * Check database error, format data in necessary format
 * and returns accordingly.
 * - When err is not null, response 500 - Internal Server Error
 * - When rows variable is boolean and true, response 201 - Record is created.
 * - Otherwise format the data with requested extension and response 200.
 */
function checkDbErrorFormatDataAndSend(err, req, res, rows){
	if(err){
		console.log("DBError:" + err.toString());
		res.statusCode = 500;
		res.end(err.toString());
		return;
	}

	if(rows == true){ //could be object or in EXECUTE case boolean
		endWithJsonMessage(201, "Record created.",res);
		return;
	}

	// Non-blocking
	lbsdb.formatData(req.qData["ext"], rows, function(data){
		res.setHeader("Content-Type", mime[req.qData["ext"]]);
		res.end(data);
	});

}

/*
 * Template method to response any given message and response code 
 * in JSON format.
 */
function endWithJsonMessage(respCode, respMessage, res){
	res.setHeader("Content-Type", "text/json");
	res.statusCode = respCode;
	res.end(JSON.stringify({message: respMessage}));
	return;
}

app.get("/aok", function(req, res){
	res.end("aok");
});
/*
 * Express application configuration to allow access
 * public folder.
 * For testing.
 */
app.configure(function(){
	app.use(express.static(__dirname + '/public'));
});

/**
 * api001
 * REF: API Document
 */
app.get("/poi_categories.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.listPoiCategories(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

/**
 * api002
 * REF: API Document
 */
app.get("/poi.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.listPoi(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

/**
 * api003
 * REF: API Document
 */
app.get("/poi_categories/search.:ext", lbsdb.parseQuery, function(req,res) {});

/**
 * api004
 * REF: API Document
 */
app.get("/poi/search.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.searchPoi(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

app.get("/poi/searchbypoiid.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.serachPoibyId(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

app.get("/poi/latlngpoi.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.latlngPoi(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

/**
 * api005
 * REF: API Document
 */
app.get("/poi/nearby.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.nearbyPoi(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

/**
 * api006
 * REF: API Document
 */
app.get("/roads/nearby.:ext", lbsdb.parseQuery, function(req,res) {

	// Non-blocking call.
	lbsdb.nearbyRoads(conString, req.qData, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

/**
 * api007
 * REF: API Document
 */
app.post("/poi",function(req,res) {
	// Parse posted data	
	var lat = req.body.lat,
		lon = req.body.lon,
		cat_id = req.body.cat_id,
		name = req.body.name;

	// Validate and error if failed
	if(lat == null || lon == null || cat_id == null || name == null ){
		res.statusCode = 400;
		res.end("Missing important parameters.");
		return;
	}else{
		if(!isNumber(lat)){endWithJsonMessage(400,"Invalid latitude.",res);return;}
		else{
			lat = parseFloat(lat);
			if(lat < 0 || lat > 90){endWithJsonMessage(400,"Invalid latitude.", res);return;}
		}
		if(!isNumber(lon)){endWithJsonMessage(400,"Invalid longitude.", res);return;}
		else{
			lon = parseFloat(lat);
			if(lon < 0 || lon > 90){endWithJsonMessage(400,"Invalid longitude.",res);return;}
		}
		if(!isNumber(cat_id)){endWithJsonMessage(400, "Invalid category id.",res);return;}
		else{
			cat_id = parseInt(cat_id);
			if(cat_id < 0){endWithJsonMessage(400, "Invalid category id.", res);return;}
		}
		if(name.trim().length == 0){endWithJsonMessage(400, "Name must not be empty.", res);return;}
	}
	
	// Non-blocking call to save
	lbsdb.createPoi(conString, req.body, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});
/**
 * api007
 * REF: API Document
 */
app.put("/poi",function(req,res) {
	// Parse posted data	
	var id = req.body.id,
		lat = req.body.lat,
		lon = req.body.lon,
		cat_id = req.body.cat_id,
		name = req.body.name;


	// Validate and error if failed
	if(id == null || lat == null || lon == null || cat_id == null || name == null ){
		res.statusCode = 400;
		res.end("Missing important parameters.");
		return;
	}else{
		if(!isNumber(id)){endWithJsonMessage(400, "Invalid poi id.",res);return;}
		else{
			id = parseInt(id);
			if(id < 0){endWithJsonMessage(400, "Invalid poi id.", res);return;}
		}
		if(!isNumber(lat)){endWithJsonMessage(400,"Invalid latitude.",res);return;}
		else{
			lat = parseFloat(lat);
			if(lat < 0 || lat > 90){endWithJsonMessage(400,"Invalid latitude.", res);return;}
		}
		if(!isNumber(lon)){endWithJsonMessage(400,"Invalid longitude.", res);return;}
		else{
			lon = parseFloat(lat);
			if(lon < 0 || lon > 90){endWithJsonMessage(400,"Invalid longitude.",res);return;}
		}
		if(!isNumber(cat_id)){endWithJsonMessage(400, "Invalid category id.",res);return;}
		else{
			cat_id = parseInt(cat_id);
			if(cat_id < 0){endWithJsonMessage(400, "Invalid category id.", res);return;}
		}
		if(name.trim().length == 0){endWithJsonMessage(400, "Name must not be empty.", res);return;}
	}
	
	// Non-blocking call to save
	lbsdb.updatePoi(conString, req.body, function(err, rows){
		checkDbErrorFormatDataAndSend(err, req, res, rows);
	});
});

app.listen(port);
console.log('Listening on port '+ port +'....');
