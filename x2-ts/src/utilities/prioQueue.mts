import TinyQueue from 'tinyqueue'

type QueueEntry<T> = [priority: number, tieBreaker: number, item: T]

class PriorityQueue<T = unknown> {
	#queue: TinyQueue<QueueEntry<T>>

	constructor( ) {
		this.#queue = new TinyQueue<QueueEntry<T>>([ ], (a, b) => (a[0] - b[0]))
	}

	get data( ): Readonly<QueueEntry<T>[ ]> {
		return [...this.#queue.data]
	}

	/**
	 * Push an item onto the queue with a given priority.
	 * Break ties randomly if the priorities are the same.
	 */
	push(priority: number, item: T) {
		const tieBreaker = Math.random( )
		this.#queue.push([priority, tieBreaker, item])
	}

	pop( ) {
		const item = this.#queue.pop( )
		return item?.[2]
	}

	peek( ) {
		const item = this.#queue.peek( )
		return item?.[2]
	}

	isEmpty( ) {
		return this.#queue.length === 0
	}
}

export {PriorityQueue}
