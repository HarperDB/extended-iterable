import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.reduce()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should reduce the iterable to a single value with an initial value', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.reduce((acc, item) => acc + item, 0)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should reduce the iterable to a single value without an initial value', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.reduce((acc, item) => acc ? acc + item : item)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.reduce(() => {
							throw new Error('error');
						})).toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should reduce the iterable to a single value with an initial value and async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce(async (acc, item) => acc + item, 0)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should reduce the iterable to a single value without an initial value and async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce(async (acc, item) => acc ? acc + item : item)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(async () => {
							await iter.reduce(async () => {
								throw new Error('error');
							});
						}).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.reduce('foo' as any, 0)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should reduce an empty iterable with an initial value', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.reduce((acc, item) => acc + item, 0)).toBe(0);
						assertReturnedThrown(data, 1, 0);
					});

					it('should throw an error if empty iterable and no initial value', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.reduce((acc, item) => acc ? acc + item : item)).toThrowError(new TypeError('Reduce of empty iterable with no initial value'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should reduce the iterable to a single value with an initial value', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should reduce the iterable to a single value without an initial value', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce((acc, item) => acc ? acc + item : item)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(async () => {
							await iter.reduce(() => {
								throw new Error('error');
							});
						}).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(async () => {
							await iter.reduce(async () => {
								throw new Error('error');
							});
						}).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should reduce an empty iterable with an initial value', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(0);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should reduce a mixed async and sync iterable to a single value', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(10);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.reduce((acc, item) => acc + item, 0)).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should loop over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.reduce((acc, item) => acc + item, 0)).toBe(10);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the partial iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncPartialNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.reduce((acc, item) => acc + item, 0)).rejects.toThrowError(new Error('test'));
					});
				}
			});
		}
	}
});
