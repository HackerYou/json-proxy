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
			xmlToJSON: false,
			useCache: false
		}
	}).then(function(res) {
		/* ... */
	});
	
### Using the Fetch API

You can use the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for making requests too

```js
const proxiedUrl = 'http://api.site.com/api';

const url = new URL('http://proxy.hackeryou.com');
url.search = new URLSearchParams({
  reqUrl: proxiedUrl,
  'params[key]': apiKey,
  'params[param1]': value,
  'params[param2]': value,
  'proxyHeaders[Some-Header]': 'goes here',
});

fetch(url)
  .then(response => response.json())
  .then(data => {
    /* ... */
  });
```

**Note the need to use square bracket query parameter notation `[]` for the `params` and `proxyHeaders` proxy param options!**

### Options to pass

You pass your information via the `data` object, in there there are a bunch of options you need to pass.

param | type | description 
----- | ------ | -----------
reqUrl | `string` | The URL for your endpoint.
params | `object` / `params[key]` | The options that you would normally pass to the data object
proxyHeaders | `object` / `proxyHeaders[header]` | Headers to pass to the API
xmlToJSON | `boolean` | Defaults to `false`, change to true if API returns XML
useCache | `boolean` | Defaults to `false`, change to store your response from an API for 1 hour. 




