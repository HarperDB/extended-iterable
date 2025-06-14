import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, hasAsyncTestData, hasSyncTests, testMatrix } from './lib/util.js';

describe('.at()', () => {
	it('should throw an error if the index is not a number', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4]);
		expect(() => iter.at('foo' as any)).toThrowError(new TypeError('index is not a number'));
	});

	it('should throw an error if the index is negative', () => {
		const iter = new ExtendedIterable([1, 2, 3, 4]);
		expect(() => iter.at(-1)).toThrowError(new RangeError('index must be a positive number'));
	});

	for (const [name, testData] of Object.entries(testMatrix)) {
		if (hasSyncTests(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return an item at a specific index', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return a transformed item at a specific index', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data, (value) => value * 2);
						expect(iterator.at(2)).toEqual(6);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an async transformed item at a specific index', async () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data, async (value) => value * 2);
						expect(await iterator.at(2)).toEqual(6);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if index out of range of empty iterator', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});

					it('should error if the transformer throws an error', () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						expect(() => iterator.at(2)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should error if the async transformer throws an error', async () => {
						assert(testData.syncData);
						const data = testData.syncData();
						const iterator = new ExtendedIterable(data, async () => {
							throw new Error('test');
						});
						await expect(iterator.at(2)).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return undefined if index out of range of empty iterator', () => {
						assert(testData.syncEmptyData);
						const data = testData.syncEmptyData();
						const iterator = new ExtendedIterable(data);
						expect(iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should error if the iterator next() throws an error', () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows();
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.at(2)).toThrowError(new Error('test'));
					});

					it('should error if the iterator next() throws an error at a specific index', () => {
						assert(testData.syncNextThrows);
						const data = testData.syncNextThrows(2);
						const iterator = new ExtendedIterable(data);
						expect(() => iterator.at(2)).toThrowError(new Error('test'));
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return an item at a specific index', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return a transformed item at a specific index', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data, (value) => value * 2);
						expect(await iterator.at(2)).toEqual(6);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return an async transformed item at a specific index', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data, async (value) => value * 2);
						expect(await iterator.at(2)).toEqual(6);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if index out of range of empty iterator', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});

					it('should error if the transformer throws an error', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						const promise = iterator.at(2);
						await expect(promise).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});

					it('should error if the async transformer throws an error', async () => {
						assert(testData.asyncData);
						const data = testData.asyncData();
						const iterator = new ExtendedIterable(data, async () => {
							throw new Error('test');
						});
						await expect(iterator.at(2)).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return undefined if index out of range of empty iterator', async () => {
						assert(testData.asyncEmptyData);
						const data = testData.asyncEmptyData();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(10)).toBeUndefined;
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an item at a specific index', async () => {
						assert(testData.asyncMixedData);
						const data = testData.asyncMixedData();
						const iterator = new ExtendedIterable(data);
						expect(await iterator.at(2)).toEqual(3);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						assert(testData.asyncNextThrows);
						const data = testData.asyncNextThrows();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.at(2)).rejects.toThrow('test');
					});
				}

				if (testData.asyncPartialData) {
					it('should reject if transformer throws an error', async () => {
						assert(testData.asyncPartialData);
						const data = testData.asyncPartialData();
						const iterator = new ExtendedIterable(data, () => {
							throw new Error('test');
						});
						await expect(iterator.at(2)).rejects.toThrow('test');
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						assert(testData.asyncPartialNextThrows);
						const data = testData.asyncPartialNextThrows();
						const iterator = new ExtendedIterable(data);
						await expect(iterator.at(2)).rejects.toThrow('test');
					});
				}
			});
		}
	}
});
