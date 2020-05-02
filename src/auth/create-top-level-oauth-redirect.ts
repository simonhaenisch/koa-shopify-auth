import { Context } from 'koa';
import getCookieOptions from './cookie-options';
import createTopLevelRedirect from './create-top-level-redirect';
import { TOP_LEVEL_OAUTH_COOKIE_NAME } from './index';

export default function createTopLevelOAuthRedirect(apiKey: string, path: string) {
	const redirect = createTopLevelRedirect(apiKey, path);

	return function topLevelOAuthRedirect(ctx: Context) {
		ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '1', getCookieOptions(ctx));
		redirect(ctx);
	};
}