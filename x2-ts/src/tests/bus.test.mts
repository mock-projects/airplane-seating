import {Bus} from '../models/bus.mts'
import {Location, LocationType} from '../models/location.mts'
import {BusRoute} from '../models/route.mts'

class TestBus {
	stop1: Location
	stop2: Location
	stop3: Location
	route: BusRoute
	bus: Bus

	constructor( ) {
		// Create test stops
		this.stop1 = new Location('Stop 1', LocationType.BUS_STOP, 0, 0, 50)
		this.stop2 = new Location('Stop 2', LocationType.BUS_STOP, 3, 4, 50)
		this.stop3 = new Location('Stop 3', LocationType.BUS_STOP, 6, 8, 50)

		// Create test route
		this.route = new BusRoute('Test Route', [
			this.stop1,
			this.stop2,
			this.stop3,
		])

		// Create test bus
		this.bus = new Bus('Test Bus', this.route, 0)
	}

	assertEqual<T = unknown>(item01: T, item02: T) {
		if (item01 !== item02)
			throw new Error(`${item01} and ${item02} aren't equal.`)
	}

	testBusMovement( ) {
		/** Test bus moving forward and changing directions */
		// Test initial position
		this.assertEqual(this.bus.currentStop( ), this.stop1)
		this.assertEqual(this.bus.nextStop( ), this.stop2)

		// Test moving forward
		this.bus.arriveAtNextStop( )
		this.assertEqual(this.bus.currentStop( ), this.stop2)
		this.assertEqual(this.bus.nextStop( ), this.stop3)

		// Test direction change at end
		this.bus.arriveAtNextStop( ) // Now at stop3
		this.assertEqual(this.bus.direction, -1) // Should change direction
		this.assertEqual(this.bus.nextStop( ), this.stop2)
	}
}

export {TestBus}
