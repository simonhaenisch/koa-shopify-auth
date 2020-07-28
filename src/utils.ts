/**
 * Join the given path segments.
 *
 * - always with a leading slash
 * - never with a trailing slash
 * - no slash before `?` (except for `/?...`)
 */
export const joinPathSegments = (...segments: string[]) => {
	const joined = segments.map(trimSlashes).join('/').replace('/?', '?');

	return joined.startsWith('/') ? joined : `/${joined}`;
};

const trimLeadingSlash = (s: string) => (s.startsWith('/') ? s.slice(1) : s);
const trimTrailingSlash = (s: string) => (s.endsWith('/') ? s.slice(0, -1) : s);

const trimSlashes = pipe(trimLeadingSlash, trimTrailingSlash);

export function pipe<T1, T2, T3>(f: (x: T1) => T2, g: (x: T2) => T3): (x: T1) => T3;
export function pipe<T1, T2, T3, T4>(f: (x: T1) => T2, g: (x: T2) => T3, h: (x: T3) => T4): (x: T1) => T4;
export function pipe<T1, T2, T3, T4, T5>(
	f: (x: T1) => T2,
	g: (x: T2) => T3,
	h: (x: T3) => T4,
	k: (x: T4) => T5,
): (x: T1) => T5;
export function pipe(...functions: any[]) {
	return (data: any) => functions.reduce((value, func) => func(value), data);
}
