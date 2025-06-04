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
 * Creates an iterable object that produces the numbers 0, 1, 2, 3.
 *
 * @returns The iterable object.
 */
export function createIterable(): Iterator<number> & { index: number } {
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
