const queryString = require('querystring');
const request = require('request');
const xml2json = require('xml2json');
const express = require('express');
const app = express();

app.get('/', (req,res) => {
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

		request.get({
				url: url + '?' + data,
				headers: {
					'User-Agent': 'Proxy.hackeryou.com'
				}
			},(err,response,body) => {
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

app.use(express.static(`${__dirname}/oauth/client`))
app.get(['/oauth','/oauth*'], (req, res) => {
	if(req.originalUrl.match(/client/gi)) {
		//What is this all aboot?!?

		res.sendFile(`${__dirname}/${req.originalUrl.replace('/oauth/oauth/','/oauth/')}`);
	}
	else {
		res.sendFile(`${__dirname}/oauth/index.html`);
	}
});



app.listen(4500);
