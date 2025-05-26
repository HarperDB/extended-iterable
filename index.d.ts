export class ExtendedIterable<T> implements Iterable<T> {
	map<U>(callback: (entry: T) => U): RangeIterable<U>
	flatMap<U>(callback: (entry: T) => U[]): RangeIterable<U>
	slice(start: number, end: number): RangeIterable<T>
	filter(callback: (entry: T) => any): RangeIterable<T>
	[Symbol.iterator]() : Iterator<T>
	forEach(callback: (entry: T) => any): void
	mapError<U>(callback: (error: Error) => U): RangeIterable<U>
	onDone?: Function
	asArray: T[]
}
