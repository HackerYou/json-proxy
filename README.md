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

## How to deploy

### System prerequisites

To deploy on a single Linux host use the following directions. These are best all run as root except launching the actual app unless its as a container.

These are specific to Rocky Linux 8, but should work on CentOS 8 and RHEL 8 as well.

First up let's install the required packages from the Rocky repository.

```sh
sudo dnf module enable -y nodejs:14
sudo dnf module install -y nodejs
sudo dnf module install -y python36
sudo dnf install -y git make gcc gcc-c++ checkpolicy
```

### The MongoDB setup

This could be done on a separate host but then then server.js needs to be updated with the location. Ideally you could do this an an environment variable.

First step to get MongoDB is to point to its repository (as root)

```sh
cat > /etc/yum.repos.d/mongodb-org-5.0.repo <<EOF
[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc
EOF
```

Next prep the system for MongoDB (as root)
The semodule commands take a minute.

```sh
ulimit -n 65536
cat > mongodb_cgroup_memory.te <<EOF
module mongodb_cgroup_memory 1.0;
require {
      type cgroup_t;
      type mongod_t;
      class dir search;
      class file { getattr open read };
}
#============= mongod_t ==============
allow mongod_t cgroup_t:dir search;
allow mongod_t cgroup_t:file { getattr open read };
EOF
cat > mongodb_proc_net.te <<EOF
module mongodb_proc_net 1.0;
require {
    type proc_net_t;
    type mongod_t;
    class file { open read };
}
#============= mongod_t ==============
allow mongod_t proc_net_t:file { open read };
EOF
checkmodule -M -m -o mongodb_cgroup_memory.mod mongodb_cgroup_memory.te
checkmodule -M -m -o mongodb_proc_net.mod mongodb_proc_net.te
semodule_package -o mongodb_cgroup_memory.pp -m mongodb_cgroup_memory.mod
semodule_package -o mongodb_proc_net.pp -m mongodb_proc_net.mod
semodule -i mongodb_cgroup_memory.pp
semodule -i mongodb_proc_net.pp
```

And install and start up MongoDB
```sh
sudo dnf install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl daemon-reload
sudo systemctl start mongod
```

Is it running? If the output looks like this we are good.

```sh
[user@proxy ~]$ ps auxww | grep mongod
mongod     17707  1.4  5.2 1591976 97824 ?       Sl   02:57   0:00 /usr/bin/mongod -f /etc/mongod.conf
root       17852  0.0  0.0 221928  1152 pts/0    R+   02:57   0:00 grep --color=auto mongod
```

### Get the code

Next let's get the json-proxy code, and enter the directory

```sh
git clone https://github.com/HackerYou/json-proxy
cd json-proxy
```

### Run it as is

Just install the dependancies, and start it up.

```sh
npm install
node server.js
```

### Run it in a container

Note: podman is used in this example. If you are on a system with the docker cli instead then just replace `podman` with `docker` as they should be completely interchange. (Podman was designed to use Docker's command line syntax.)

If you want to run it as a container then there are an additional couple steps. First we get the tools and build the image. The container-tools install takes a couple minutes and so will the first build.

```sh
dnf module install -y container-tools
podman build . -t hackeryou/json-proxy
```

Next we make sure the image built
```sh
[root@proxy json-proxy]# podman images
REPOSITORY                      TAG         IMAGE ID      CREATED         SIZE
localhost/hackeryou/json-proxy  latest      fd57faac8df7  19 seconds ago  1.01 GB
docker.io/library/node          14          db40ea2d00ea  2 weeks ago     973 MB
```

Now we run it, replace "80" with any port you want to expose it on
```sh
podman run -p 80:4500 -d hackeryou/json-proxy
```

And is it running?
```sh
[root@proxy json-proxy]# podman ps
CONTAINER ID  IMAGE                                  COMMAND         CREATED        STATUS            PORTS                 NAMES
a904f9d1e7e6  localhost/hackeryou/json-proxy:latest  node server.js  8 seconds ago  Up 7 seconds ago  0.0.0.0:80->4500/tcp  cranky_zhukovsky
```

And now its available for use based on the usage section up top.
