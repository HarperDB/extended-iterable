/**
 * The base class for iterators.
 */
export class BaseIterator<T> implements Iterator<T>, AsyncIterator<T> {
	protected iterator: Iterator<T> | AsyncIterator<T>;

	constructor(iterator: Iterator<T> | AsyncIterator<T>) {
		this.iterator = iterator;
	}

	next(): IteratorResult<T> | Promise<IteratorResult<T>> | any {
		return this.iterator.next();
	}

	return(value?: T): IteratorResult<T> | Promise<IteratorResult<T>> | any {
		return this.iterator.return ? this.iterator.return(value) : { done: true, value };
	}

	throw(err: unknown): IteratorResult<T> | Promise<IteratorResult<T>> | any {
		if (this.iterator.throw) {
			return this.iterator.throw(err);
		}
		throw err;
	}
}
