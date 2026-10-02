import type {Location} from './location.mts'
import type {Person} from './person.mts'
import type {BusRoute} from './route.mts'
import {BUS_PACE} from '../simulation/constants.mts'

class Bus {
	constructor(
		public name: string,
		public route: BusRoute,

		// How long after the start of the day the bus should start moving.
		// This is used to simulate buses that start their routes at different times.
		public startDelay: number,

		// Most recent station index.
		public stopIndex: number = 0,

		// Direction of the bus is 1 for the bus traveling from start location to end
		// location. Direction of the bus is -1 for the bus traveling from end location
		// to start location.
		public direction: number = 1,

		// People currently on the bus
		public people: Person[] = [],
	) {}

	toString() {
		return this.name
	}

	arriveAtNextStop() {
		this.stopIndex += this.direction

		// Change direction if we've reached the end of the line.
		if (
			this.stopIndex === 0 ||
			this.stopIndex === this.route.stops.length - 1
		) {
			this.direction *= -1
		}
	}

	currentStop(): Location {
		const location = this.route.stops[this.stopIndex]
		if (location == null) {
			throw new Error(
				'Route contains invalid locations or route index is out of range',
			)
		}
		return location
	}

	nextStop(): Location {
		const location = this.route.stops[this.stopIndex + this.direction]
		if (location == null) {
			throw new Error(
				'Route contains invalid locations or route index is out of range',
			)
		}
		return location
	}

	timeToNextStop(): number {
		return this.currentStop().distanceToLocation(this.nextStop()) * BUS_PACE
	}
}

export {Bus}
