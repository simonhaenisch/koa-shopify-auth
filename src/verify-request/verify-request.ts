import compose from 'koa-compose';
import { loginAgainIfDifferentShop } from './login-again-if-different-shop';
import { Options, Routes } from './types';
import { verifyToken } from './verify-token';

export default function verifyRequest(givenOptions: Options = {}) {
	const routes: Routes = {
		authRoute: '/auth',
		fallbackRoute: '/auth',
		...givenOptions,
	};

	return compose([loginAgainIfDifferentShop(routes), verifyToken(routes)]);
}
