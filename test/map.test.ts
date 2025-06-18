import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import { assertReturnedThrown, dataMatrix, hasAsyncTestData, hasSyncTestData } from './lib/util.js';

describe('.map()', () => {
	for (const [name, testData] of Object.entries(dataMatrix)) {
		if (hasSyncTestData(testData)) {
			describe(`${name} sync`, () => {
				if (testData.syncData) {
					it('should return a mapped iterable', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(mapIter.next()).toEqual({ value: 2, done: false });
						expect(mapIter.next()).toEqual({ value: 4, done: false });
						expect(mapIter.next()).toEqual({ value: 6, done: false });
						expect(mapIter.next()).toEqual({ value: 8, done: false });
						expect(mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return a mapped iterable with an async callback', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(async item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						expect(await mapIter.next()).toEqual({ value: 4, done: false });
						expect(await mapIter.next()).toEqual({ value: 6, done: false });
						expect(await mapIter.next()).toEqual({ value: 8, done: false });
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate error in callback function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(() => {
							throw new Error('error');
						})[Symbol.iterator]();
						expect(() => mapIter.next()).toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(mapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the callback is not a function', () => {
						const data = testData.syncData!();
						const iter = new ExtendedIterable<number>(data);
						expect(() => iter.map('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.syncEmptyData) {
					it('should return an empty iterable if the iterable is empty', () => {
						const data = testData.syncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.syncNextThrows) {
					it('should throw an error if the iterator next() throws an error', () => {
						const data = testData.syncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(() => mapIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should throw an error if the iterator next() throws an error at a specific index', () => {
						const data = testData.syncNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(mapIter.next()).toEqual({ value: 2, done: false });
						expect(() => mapIter.next()).toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}

		if (hasAsyncTestData(testData)) {
			describe(`${name} async`, () => {
				if (testData.asyncData) {
					it('should return a mapped iterable', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						expect(await mapIter.next()).toEqual({ value: 4, done: false });
						expect(await mapIter.next()).toEqual({ value: 6, done: false });
						expect(await mapIter.next()).toEqual({ value: 8, done: false });
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should return a mapped iterable with an async callback', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(async item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						expect(await mapIter.next()).toEqual({ value: 4, done: false });
						expect(await mapIter.next()).toEqual({ value: 6, done: false });
						expect(await mapIter.next()).toEqual({ value: 8, done: false });
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});

					it('should propagate error in callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(mapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});

					it('should propagate error in async callback function', async () => {
						const data = testData.asyncData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(async () => {
							throw new Error('error');
						})[Symbol.iterator]();
						await expect(mapIter.next()).rejects.toThrowError(new Error('error'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncEmptyData) {
					it('should return an empty iterable if the iterable is empty', async () => {
						const data = testData.asyncEmptyData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncMixedData) {
					it('should return an iterable with mixed async and sync values', async () => {
						const data = testData.asyncMixedData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						expect(await mapIter.next()).toEqual({ value: 4, done: false });
						expect(await mapIter.next()).toEqual({ value: 6, done: false });
						expect(await mapIter.next()).toEqual({ value: 8, done: false });
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncNextThrows) {
					it('should throw an error if the iterator next() throws an error', async () => {
						const data = testData.asyncNextThrows!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						await expect(mapIter.next()).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}

				if (testData.asyncPartialData) {
					it('should loop over a partial iterable', async () => {
						const data = testData.asyncPartialData!();
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						expect(await mapIter.next()).toEqual({ value: 4, done: false });
						expect(await mapIter.next()).toEqual({ value: 6, done: false });
						expect(await mapIter.next()).toEqual({ value: 8, done: false });
						expect(await mapIter.next()).toEqual({ value: undefined, done: true });
						assertReturnedThrown(data, 0, 0);
					});
				}

				if (testData.asyncPartialNextThrows) {
					it('should throw an error if the partial iterator next() throws an error at a specific index', async () => {
						const data = testData.asyncPartialNextThrows!(2);
						const iter = new ExtendedIterable<number>(data);
						const mapIter = iter.map(item => item * 2)[Symbol.iterator]();
						expect(await mapIter.next()).toEqual({ value: 2, done: false });
						await expect(mapIter.next()).rejects.toThrowError(new Error('test'));
						assertReturnedThrown(data, 0, 1);
					});
				}
			});
		}
	}
});
