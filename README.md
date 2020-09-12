# koa-reqlog2
[![Build Status](https://travis-ci.org/asergey87/koa-reqlog.svg?branch=master)](https://github.com/asergey87/koa-reqlog2)
> Simple middleware for view logs in KoaJS@2.

## Install
```
$ npm install koa-reqlog2
```
## Features
- navigation
- searchbar

## Hello world
```sh
npm install koa
npm install koa-json
npm install koa-bodyparser
npm install koa-reqlog2
```
index.js:
```js
const Koa = require('koa');
const koaJson = require('koa-json');
const koaBodyParser = require('koa-bodyparser');
const requestLogger = require('koa-reqlog');

const app = new Koa();

app.use(koaJson({ pretty: false }));
app.use(koaBodyParser({ enableTypes: ['json'] }));
app.use(requestLogger({
  url: '/api/rl',
  ignore: [
    /swagger/
  ],
  maxItems: 50
}));

app.listen(process.env.PORT || 3000);
```

```sh
$ node index.js
$ curl -i -XGET http://localhost:3000/?someparam=someValue
HTTP/1.1 404 Not Found
x-request-id: d6787c4b
Content-Type: text/plain; charset=utf-8
Content-Length: 9
Date: Fri, 09 Nov 2018 14:23:56 GMT
Connection: keep-alive

Not Found
```
Then open [http://localhost:3000/api/rl](http://localhost:3000/api/rl)

See full example in `examples`


## Options
> Options available for `koa-reqlog`.

- `url` **{String}** Url for preview request log in app, default `/request-log`
- `lastItems` **{Number}** Count of latest request, default `20`

## Tests
```
$ npm test
```

## License
The MIT License, 2018