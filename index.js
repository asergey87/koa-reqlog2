const crypto = require('crypto');
const pug = require('pug');

const requests = [];

/**
 * Http Request Log Middleware
 * @param options
 * @param options.url {string}
 * @param options.ignore {string[]}
 * @param options.maxItems {number}
 * @return {function(...[*]=)}
 */
module.exports = options => async (ctx, next) => {
  const { url = '', ignore = [], maxItems = 50 } = options;

  const path = ctx.request.path.trim();
  const sameUrl = path.toLowerCase() === url.trim().toLowerCase();
  const requestId = crypto.randomBytes(4).toString('hex');

  if (url.length === 0) {
    ctx.throw(500, 'Request logger: options.url didn\'t set');
  }

  const shouldSkip = ignore.length ? ignore.some(i => path.match(i)) : false;

  ctx.set('x-request-id', requestId);

  ctx.res.once('finish', () => {
    if (!sameUrl && !shouldSkip) {
      const payload = {
        requestId,
        method: ctx.request.method,
        requestedAt: new Date(),
        request: {
          body: ctx.request.body,
          headers: ctx.request.headers,
          query: ctx.request.query,
          path
        },
        response: {
          httpStatus: ctx.res.statusCode,
          httpStatusMessage: ctx.res.statusMessage,
          headers: ctx.response.headers,
          body: ctx.body || null
        }
      };
      requests.push(payload);
      requests.splice(0, requests.length - maxItems);
    }
  });

  if (sameUrl && ctx.request.query.json) {
    ctx.body = { requests };
  } else if (sameUrl) {
    ctx.type = 'text/html';
    ctx.body = pug.renderFile(`${__dirname}/src/index.pug`, {
      title: 'Request Log Middleware',
      url
    });
  } else {
    await next();
  }
};
