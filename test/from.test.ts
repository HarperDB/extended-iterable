import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { simpleGenerator, simpleAsyncGenerator, createIterableObject, createEmptyIterableObject, createMixedAsyncIterableObject } from './lib/util.js';

describe('.from()', () => {
	describe('array', () => {
		it('should return an array', () => {
			const array = ExtendedIterable.from([1, 2, 3]);
			expect(array).toEqual([1, 2, 3]);
		});

		it('should return an array with a transformer', () => {
			const array = ExtendedIterable.from([1, 2, 3], item => item * 2);
			expect(array).toEqual([2, 4, 6]);
		});
	});

	describe('iterable', () => {
		it('should return an array', () => {
			const array = ExtendedIterable.from(new Set([1, 2, 3]));
			expect(array).toEqual([1, 2, 3]);
		});

		it('should return an array with a transformer', () => {
			const array = ExtendedIterable.from(new Set([1, 2, 3]), item => item * 2);
			expect(array).toEqual([2, 4, 6]);
		});
	});

	describe('iterable object', () => {
		it('should return an array', () => {
			const array = ExtendedIterable.from(createIterableObject());
			expect(array).toEqual([0, 1, 2, 3]);
		});

		it('should return an array with a transformer', () => {
			const array = ExtendedIterable.from(createIterableObject(), item => item * 2);
			expect(array).toEqual([0, 2, 4, 6]);
		});

		it('should return an empty array', () => {
			const array = ExtendedIterable.from(createEmptyIterableObject());
			expect(array).toEqual([]);
		});

		it('should return an array from a mixed async iterable', async () => {
			const array = await ExtendedIterable.from(createMixedAsyncIterableObject());
			expect(array).toEqual([0, 1, 2, 3, 4, 5]);
		});
	});

	describe('generator function', () => {
		it('should return an array', () => {
			const array = ExtendedIterable.from(simpleGenerator);
			expect(array).toEqual([1, 2, 3]);
		});

		it('should return an array with a transformer', () => {
			const array = ExtendedIterable.from(simpleGenerator, item => item * 2);
			expect(array).toEqual([2, 4, 6]);
		});
	});

	describe('async generator function', () => {
		it('should return an array', async () => {
			const array = await ExtendedIterable.from(simpleAsyncGenerator);
			expect(array).toEqual([1, 2, 3]);
		});

		it('should return an array with a transformer', async () => {
			const array = await ExtendedIterable.from(simpleAsyncGenerator, item => item * 2);
			expect(array).toEqual([2, 4, 6]);
		});
	});
});
