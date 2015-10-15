var http = require('http');
var queryString = require('querystring');
var request = require('request');

var server = http.createServer((req,res) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	res.setHeader("Content-Type", "application/json");
	if(req.method === 'GET') {

		var query = queryString.parse(req.url.substring(2));
		var url = query.reqUrl;
		var params = (function(queryObj) {
			var obj = {};
			for(key in queryObj) {
				if(key !== 'reqUrl') {
					var newKey = key.substring(7, (key.length - 1) );
					obj[newKey] = queryObj[key];
				}
			}
			return obj;
		})(query);

		var data = queryString.stringify(params);


		request.get(url + '?' + data ,(err,response,body) => {
			if(response.statusCode === 200) {
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
		res.end('{"error": "Must be a GET request"}');
	}
});

server.listen(4500);