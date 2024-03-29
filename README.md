# OpenAtlasDiscovery

# About

OpenAtlasDiscovery is a presentation web application for
[OpenAtlas](https://openatlas.eu) projects.

**Update October 2022**:<br/>
Because of changing technologies work on
a new system has begun,
see: [OpenAtlas Discovery](https://github.com/craws/OpenAtlas-Discovery)

# Technology
The web application is built using the [nuxtjs](https://nuxtjs.org/) framework
based on [Vuejs](https://vuejs.org/)

# Setup
Whilst the application ultimately runs in the browser and can be served from
any web server developing and deploying it requires
[NodeJS](https://nodejs.org/en/about/releases/)
(minimum v10, current LTS is recommended).

After cloning the repository, install all dependencies in the application root
with
```bash
$ npm install
```

# Configuration
Furthermore, a running OpenAtlas instance with an activated
[API Module](https://demo.openatlas.eu/static/manual/tools/api.html)
is required.
The instance served needs to be configured (servers/url) in the
[Server Object](https://swagger.io/specification/#server-object) of
the OpenAPI specification here:
```
assets\swagger.json
``` 

## For Development
Serve with hot reload at localhost:3000
```
$ npm run dev
```

## For Deployment
Generate the project files to /dist
```
$ npm run export
```

The resulting files in the /dist folder can be served from any web server or
be exposed through nuxt using
```
npm run start
```
When you are serving the application from your own server (ie Apache) you need
to configure it accordingly to avoid 404 responses on dynamically generated
routes. Some examples can be found in the
[Vue Router Documentation](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)

For detailed explanation on how things work, check out
[Nuxt.js docs](https://nuxtjs.org).

One solution would be to add following lines in the Directory section of the
Apache configuration:
```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

# Licensing
All code unless otherwise noted is licensed under the terms of the MIT License
(MIT). Please refer to the file License.txt in the root directory of this
repository.

All documentation and images unless otherwise noted are licensed under the
terms of Creative Commons Attribution-ShareAlike 4.0 International License.
To view a copy of this license, visit
[http://creativecommons.org/licenses/by-sa/4.0/](http://creativecommons.org/licenses/by-sa/4.0/)
