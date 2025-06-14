import { describe, expect, it } from 'vitest';
import { ExtendedIterable } from '../src/extended-iterable.js';
import {
	createAsyncIterableObject,
	createEmptyIterableObject,
	createIterableObject,
	createMixedAsyncIterableObject,
	createPartialAsyncIterableObject,
	simpleAsyncGenerator,
	simpleGenerator
} from './lib/util.js';

describe('.every()', () => {
	describe('array', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(iter.every(item => item < 3)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4], item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});

		it('should return true if the iterable is empty', () => {
			const iter = new ExtendedIterable([]);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should throw an error if the callback is not a function', () => {
			const iter = new ExtendedIterable([1, 2, 3, 4]);
			expect(() => iter.every('foo' as any)).toThrowError(new TypeError('Callback is not a function'));
		});

		it('should propagate error in callback function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3]);
				iter.every(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return true;
				});
			}).toThrowError(new Error('error'));
		});

		it('should propagate error in transformer function', () => {
			expect(() => {
				const iter = new ExtendedIterable([1, 2, 3], value => {
					if (value === 2) {
						throw new Error('error');
					}
					return value * 2;
				});
				iter.every(() => true);
			}).toThrowError(new Error('error'));
		});

		it('should return true if all items satisfy the async callback', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.every(async item => item > 0)).toEqual(true);
		});

		it('should return false if any item does not satisfy the async callback', async () => {
			const iter = new ExtendedIterable([1, 2, 3]);
			expect(await iter.every(async item => item < 2)).toEqual(false);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable([1, 2, 3]);
				await iter.every(async () => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});

		it('should call return() on source iterable', () => {
			const arr = [1, 2, 3];
			const arrIter = arr[Symbol.iterator]();
			let returned = false;
			arrIter.return = () => {
				returned = true;
				return { done: true, value: undefined };
			};
			const every = new ExtendedIterable(arrIter).every(item => item < 5);
			expect(every).toBe(true);
			expect(returned).toBe(true);
		});

		it('should call return() on source async iterable', async () => {
			const arr = [1, 2, 3];
			const arrIter = arr[Symbol.iterator]();
			let returned = false;
			arrIter.return = () => {
				returned = true;
				return { done: true, value: undefined };
			};
			const every = new ExtendedIterable(arrIter).every(item => item < 5);
			expect(every).toBe(true);
			expect(returned).toBe(true);
		});

		it('should call throw() on source iterable', () => {
			const arr = [1, 2, 3];
			const arrIter = arr[Symbol.iterator]();
			let thrown = false;
			arrIter.throw = () => {
				thrown = true;
				throw new Error('error');
			};
			const iter = new ExtendedIterable(arrIter);
			expect(() => iter.every(item => {
				if (item === 2) {
					throw new Error('error');
				}
				return item < 5;
			})).toThrowError(new Error('error'));
			expect(thrown).toBe(true);
		});

		it('should call throw() on source async iterable', async () => {
			const arr = [1, 2, 3];
			const arrIter = arr[Symbol.iterator]();
			let thrown = false;
			arrIter.throw = () => {
				thrown = true;
				throw new Error('error');
			};
			const iter = new ExtendedIterable(arrIter);
			await expect(async () => {
				await iter.every(async item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item < 5;
				});
			}).rejects.toThrowError(new Error('error'));
			expect(thrown).toBe(true);
		});
	});

	describe('iterable', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]));
			expect(iter.every(item => item < 3)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(new Set([1, 2, 3, 4]), item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});

		it('should return true if the iterable is empty', () => {
			const iter = new ExtendedIterable(new Set([]));
			expect(iter.every(item => item < 5)).toBe(true);
		});
	});

	describe('iterable object', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(createIterableObject());
			expect(iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(item => item < 8)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(item => item < 2)).toBe(false);
		});

		it('should return true if the iterable object is empty', () => {
			const iter = new ExtendedIterable(createEmptyIterableObject());
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return true if all items satisfy the async callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(async item => item < 8)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with mixed async and sync values', async () => {
			const iterator = new ExtendedIterable(createMixedAsyncIterableObject());
			expect(await iterator.every(async item => item > 3)).toBe(false);
		});

		it('should call return() on source iterable', () => {
			const obj = createIterableObject();
			const iter = new ExtendedIterable(obj);
			expect(iter.every(item => item < 5)).toBe(true);
			expect(obj.returned).toBe(1);
		});

		it('should return false and call return() on source iterable with async callback', async () => {
			const obj = createIterableObject();
			const iter = new ExtendedIterable(obj);
			expect(await iter.every(async () => false)).toBe(false);
			expect(obj.returned).toBe(1);
		});

		it('should call return() on source async iterable', async () => {
			const obj = createAsyncIterableObject();
			const iter = new ExtendedIterable(obj);
			expect(await iter.every(async item => item < 5)).toBe(true);
			expect(obj.returned).toBe(1);
		});

		it('should call throw() on source iterable', () => {
			const obj = createIterableObject();
			const iter = new ExtendedIterable(obj);
			expect(() => iter.every(item => {
				if (item === 2) {
					throw new Error('error');
				}
				return item < 5;
			})).toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source async iterable', async () => {
			const obj = createAsyncIterableObject();
			const iter = new ExtendedIterable(obj);
			await expect(async () => {
				await iter.every(async item => {
					if (item === 2) {
						throw new Error('error');
					}
					return item < 5;
				});
			}).rejects.toThrowError(new Error('error'));
			expect(obj.thrown).toBe(1);
		});

		it('should call throw() on source async iterable with callback', async () => {
			const obj = createPartialAsyncIterableObject();
			const iter = new ExtendedIterable(obj);
			await expect(async () => {
				await iter.every(() => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});

		it('should call throw() on source async iterable with async callback', async () => {
			const obj = createPartialAsyncIterableObject();
			const iter = new ExtendedIterable(obj);
			await expect(async () => {
				await iter.every(async () => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});

	describe('generator function', () => {
		it('should return true if all items satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', () => {
			const iter = new ExtendedIterable(simpleGenerator);
			expect(iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', () => {
			const iter = new ExtendedIterable(simpleGenerator, item => item * 2);
			expect(iter.every(item => item < 6)).toBe(false);
		});
	});

	describe('async generator function', () => {
		it('should return true if all items satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(item => item < 5)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(item => item < 2)).toBe(false);
		});

		it('should return true if all items satisfy the callback with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.every(item => item < 10)).toBe(true);
		});

		it('should return false if any item does not satisfy the callback with a transformer', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator, item => item * 2);
			expect(await iter.every(item => item < 6)).toBe(false);
		});

		it('should propagate error in callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
				await iter.every(item => {
					if (item === 2) {
						throw new Error('error');
					}
					return true;
				});
			}).rejects.toThrowError(new Error('error'));
		});

		it('should propagate error in transformer function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator, value => {
					if (value === 2) {
						throw new Error('error');
					}
					return value * 2;
				});
				await iter.every(() => true);
			}).rejects.toThrowError(new Error('error'));
		});

		it('should return true if all items satisfy the async callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(async item => item > 0)).toEqual(true);
		});

		it('should return false if any item does not satisfy the async callback', async () => {
			const iter = new ExtendedIterable(simpleAsyncGenerator);
			expect(await iter.every(async item => item < 2)).toEqual(false);
		});

		it('should propagate error in async callback function', async () => {
			await expect(async () => {
				const iter = new ExtendedIterable(simpleAsyncGenerator);
					await iter.every(async () => {
					throw new Error('error');
				});
			}).rejects.toThrowError(new Error('error'));
		});
	});
});
