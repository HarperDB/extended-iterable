import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.forEach()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should loop over the iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						iter.forEach(item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate an error from the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.forEach(() => {
							throw new Error('test');
						})).toThrowError(new Error('test'));
					});

					it('should loop over the iterable with an async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(async item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate an error from the async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.forEach(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.forEach('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should loop over an empty array', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						iter.forEach(item => result.push(item));
						expect(result).toEqual([]);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						expect(() => iter.forEach(item => {
							result.push(item);
						})).toThrowError(new Error('test'));
						expect(result).toEqual([]);
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(3);
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						expect(() => iter.forEach(item => {
							result.push(item);
						})).toThrowError(new Error('test'));
						expect(result).toEqual([1, 2]);
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should loop over the array', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate an error from the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.forEach(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should loop over the iterable with an async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(async item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate an error from the async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.forEach(async () => {
							throw new Error('test');
						})).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should loop over an empty array', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(item => result.push(item));
						expect(result).toEqual([]);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should loop over a mixed iterable with async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedThrows) {
					it('should reject if the mixed iterator next() throws an error', async () => {
						const data = testData.asyncMixedThrows!(3);
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await expect(iter.forEach(item => {
							result.push(item);
						})).rejects.toThrow('test');
						expect(result).toEqual([1, 2]);
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await expect(iter.forEach(item => {
							result.push(item);
						})).rejects.toThrow('test');
						expect(result).toEqual([]);
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should loop over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await iter.forEach(item => result.push(item));
						expect(result).toEqual([1, 2, 3, 4]);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const result: number[] = [];
						await expect(iter.forEach(item => result.push(item))).rejects.toThrow('test');
						expect(result).toEqual([]);
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}
	}
});
