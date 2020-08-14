import { Header, Method, StatusCode } from '@shopify/network';
import { Middleware } from 'koa';
import getCookieOptions from '../auth/cookie-options';
import { TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME } from '../index';
import { Routes } from './types';
import { redirectToAuth } from './utilities';

export function verifyToken(routes: Routes): Middleware {
	return async function verifyTokenMiddleware(ctx, next) {
		const { session } = ctx;

		if (session && session.accessToken) {
			ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '', getCookieOptions(ctx));
			// If a user has installed the store previously on their shop, the accessToken can be stored in session.
			// we need to check if the accessToken is valid, and the only way to do this is by hitting the api.
			const response = await fetch(`https://${session.shop}/admin/metafields.json`, {
				method: Method.Post,
				headers: {
					[Header.ContentType]: 'application/json',
					'X-Shopify-Access-Token': session.accessToken,
				},
			});

			if (response.status === StatusCode.Unauthorized) {
				redirectToAuth(routes, ctx);
				return;
			}

			await next();
			return;
		}

		ctx.cookies.set(TEST_COOKIE_NAME, '1', getCookieOptions(ctx));

		redirectToAuth(routes, ctx);
	};
}
