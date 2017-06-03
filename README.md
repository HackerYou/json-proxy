# Simple Proxy Server

[![CircleCI](https://img.shields.io/circleci/project/HackerYou/json-proxy.svg?style=flat-square)](https://circleci.com/gh/hackeryou/jsonproxy)

This is a very simple proxy server to get around CORS issues when an API does not provide JSONP.

## How to use.
This is live at proxy.hackeryou.com. 

The set up is very simple, when you make a request with `$.ajax` you might right it like this.

	$.ajax({
		url: 'http://api.site.com/api',
		dataType: 'json',
		method:'GET',
		data: {
			key: apiKey,
			param1: value,
			param2: value
		}
	}).then(function(res) {
		...
	});

However because of CORS you might not be able to access the API this way. If the API does not offer JSONP you can use this proxy to bypass the CORS issue. To use this proxy you have to change you request to look like this.

	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: 'json',
		method:'GET',
		data: {
			reqUrl: 'http://api.site.com/api',
			params: {
				key: apiKey,
				param1: value,
				param2: value
			},
			proxyHeaders: {
				'Some-Header': 'goes here'
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		...
	});

### Options to pass

You pass your information via the `data` object, in there there are a bunch of options you need to pass.

param | type | description 
----- | ------ | -----------
reqUrl | `string` | The URL for your endpoint.
params | `object` | The options that you would normally pass to the data object
xmlToJSON | `boolean` | Defaults to `false`, change to true if API returns XML

