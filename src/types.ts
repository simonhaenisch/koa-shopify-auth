import { Context } from 'koa';

export type AccessMode = 'online' | 'offline';

export interface AuthConfig {
	secret: string;
	apiKey: string;
	myShopifyDomain?: string;
	accessMode?: AccessMode;
	afterAuth?(ctx: Context): void | Promise<void>;
}

export interface OAuthStartOptions extends AuthConfig {
	/**
	 * Prefix for API routes. Default: `''`.
	 */
	prefix?: string;
	/**
	 * App target URL to redirect to in case of successful authentication.
	 * Can be used if your app lives under a custom base path. Default: `'/'`.
	 */
	appTargetUrl?: string;
	/**
	 * Scopes needed by your app.
	 */
	scopes?: string[];
}
