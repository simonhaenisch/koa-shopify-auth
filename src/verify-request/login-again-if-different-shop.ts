import { Middleware } from 'koa';
import { Routes } from './types';
import { clearSession, redirectToAuth } from './utilities';

export function loginAgainIfDifferentShop(routes: Routes): Middleware {
	return async function loginAgainIfDifferentShopMiddleware(ctx, next) {
		const { query, session } = ctx;

		if (session && query.shop && session.shop !== query.shop) {
			clearSession(ctx);
			redirectToAuth(routes, ctx);
			return;
		}

		await next();
	};
}
