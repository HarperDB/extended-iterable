import { setTimeout as delay } from 'node:timers/promises';

/**
 * Creates a generator function that produces the numbers 1, 2, 3.
 *
 * @returns The generator function.
 */
export function* simpleGenerator() {
	yield 1;
	yield 2;
	yield 3;
}

/**
 * Creates an async generator function that produces the numbers 1, 2, 3.
 *
 * @returns The async generator function.
 */
export async function* simpleAsyncGenerator() {
	await delay(5);
	yield 1;
	await delay(5);
	yield 2;
	await delay(5);
	yield 3;
}

/**
 * Creates an empty async generator function.
 *
 * @returns The empty async generator function.
 */
export async function* emptyAsyncGenerator() {
	await delay(5);
}

/**
 * Creates an iterable object that produces the numbers 0, 1, 2, 3.
 *
 * @returns The iterable object.
 */
export function createIterableObject(): Iterator<number> & { index: number } {
	return {
		index: 0,
		next() {
			if (this.index > 3) {
				return {
					done: true,
					value: undefined
				};
			}

			return {
				value: this.index++,
				done: false
			};
		}
	};
}

/**
 * Creates an empty iterable object.
 *
 * @returns The empty iterable object.
 */
export function createEmptyIterableObject(): Iterator<number> {
	return {
		next() {
			return { done: true, value: undefined };
		}
	};
}

export function createMixedAsyncIterableObject(): (Iterator<number> | AsyncIterator<number>) & { index: number } {
	return {
		index: 0,
		next(): IteratorResult<number> | Promise<IteratorResult<number>> | any {
			if (this.index > 5) {
				return Promise.resolve({
					done: true,
					value: undefined
				});
			}

			if (this.index % 2 === 0) {
				return {
					value: this.index++,
					done: false
				};
			}

			return Promise.resolve({
				value: this.index++,
				done: false
			});
		}
	};
}