'use strict'
const queryString = require('querystring');
const request = require('request');
const xml2json = require('xml2json');
const express = require('express');
const app = express();

function pullParams(queryObj,pattern) {
	var obj = {};
	//Pattern for is the request looks like `params[format]`
	for(let key in queryObj) {
		var patternMatch = key.match(pattern);
		if(patternMatch) {
			//Get captured pattern
			var newKey = patternMatch[1];
			obj[newKey] = queryObj[key];
		}


	}
	return obj;
}
app.get('/', (req,res) => {
	console.log("Hi")
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	res.setHeader("Content-Type", "application/json");

	var query = queryString.parse(req.url.substring(2));
	if(!query.xmlToJSON) {
		query.xmlToJSON = false;
	}

	if(req.method === 'GET' && query.reqUrl) {

		var url = query.reqUrl;

		var params = pullParams(query,/params\[(.*)\]/);
		console.log(params);
		var userHeaders = pullParams(query,/proxyHeaders\[(.*)\]/);

		var data = queryString.stringify(params);
		var headers = Object.assign({},userHeaders,{
			'User-Agent': 'Proxy.hackeryou.com',
		});
		console.log(headers);
		request.get({
				url: url + '?' + data,
				headers: headers
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
