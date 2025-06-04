import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/index.js';
import { simpleGenerator, simpleAsyncGenerator, createIterable } from './lib/util.js';

describe('.at()', () => {
	describe('array', () => {
		it('should return an item at a specific index of an array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index of an array', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.at(2)).toBeUndefined;
		});
	});

	describe('iterable', () => {
		it('should return an item at a specific index of an iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index of an iterable', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});

		it('should return undefined if index out of range', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.at(2)).toBeUndefined;
		});
	});

	describe('iterable object', () => {
		it('should return an item at a specific index from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable());
			expect(iter.at(2)).toEqual(2);
		});

		it('should return a transformed item at a specific index from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable(), (value) => value * 2);
			expect(iter.at(2)).toEqual(4);
		});

		it('should return undefined if index out of range from an iterable object', () => {
			const iter = new ExtendedIterable(createIterable());
			expect(iter.at(4)).toBeUndefined;
		});
	});

	describe('generator function', () => {
		it('should return an item at a specific index from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index from a generator function', () => {
			const iter = new ExtendedIterable(simpleGenerator, (value) => value * 2);
			expect(iter.at(2)).toEqual(6);
		});
	});

	describe('async generator function', () => {
		it('should return an item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.at(2)).toEqual(3);
		});

		it('should return a transformed item at a specific index from an async generator function', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, (value) => value * 2);
			expect(await iter.at(2)).toEqual(6);
		});
	});
});
