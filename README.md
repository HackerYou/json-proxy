#Simple Proxy Server

This is a very simple proxy server to get around CORS issues when an API does not provide JSONP.

##How to use.

The set up is very simple, when you make a request with `$.ajax` you might right it like this.

	$.ajax({
		url: 'http://api.site.com/api',
		dataType: json,
		method:'GET',
		data: {
			key: apiKey,
			param1: value,
			param2: value
		}
	}).then(function(res) {
		...
	});

However does to CORS you might not be able to access the API this way. To this this proxy you have to change you request to look like this.

	$.ajax({
		url: 'http://proxy.hackeryou.com',
		dataType: json,
		method:'GET',
		data: {
			reqUrl: 'http://api.site.com/api',
			params: {
				key: apiKey,
				param1: value,
				param2: value
			}
		}
	}).then(function(res) {
		...
	});