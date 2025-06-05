import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject } from './lib/util.js';

describe('.filter()', () => {
	describe('array', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the array is empty', () => {
			const iter = new ExtendedIterable([]);
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.filter('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});
	});

	describe('iterable', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});
	});

	describe('iterable object', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(createIterableObject());
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([0, 1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(createIterableObject(), (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([0, 2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(createIterableObject());
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});

		it('should return an empty iterable if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			const filtered = iter.filter(_item => true);
			expect(filtered.asArray).toEqual([]);
		});
	});

	describe('generator function', () => {
		it('should return a filtered iterable', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			const filtered = iter.filter(item => item < 0);
			expect(filtered.asArray).toEqual([]);
		});
	});

	describe('async generator function', () => {
		it('should return a filtered iterable', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const filtered = iter.filter(item => item < 3);
			expect(await filtered.asArray).toEqual([1, 2]);
		});

		it('should return a filtered iterable with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			const filtered = iter.filter(item => item < 3);
			expect(await filtered.asArray).toEqual([2]);
		});

		it('should return an empty iterable if the callback returns false for all items', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			const filtered = iter.filter(item => item < 0);
			expect(await filtered.asArray).toEqual([]);
		});
	});
});