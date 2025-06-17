import { BaseIterator } from './base-iterator.js';

export class TakeIterator<T> extends BaseIterator<T> {
	#count = 0;
	#limit!: number;

	constructor(
		limit: number,
		iterator: Iterator<T> | AsyncIterator<T>
	) {
		super(iterator);

		try {
			if (typeof limit !== 'number') {
				throw new TypeError('Limit is not a number');
			}
			if (limit < 0) {
				throw new RangeError('Limit must be a positive number');
			}
			this.#limit = limit;
		} catch (err) {
			super.throw(err);
		}
	}

	next(): IteratorResult<T> | Promise<IteratorResult<T>> | any {
		if (this.#count >= this.#limit) {
			this.iterator.return?.();
			return { done: true, value: undefined };
		}

		let result: IteratorResult<T> | Promise<IteratorResult<T>>;

		try {
			result = super.next();
		} catch (err) {
			return super.throw(err);
		}

		// async handling
		if (result instanceof Promise) {
			return this.#asyncNext(result)
				.catch(err => super.throw(err));
		}

		// sync handling
		if (result.done) {
			return super.return(result.value);
		}

		this.#count++;

		return {
			done: false,
			value: result.value
		};
	}

	async #asyncNext(result: Promise<IteratorResult<T>>): Promise<IteratorResult<T>> {
		const currentResult = await result;

		if (currentResult.done) {
			return super.return(currentResult.value);
		}

		this.#count++;

		return {
			done: false,
			value: currentResult.value
		};
	}
};
