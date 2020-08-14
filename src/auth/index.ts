import { Context, Middleware } from 'koa';
import { AccessMode, OAuthStartOptions } from '../types';
import { joinPathSegments } from '../utils';
import createEnableCookies from './create-enable-cookies';
import createOAuthCallback from './create-oauth-callback';
import createOAuthStart from './create-oauth-start';
import createRequestStorageAccess from './create-request-storage-access';
import createTopLevelOAuthRedirect from './create-top-level-oauth-redirect';

const DEFAULT_MYSHOPIFY_DOMAIN = 'myshopify.com';
const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export const TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
export const TEST_COOKIE_NAME = 'shopifyTestCookie';
export const GRANTED_STORAGE_ACCESS_COOKIE_NAME = 'shopify.granted_storage_access';

function hasCookieAccess({ cookies }: Context) {
	return Boolean(cookies.get(TEST_COOKIE_NAME));
}

function grantedStorageAccess({ cookies }: Context) {
	return Boolean(cookies.get(GRANTED_STORAGE_ACCESS_COOKIE_NAME));
}

function shouldPerformInlineOAuth({ cookies }: Context) {
	return Boolean(cookies.get(TOP_LEVEL_OAUTH_COOKIE_NAME));
}

export default function createShopifyAuth(options: OAuthStartOptions): Middleware {
	const config = {
		scopes: [],
		prefix: '',
		appTargetUrl: '',
		myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
		accessMode: DEFAULT_ACCESS_MODE,
		...options,
	};

	const oAuthStartPath = joinPathSegments(config.prefix, 'auth');
	const oAuthCallbackPath = joinPathSegments(oAuthStartPath, 'callback');

	const oAuthStart = createOAuthStart(config, oAuthCallbackPath);
	const oAuthCallback = createOAuthCallback(config);

	const inlineOAuthPath = joinPathSegments(config.prefix, 'auth', 'inline');
	const topLevelOAuthRedirect = createTopLevelOAuthRedirect(config.apiKey, inlineOAuthPath);

	const enableCookiesPath = joinPathSegments(oAuthStartPath, 'enable_cookies');
	const enableCookies = createEnableCookies(config);
	const requestStorageAccess = createRequestStorageAccess(config);

	return async function shopifyAuth(ctx, next) {
		ctx.cookies.secure = true;

		if (ctx.path === oAuthStartPath && !hasCookieAccess(ctx) && !grantedStorageAccess(ctx)) {
			requestStorageAccess(ctx, next);
			return;
		}

		if (ctx.path === inlineOAuthPath || (ctx.path === oAuthStartPath && shouldPerformInlineOAuth(ctx))) {
			oAuthStart(ctx, next);
			return;
		}

		if (ctx.path === oAuthStartPath) {
			topLevelOAuthRedirect(ctx, next);
			return;
		}

		if (ctx.path === oAuthCallbackPath) {
			await oAuthCallback(ctx, next);
			return;
		}

		if (ctx.path === enableCookiesPath) {
			enableCookies(ctx, next);
			return;
		}

		await next();
	};
}

export { default as Error } from './errors';
export { default as validateHMAC } from './validate-hmac';
