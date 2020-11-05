import crypto from 'crypto';

export const safeCompare = (stringA: string, stringB: string) => {
	const lengthA = Buffer.byteLength(stringA);
	const lengthB = Buffer.byteLength(stringB);

	if (lengthA !== lengthB) {
		return false;
	}

	// Turn strings into buffers with equal length to avoid leaking the length.

	const buffA = Buffer.alloc(lengthA, 0, 'utf8');
	buffA.write(stringA);

	const buffB = Buffer.alloc(lengthB, 0, 'utf8');
	buffB.write(stringB);

	return crypto.timingSafeEqual(buffA, buffB);
};
