import { assert, describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, hasAsyncTestData, hasSyncTests, testMatrix } from './lib/util.js';

describe('.concat()', () => {
	for (const [name, testData] of Object.entries(testMatrix)) {
		if (hasSyncTests(testData)) {
			describe(name, () => {
				for (const [name, testData] of Object.entries(testMatrix)) {
					if (hasSyncTests(testData)) {
						describe(`${name} sync`, () => {
							if (testData.syncData) {
								it('should concatenate an iterable and an array', () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iter = new ExtendedIterable(data);
									expect(iter.concat([5, 6]).asArray).toEqual([1, 2, 3, 4, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should concatenate an iterable and an array with a transformer', () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iter = new ExtendedIterable(data, (value) => value * 2);
									expect(iter.concat([5, 6]).asArray).toEqual([2, 4, 6, 8, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should concatenate an iterable and an array with an async transformer', async () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iterator = new ExtendedIterable(data, async (value) => value * 2);
									expect(await iterator.concat([5, 6]).asArray).toEqual([2, 4, 6, 8, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should error if the transformer throws an error', () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iterator = new ExtendedIterable(data, (_value: number): number => {
										throw new Error('test');
									});
									expect(() => iterator.concat([5, 6]).asArray).toThrowError(new Error('test'));
									assertReturnedThrown(data, 0, 1);
								});

								it('should error if the async transformer throws an error', async () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iterator = new ExtendedIterable(data, async (_value: number): Promise<number> => {
										throw new Error('test');
									});
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
									assertReturnedThrown(data, 0, 1);
								});

								it('should error if value to concatenate is not iterable', () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iterator = new ExtendedIterable(data);
									expect(() => iterator.concat(null as any).asArray).toThrowError(new TypeError('Argument is not iterable'));
									assertReturnedThrown(data, 0, 1);
								});

								it('should concatenate an iterable with another iterable', () => {
									assert(testData.syncData);
									const data = testData.syncData();
									const iterator = new ExtendedIterable(data);
									expect(iterator.concat(new Set([5, 6])).asArray).toEqual([1, 2, 3, 4, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});
							}

							if (testData.syncEmptyData) {
								it('should concatenate an empty iterable and an array', () => {
									assert(testData.syncEmptyData);
									const data = testData.syncEmptyData();
									const iterator = new ExtendedIterable(data);
									expect(iterator.concat([5, 6]).asArray).toEqual([5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should concatenate an empty iterable and an empty array', () => {
									assert(testData.syncEmptyData);
									const data = testData.syncEmptyData();
									const iterator = new ExtendedIterable(data);
									expect(iterator.concat([]).asArray).toEqual([]);
									assertReturnedThrown(data, 1, 0);
								});
							}

							if (testData.syncNextThrows) {
								it('should error if the iterator next() throws an error', () => {
									assert(testData.syncNextThrows);
									const data = testData.syncNextThrows();
									const iterator = new ExtendedIterable(data);
									expect(() => iterator.concat([5, 6]).asArray).toThrowError(new Error('test'));
									assertReturnedThrown(data, 0, 1);
								});

								it('should error if the iterator next() throws an error at a specific index', () => {
									assert(testData.syncNextThrows);
									const data = testData.syncNextThrows(2);
									const iterator = new ExtendedIterable(data);
									expect(() => iterator.concat([5, 6]).asArray).toThrowError(new Error('test'));
									assertReturnedThrown(data, 0, 1);
								});
							}
						});
					}

					if (hasAsyncTestData(testData)) {
						describe(`${name} async`, () => {
							if (testData.asyncData) {
								it('should concatenate an async iterable with an array', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data);
									expect(await iterator.concat([5, 6]).asArray).toEqual([1, 2, 3, 4, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should transform and return an array', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data, (value) => value * 2);
									expect(await iterator.concat([5, 6]).asArray).toEqual([2, 4, 6, 8, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should async transform async data and return an array', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data, async (value) => value * 2);
									expect(await iterator.concat([5, 6]).asArray).toEqual([2, 4, 6, 8, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});

								it('should reject if the transformer throws an error', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data, (_value: number): number => {
										throw new Error('test');
									});
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
									assertReturnedThrown(data, 0, 1);
								});

								it('should reject if the async transformer throws an error', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data, async (_value: number): Promise<number> => {
										throw new Error('test');
									});
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
									assertReturnedThrown(data, 0, 1);
								});

								it('should concatenate an async iterable with another async iterable', async () => {
									assert(testData.asyncData);
									const data = testData.asyncData();
									const iterator = new ExtendedIterable(data);
									expect(await iterator.concat(testData.asyncData()).asArray).toEqual([1, 2, 3, 4, 1, 2, 3, 4]);
									assertReturnedThrown(data, 1, 0);
								});
							}

							if (testData.asyncEmptyData) {
								it('should return an empty array', async () => {
									assert(testData.asyncEmptyData);
									const data = testData.asyncEmptyData();
									const iterator = new ExtendedIterable(data);
									expect(await iterator.concat([5, 6]).asArray).toEqual([5, 6]);
									assertReturnedThrown(data, 1, 0);
								});
							}

							if (testData.asyncMixedData) {
								it('should return an array with mixed async and sync values', async () => {
									assert(testData.asyncMixedData);
									const data = testData.asyncMixedData();
									const iterator = new ExtendedIterable(data);
									expect(await iterator.concat([5, 6]).asArray).toEqual([1, 2, 3, 4, 5, 6]);
									assertReturnedThrown(data, 1, 0);
								});
							}

							if (testData.asyncNextThrows) {
								it('should reject if the iterator next() throws an error', async () => {
									assert(testData.asyncNextThrows);
									const data = testData.asyncNextThrows();
									const iterator = new ExtendedIterable(data);
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
									assertReturnedThrown(data, 0, 1);
								});

								it('should reject if the iterator next() throws an error at a specific index', async () => {
									assert(testData.asyncNextThrows);
									const data = testData.asyncNextThrows(2);
									const iterator = new ExtendedIterable(data);
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
									assertReturnedThrown(data, 0, 1);
								});
							}

							if (testData.asyncPartialData) {
								it('should reject if transformer throws an error', async () => {
									assert(testData.asyncPartialData);
									const data = testData.asyncPartialData();
									const iterator = new ExtendedIterable(data, (_value: number): number => {
										throw new Error('test');
									});
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
								});
							}

							if (testData.asyncPartialNextThrows) {
								it('should reject if the iterator next() throws an error', async () => {
									assert(testData.asyncPartialNextThrows);
									const data = testData.asyncPartialNextThrows();
									const iterator = new ExtendedIterable(data);
									await expect(iterator.concat([5, 6]).asArray).rejects.toThrow('test');
								});
							}
						});
					}
				}
			});
		}
	}
});
