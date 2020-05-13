# `@simonhaenisch/koa-shopify-auth`

Middleware to authenticate a [Koa](http://koajs.com/) application with [Shopify](https://www.shopify.ca/).

Same as `@shopify/koa-shopify-auth` but with some fixes so that it kind of works. Sadly it seems the Shopify team doesn't care much about community contributions, often not even leaving a comment (see [#791](https://github.com/Shopify/quilt/issues/791), [#1099](https://github.com/Shopify/quilt/1099), [#1148](https://github.com/Shopify/quilt/1148), [#1359](https://github.com/Shopify/quilt/1359) or [#1407](https://github.com/Shopify/quilt/1407)).

**Fixes:**

* `prefix` works for all routes (10a3a12)
* `verifyToken` properly redirects to auth if the token has expired (43b51a6)

## Installation

```bash
$ npm install @simonhaenisch/koa-shopify-auth
```

## Usage

This package exposes `shopifyAuth` by default, and `verifyRequest` as a named export.

```js
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
```

### shopifyAuth

Returns an authentication middleware taking up (by default) the routes `/auth` and `/auth/callback`.

```js
app.use(
  shopifyAuth({
    // if specified, mounts the routes off of the given path
    // eg. /shopify/auth, /shopify/auth/callback
    // defaults to ''
    prefix: '/shopify',
    // your shopify app api key
    apiKey: SHOPIFY_API_KEY,
    // your shopify app secret
    secret: SHOPIFY_SECRET,
    // scopes to request on the merchants store
    scopes: ['write_orders, write_products'],
    // set access mode, default is 'online'
    accessMode: 'offline',
    // callback for when auth is completed
    afterAuth(ctx) {
      const {shop, accessToken} = ctx.session;

      console.log('We did it!', accessToken);

      ctx.redirect('/');
    },
  }),
);
```

#### `/auth`

This route starts the oauth process. It expects a `?shop` parameter and will error out if one is not present. To install it in a store just go to `/auth?shop=myStoreSubdomain`.

### `/auth/callback`

You should never have to manually go here. This route is purely for shopify to send data back during the oauth process.

### verifyRequest

Returns a middleware to verify requests before letting them further in the chain.

```javascript
app.use(
  verifyRequest({
    // path to redirect to if verification fails
    // defaults to '/auth'
    authRoute: '/foo/auth',
    // path to redirect to if verification fails and there is no shop on the query
    // defaults to '/auth'
    fallbackRoute: '/install',
  }),
);
```

### Example app

```javascript
import 'isomorphic-fetch';

import Koa from 'koa';
import session from 'koa-session';
import shopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';

const {SHOPIFY_API_KEY, SHOPIFY_SECRET} = process.env;

const app = new Koa();
app.keys = [SHOPIFY_SECRET];

app
  // sets up secure session data on each request
  .use(session({ secure: true, sameSite: 'none' }, app))

  // sets up shopify auth
  .use(
    shopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_SECRET,
      scopes: ['write_orders, write_products'],
      afterAuth(ctx) {
        const {shop, accessToken} = ctx.session;

        console.log('We did it!', accessToken);

        ctx.redirect('/');
      },
    }),
  )

  // everything after this point will require authentication
  .use(verifyRequest())

  // application code
  .use(ctx => {
    ctx.body = '🎉';
  });
```

## Gotchas

### Fetch

This app uses `fetch` to make requests against shopify, and expects you to have it polyfilled. The example app code above includes a call to import it.

### Session

Though you can use `shopifyAuth` without a session middleware configured, `verifyRequest` expects you to have one. If you don't want to use one and have some other solution to persist your credentials, you'll need to build your own verifiction function.

### Testing locally

By default this app requires that you use a `myshopify.com` host in the `shop` parameter. You can modify this to test against a local/staging environment via the `myShopifyDomain` option to `shopifyAuth` (e.g. `myshopify.io`).
