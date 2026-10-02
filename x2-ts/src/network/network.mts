import {Location} from '../models/location.mts'
import {BusRoute} from '../models/route.mts'

/**
 * An in-memory representation of the city's bus routes.
 */
class BusNetwork {
	// Mapping from stop name to stop
	stops: Record<string, Location>

	// Mapping from route name to route
	routes: Record<string, BusRoute>

	// Mapping from stop name to all possible (route name, nextStop name) pairs
	connections: Record<string, [string, string][]>

	constructor(routes: BusRoute[]) {
		this.stops = {}
		this.routes = {}
		this.connections = {}

		for (const route of routes) {
			for (let i = 0; i < route.stops.length - 1; i++) {
				const stop = route.stops[i]!
				const nextStop = route.stops[i + 1]!

				if (!this.stops.hasOwnProperty(stop.name)) {
					this.stops[stop.name] = stop
				}

				if (!this.stops.hasOwnProperty(nextStop.name)) {
					this.stops[nextStop.name] = nextStop
				}

				if (!this.routes.hasOwnProperty(route.name)) {
					this.routes[route.name] = route
				}

				// Add forward connection
				this.connections[stop.name] ??= []
				this.connections[stop.name]!.push([route.name, nextStop.name])

				// Add reverse connection
				this.connections[nextStop.name] ??= []
				this.connections[nextStop.name]!.push([route.name, stop.name])
			}
		}
	}

	/**
	 * Returns the nearest stop to the given coordinates.
	 */
	getNearestStop(x: number, y: number): Location {
		let nearestStop = null
		let nearestDistance = Infinity
		for (const stop of Object.values(this.stops)) {
			const distance = stop.distanceToPoint(x, y)
			if (distance < nearestDistance) {
				nearestStop = stop
				nearestDistance = distance
			}
		}
		if (nearestStop == null) {
			throw new Error('No stops found in network')
		}
		return nearestStop
	}
}

export {BusNetwork}
