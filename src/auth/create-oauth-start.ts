import { Middleware } from 'koa';
import { OAuthStartOptions } from '../types';
import getCookieOptions from './cookie-options';
import Error from './errors';
import { TOP_LEVEL_OAUTH_COOKIE_NAME } from './index';
import oAuthQueryString from './oauth-query-string';

export default function createOAuthStart(options: OAuthStartOptions, callbackPath: string): Middleware {
	return function oAuthStart(ctx) {
		const { myShopifyDomain } = options;
		const { query } = ctx;
		const { shop: unsafeShop } = query;

		const shopRegex = new RegExp(`^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.${myShopifyDomain}$`, 'i');

		if (!unsafeShop || !shopRegex.test(unsafeShop)) {
			ctx.throw(400, Error.ShopParamMissing);
			return;
		}

		ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '', getCookieOptions(ctx));

		const formattedQueryString = oAuthQueryString(ctx, options, callbackPath);

		ctx.redirect(`https://${encodeURIComponent(unsafeShop)}/admin/oauth/authorize?${formattedQueryString}`);
	};
}
