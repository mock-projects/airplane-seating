import type {Person} from './person.mts'
import type {Bus} from './bus.mts'

enum LocationType {
	RESIDENCE = 'RESIDENCE',
	COMMERCIAL = 'COMMERCIAL',
	EDUCATION = 'EDUCATION',
	CIVIC = 'CIVIC',
	HEALTHCARE = 'HEALTHCARE',
	RECREATION = 'RECREATION',
	OTHER = 'OTHER',
	BUS_STOP = 'BUS_STOP',
}

/**
 * A location of interest.
 */
class Location {
	constructor(
		// Name and type of the location
		public name: string,
		public locationType: LocationType,

		// Coordinates of the location
		public x: number,
		public y: number,

		// Representation of how frequently we expect people to visit the location.
		// In the case of a bus stop, represents how frequently the bus runs.
		public popularity: number,

		// People currently at the location
		public people: Person[] = [],

		// Buses currently at the location
		public buses: Bus[] = [],
	) {}

	toString() {
		return this.name
	}

	distanceToPoint(x: number, y: number): number {
		return ((this.x - x) ** 2 + (this.y - y) ** 2) ** 0.5
	}

	distanceToLocation(location: Location): number {
		return this.distanceToPoint(location.x, location.y)
	}
}

export {Location, LocationType}
