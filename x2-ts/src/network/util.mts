import * as readline from 'readline'
import * as fs from 'fs'
import {Location} from '../models/location.mts'
import {BusRoute} from '../models/route.mts'

/**
 * Parse a CSV file of bus routes and return a list of `BusRoute` objects.
 */
const readRoutesFromFile = async (
	stops: Location[],
	filename: string,
): Promise<BusRoute[]> => {
	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})
	const routes: BusRoute[] = []

	// Convert stops to a map from name to location
	const stopMap: Record<string, Location> = {}
	for (const stop of stops) {
		stopMap[stop.name] = stop
	}

	let isHeaderRow = true
	for await (const line of reader) {
		// Skip the header row, it has no data.
		if (isHeaderRow) {
			isHeaderRow = false
			continue
		}

		const data = line.split(',')

		// Skip invalid items
		if (data[0] == null || data[1] == null) continue

		const name = data[0]
		const stops = data[1]
			.split(' -> ')
			.map((stopName) => stopMap[stopName])
			.filter((stop) => stop != null)

		const route = new BusRoute(name, stops)
		routes.push(route)
	}
	return routes
}

export {readRoutesFromFile}
