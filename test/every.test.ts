import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.every()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return true if all items satisfy the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.every(item => item > 0)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return false if any item does not satisfy the callback', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.every(item => item < 3)).toBe(false);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.every(item => {
							if (item === 2) {
								throw new Error('error');
							}
							return true;
						})).toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should return true if all items satisfy the async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(async item => item > 0)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return false if any item does not satisfy the async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(async item => item < 0)).toBe(false);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.every(async item => {
							if (item === 2) {
								throw new Error('error');
							}
							return true;
						})).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.every('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return true if the iterable is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(iter.every(item => item < 5)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.every(item => item < 3)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(3);
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.every(item => item < 3)).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return true if all items satisfy the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item > 0)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return false if any item does not satisfy the callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item < 3)).toBe(false);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.every(item => {
							if (item === 2) {
								throw new Error('error');
							}
							return true;
						})).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should return true if all items satisfy the async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(async item => item > 0)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return false if any item does not satisfy the async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(async item => item < 3)).toBe(false);
						assertReturnedThrown(data, 1, 0);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.every(async item => {
							if (item === 2) {
								throw new Error('error');
							}
							return true;
						})).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return true if the iterable is empty', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item < 5)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return true if all items satisfy the callback with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item < 8)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});

					it('should return false if any item does not satisfy the callback with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item < 2)).toBe(false);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should reject if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.every(item => item < 3)).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should loop over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						expect(await iter.every(item => item < 5)).toBe(true);
						assertReturnedThrown(data, 1, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should reject if partial iterator next() throws an error', async () => {
						const data = testData.asyncPartialNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						await expect(iter.every(item => item < 5)).rejects.toThrow('test');
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}
	}
});
