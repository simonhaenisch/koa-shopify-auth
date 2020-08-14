import test from 'ava';
import { joinPathSegments } from './utils';

test('joinPathSegments', (t) => {
	t.is(joinPathSegments(), '/');
	t.is(joinPathSegments(''), '/');
	t.is(joinPathSegments('', ''), '/');

	t.is(joinPathSegments('auth'), '/auth');
	t.is(joinPathSegments('/auth'), '/auth');
	t.is(joinPathSegments('auth/'), '/auth');
	t.is(joinPathSegments('/auth/'), '/auth');

	t.is(joinPathSegments('prefix', 'auth'), '/prefix/auth');
	t.is(joinPathSegments('prefix', '/auth'), '/prefix/auth');
	t.is(joinPathSegments('prefix', 'auth/'), '/prefix/auth');
	t.is(joinPathSegments('prefix', '/auth/'), '/prefix/auth');

	t.is(joinPathSegments('/prefix', 'auth'), '/prefix/auth');
	t.is(joinPathSegments('/prefix', '/auth'), '/prefix/auth');
	t.is(joinPathSegments('/prefix', 'auth/'), '/prefix/auth');
	t.is(joinPathSegments('/prefix', '/auth/'), '/prefix/auth');

	t.is(joinPathSegments('prefix/', 'auth'), '/prefix/auth');
	t.is(joinPathSegments('prefix/', '/auth'), '/prefix/auth');
	t.is(joinPathSegments('prefix/', 'auth/'), '/prefix/auth');
	t.is(joinPathSegments('prefix/', '/auth/'), '/prefix/auth');

	t.is(joinPathSegments('/prefix/', 'auth'), '/prefix/auth');
	t.is(joinPathSegments('/prefix/', '/auth'), '/prefix/auth');
	t.is(joinPathSegments('/prefix/', 'auth/'), '/prefix/auth');
	t.is(joinPathSegments('/prefix/', '/auth/'), '/prefix/auth');

	t.is(joinPathSegments('', '?shop=foo'), '/?shop=foo');
	t.is(joinPathSegments('/', '?shop=foo'), '/?shop=foo');
	t.is(joinPathSegments('prefix', '?shop=foo'), '/prefix?shop=foo');

	t.is(joinPathSegments('', 'auth', 'inline?shop=foo'), '/auth/inline?shop=foo');
	t.is(joinPathSegments('prefix', 'auth', 'inline?shop=foo'), '/prefix/auth/inline?shop=foo');
});
