import {BUS_PACE} from '../simulation/constants.mts'
import type {Location} from './location.mts'
import {LocationType} from './location.mts'

/**
 * Represents a bus route.
 */
class BusRoute {
	constructor(
		// Name of the route
		public name: string,

		// Stops on the route
		public stops: Location[ ],
	) {
		// Ensure that all locations are bus stops
		for (const stop of this.stops) {
			if (stop.locationType !== LocationType.BUS_STOP) {
				throw new Error(
					`Route contains location ${stop.name} that is not a bus stop`,
				)
			}
		}
	}

	toString( ) {
		return this.name
	}

	/**
	 * Returns the average popularity of the stops on the route.
	 */
	averageStopPopularity( ): number {
		const sum = this.stops.reduce((sum, stop) => (sum + stop.popularity), 0)
		return sum / this.stops.length
	}

	/**
	 * Returns the total distance of the route.
	 */
	roundTripDistance( ): number {
		let totalDistance = 0
		for (let i = 0; i < this.stops.length - 1; i++) {
			const stop = this.stops[i]!
			const nextStop = this.stops[i + 1]!
			totalDistance += stop.distanceToLocation(nextStop)
		}
		return totalDistance * 2
	}

	roundTripTime( ): number {
		return this.roundTripDistance( ) * BUS_PACE
	}

	/**
	 * Returns the number of buses to simulate on the route.
	 *
	 * The number of buses is determined by the average popularity of the stops
	 * on the route.
	 */
	getSimulatedBusCount(minCount = 5, maxCount = 13): number {
		return Math.floor(
			minCount + (maxCount - minCount) * (this.averageStopPopularity( ) / 100),
		)
	}
}

export {BusRoute}
