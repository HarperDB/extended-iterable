import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { createIterableObject, createMixedAsyncIterableObject } from './lib/util.js';

describe('Chaining', () => {
	it('should chain methods', () => {
		const iterable = createIterableObject({ count: 10 });
		const iter = new ExtendedIterable(iterable);
		expect(iter.map(item => item * 2).take(5).asArray).toEqual([2, 4, 6, 8, 10]);
		expect(iterable.returned).toBe(1);
		expect(iterable.thrown).toBe(0);
	});

	it('should async chain methods', async () => {
		const obj = createMixedAsyncIterableObject();
		const iter = new ExtendedIterable(obj);
		expect(await iter
			// 1, 2, 3, 4
			.map(async item => item * 2)
			// 2, 4, 6, 8
			.take(3)
			// 2, 4, 6
			.filter(async item => item > 3)
			// 4, 6
			.asArray
		).toEqual([4, 6]);
		expect(obj.returned).toBe(1);
		expect(obj.thrown).toBe(0);
	});
});
