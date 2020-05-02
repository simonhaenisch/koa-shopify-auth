import { Context } from 'koa';
import { Routes } from './types';

export function redirectToAuth({ fallbackRoute, authRoute }: Routes, ctx: Context) {
	const shop = ctx.query.shop || ctx.session?.shop; // || new URLSearchParams(ctx.req.headers.referer).get('shop')

	const routeForRedirect = shop ? `${authRoute}?shop=${shop}` : fallbackRoute;

	ctx.redirect(routeForRedirect);
}

export function clearSession(ctx: Context) {
	delete ctx.session.shop;
	delete ctx.session.accessToken;
}
