'use strict'
const queryString = require('querystring');
const request = require('request');
const xml2json = require('xml2json');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB_PATH = 'mongodb://localhost/cache';
const Cache = require('./models/Cache.js');

mongoose.connect(DB_PATH);


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

const getRequest = (url, data, headers) => {
	return request.get({
		url: `${url}?${data}`,
		headers
	});
}

app.get('/', (req,res) => {
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	res.setHeader("Content-Type", "application/json");

	var query = queryString.parse(req.url.substring(2));
	if(!query.xmlToJSON) {
		query.xmlToJSON = false;
	}

	if(req.method === 'GET' && query.reqUrl) {

		var url = query.reqUrl;

		var params = pullParams(query,/params\[(.*)\]/);
		var userHeaders = pullParams(query,/proxyHeaders\[(.*)\]/);

		var data = queryString.stringify(params);
		var headers = Object.assign({},userHeaders,{
			'User-Agent': 'Proxy.hackeryou.com',
		});

		if (query.useCache === "true") {
			const cached = Cache.findOne({endpoint: url}, (err, doc) => {
				if (err) console.log(err);

				if (doc) {
					console.log('Retrieved from cache.');
					res.status(200)
						.send(JSON.parse(doc.response));
				} else {
					getRequest(url, data, headers)
						.on('data', (reqRes) => {
							const cache = new Cache();
							cache.endpoint = url;
							cache.response = JSON.stringify(reqRes.toString());
							cache.date = new Date();
							cache.save()
								.then(() => {
									console.log('Saved in cache.')
									res.status(200)
										.send(reqRes.toString());
								})
								.catch((err) => {
									console.log('Error saving in cache: ' + err);
									res.status(500)
										.send(err);
								});
						});
				}
			});
		} else {
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
