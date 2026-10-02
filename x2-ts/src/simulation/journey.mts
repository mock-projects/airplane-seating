import {Location} from '../models/location.mts'
import {BusNetwork} from '../network/network.mts'

/**
 * Plans a person's journey between a start and end location.
 *
 * Returns a list of stations the person will pass through.
 */
const planJourney = (
	network: BusNetwork,
	start: [number, number],
	end: [number, number],
): Location[] => {
	const startStop = network.getNearestStop(...start)
	const endStop = network.getNearestStop(...end)

	// If the start and end stops are the same, we're done
	if (startStop === endStop) return []

	// Find the most efficient bus route between the start and end stops
	let distances: Record<string, number> = {}
	for (const stop of Object.values(network.stops)) {
		distances[stop.name] = Infinity
	}

	let previous: Record<string, Location | null> = {}
	for (const stop of Object.values(network.stops)) {
		previous[stop.name] = null
	}

	distances[startStop.name] = 0

	// Keep track of all stops we haven't visited yet
	const unvisited = new Set(Object.keys(network.stops))

	while (unvisited.size > 0) {
		// Choose stop based on shortest distance
		const currentStopName = [...unvisited.values()].reduce((bestStop, stop) => {
			const bestStopDistance = distances[bestStop] ?? Infinity
			const stopDistance = distances[stop] ?? Infinity
			if (stopDistance < bestStopDistance) return stop
			else return bestStop
		})

		unvisited.delete(currentStopName)

		const currentStop = network.stops[currentStopName]
		if (currentStop == null) {
			throw new Error('Internal error with journey')
		}
		if (currentStop === endStop) {
			break
		}

		const currentConnection = network.connections[currentStop.name]
		if (currentConnection == null) {
			throw new Error('Internal error with journey')
		}

		// Update knowledge about distances to all potential next stops
		for (const [routeName, nextStopName] of currentConnection) {
			const nextStop = network.stops[nextStopName]
			if (nextStop == null) {
				throw new Error('Internal error with journey')
			}

			const distanceToStop = distances[currentStop.name]
			const distanceToNextStop = distances[nextStop.name]
			if (distanceToStop == null || distanceToNextStop == null) {
				throw new Error('Internal error with journey')
			}

			const newDistance =
				distanceToStop + currentStop.distanceToLocation(nextStop)
			if (newDistance < distanceToNextStop) {
				distances[nextStop.name] = newDistance
				previous[nextStop.name] = currentStop
			}
		}
	}

	// Reconstruct the path from the end stop to the start stop
	const journey: Location[] = []
	let current: Location | null = endStop
	while (current != null) {
		journey.unshift(current)
		current = previous[current.name] ?? null
	}

	return journey
}

export {planJourney}
