import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.find()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return the first item that satisfies the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(iter.find(item => item === 2)).toEqual(2);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return the first item that satisfies the async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(await iter.find(async item => item === 1)).toEqual(1);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if no item satisfies the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable(data);
						expect(iter.find(item => item === 5)).toBeUndefined;
						assertReturnedThrown(data, 0, 0);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.find('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});

					// it('should return the first item that satisfies the async callback', async () => {
					// 	const data = testData.syncData!();
					// 	const iter = new ExtendedIterable<number>(data);
					// 	expect(await iter.find(async item => item === 2)).toEqual(2);
					// 	assertReturnedThrown(data, 1, 0);
					// });

					it('should propagate an error from the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.find(() => {
							throw new Error('test');
						})).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate an error from the async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return undefined if the array is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable(data);
						expect(iter.find(item => item === 1)).toBeUndefined;
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable(data);
						expect(() => iter.find(item => item === 1)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(3);
						const iter = new ExtendedIterable(data);
						expect(() => iter.find(item => item === 4)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return the first item that satisfies the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item === 2)).toEqual(2);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if no item satisfies the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item === 5)).toBeUndefined;
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate an error from the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate an error from the async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return undefined if the array is empty', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item === 1)).toBeUndefined;
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return the first item that satisfies the callback in a mixed async and sync iterable', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item > 3)).toEqual(4);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return undefined if no item satisfies the callback in a mixed async and sync iterable', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item > 5)).toBeUndefined;
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate an error from the callback in a mixed async and sync iterable', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(item => item === 1)).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncNextThrows!(3);
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(item => item === 4)).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should return the first item that satisfies the callback in a partial async iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.find(item => item === 2)).toEqual(2);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.find(item => item === 1)).rejects.toThrowError(new Error('test'));
					});
				}
			});
		}
	}
});
