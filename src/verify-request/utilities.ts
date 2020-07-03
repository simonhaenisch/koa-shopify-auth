import { Context } from 'koa';
import { Routes } from './types';

export function redirectToAuth({ fallbackRoute, authRoute }: Routes, ctx: Context) {
	/**
	 * @todo also use `|| new URLSearchParams(ctx.req.headers.referer).get('shop')` as fallback?
	 */
	const shop = ctx.query.shop ? encodeURIComponent(ctx.query.shop) : ctx.session?.shop;

	const routeForRedirect = shop ? `${authRoute}?shop=${shop}` : fallbackRoute;

	ctx.redirect(routeForRedirect);
}

export function clearSession(ctx: Context) {
	delete ctx.session.shop;
	delete ctx.session.accessToken;
}
