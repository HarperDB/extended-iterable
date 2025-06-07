import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { createMixedAsyncIterableObject } from './lib/util.js';
import { setTimeout as delay } from 'node:timers/promises';

describe('Chaining', () => {
	it('should chain methods', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
		expect(iter.map(item => item * 2).take(5).asArray).toEqual([2, 4, 6, 8, 10]);
	});

	it('should chain methods with a transformer', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], item => item * 2);
		expect(iter.take(5).asArray).toEqual([2, 4, 6, 8, 10]);
	});

	it('should chain methods with a transformer and a limit', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], item => item * 2);
		expect(iter.take(5).asArray).toEqual([2, 4, 6, 8, 10]);
	});

	it('should chain methods with a transformer and a limit and a callback', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], item => item * 2);
		expect(iter.take(5).map(item => item * 2).asArray).toEqual([4, 8, 12, 16, 20]);
	});

	it('should not transform twice', () => {
		const iter = new ExtendedIterable([1], item => item * -1);
		expect(iter.map(item => item * 2).filter(item => item !== 0).asArray).toEqual([-2]);
	});

	it('should async chain methods', async () => {
		const iter = new ExtendedIterable(createMixedAsyncIterableObject());
		expect(await iter
			// 0, 1, 2, 3, 4, 5
			.map(async item => {
				await delay(10);
				return item * 2;
			})
			// 0, 2, 4, 6, 8, 10
			.take(4)
			// 0, 2, 4, 6
			.filter(async item => {
				await delay(10);
				return item > 3;
			})
			// 4, 6
			.asArray
		).toEqual([4, 6]);
	});
});
