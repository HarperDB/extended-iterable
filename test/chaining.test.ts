import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';

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
});
