var http = require('http');
var queryString = require('querystring');
var request = require('request');
var xml2json = require('xml2json');

var server = http.createServer((req,res) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	res.setHeader("Content-Type", "application/json");

	var query = queryString.parse(req.url.substring(2));
	if(!query.xmlToJSON) {
		query.xmlToJSON = false;
	}

	if(req.method === 'GET' && query.reqUrl) {

		var url = query.reqUrl;

		var params = (function(queryObj) {
			var obj = {};
			//Pattern for is the request looks like `params[format]`
			var pattern = /params\[(.*)\]/;
			for(key in queryObj) {
				if(key !== 'reqUrl') {
					//Check pattern
					var patternMatch = key.match(pattern);
					var newKey = '';
					if(patternMatch) {
						//Get captured pattern
						newKey = patternMatch[1];
					}
					else {
						newKey = key;
					}
					obj[newKey] = queryObj[key];
				}
			}
			return obj;
		})(query);

		var data = queryString.stringify(params);

		request.get(url + '?' + data ,(err,response,body) => {
			if(query.xmlToJSON === 'true') {
				body = xml2json.toJson(body);
			}
			if(response && response.statusCode === 200) {
				res.writeHead(200);
				res.end(body);
			}
			else {
				res.writeHead(400);
				res.end(body);
			}
		});
	}
	else {
		res.end('{"error": "Must be a GET request and contain a reqUrl param"}');
	}
});

server.listen(4500);