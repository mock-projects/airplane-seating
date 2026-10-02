import {BusNetwork} from '../network/network.mts'
import {BusRoute} from '../models/route.mts'
import {Location, LocationType} from '../models/location.mts'
import {planJourney} from '../simulation/journey.mts'

class TestJourney {
	stop1: Location
	stop2: Location
	stop3: Location
	route: BusRoute
	network: BusNetwork

	constructor() {
		// Create test stops
		this.stop1 = new Location('Stop 1', LocationType.BUS_STOP, 0, 0, 50)
		this.stop2 = new Location('Stop 2', LocationType.BUS_STOP, 5, 5, 50)
		this.stop3 = new Location('Stop 3', LocationType.BUS_STOP, 10, 10, 50)

		// Create test route
		this.route = new BusRoute('Test Route', [
			this.stop1,
			this.stop2,
			this.stop3,
		])
		this.network = new BusNetwork([this.route])
	}

	assertEqual<T = unknown>(item01: T, item02: T) {
		if (item01 !== item02)
			throw new Error(`${item01} and ${item02} aren't equal.`)
	}

	testSimpleJourney() {
		/** Test journey planning between two points */
		const journey = planJourney(this.network, [1, 1], [11, 11])

		// Should return path through all stops
		this.assertEqual(journey.length, 3)
		this.assertEqual(journey[0], this.stop1)
		this.assertEqual(journey[1], this.stop2)
		this.assertEqual(journey[2], this.stop3)
	}

	testSameLocationJourney() {
		/** Test journey when start and end are near same stop */
		const journey = planJourney(this.network, [0, 0], [0.1, 0.1])

		// Should return empty journey
		this.assertEqual(journey.length, 0)
	}
}

export {TestJourney}
