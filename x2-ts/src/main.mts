import {LocationIndex} from './locations/geoIndex.mts'
import {readLocationsFromFile} from './locations/util.mts'
import {BusNetwork} from './network/network.mts'
import {readRoutesFromFile} from './network/util.mts'
import {Simulation} from './simulation/simulation.mts'

const LOCATIONS_FILENAME = 'src/data/locations.csv'
const BUS_STOPS_FILENAME = 'src/data/bus-stops.csv'
const BUS_ROUTES_FILENAME = 'src/data/bus-routes.csv'

const main = async () => {
	const locations = await readLocationsFromFile(LOCATIONS_FILENAME)
	console.log(`Loaded ${locations.length} locations.`)

	const index = new LocationIndex(locations)
	console.log('Created location index.')

	const busStops = await readLocationsFromFile(BUS_STOPS_FILENAME)
	console.log(`Loaded ${busStops.length} bus stops.`)

	const routes = await readRoutesFromFile(busStops, BUS_ROUTES_FILENAME)
	console.log(`Loaded ${routes.length} bus routes.`)

	const network = new BusNetwork(routes)
	console.log('Created bus route network.')

	const simulation = new Simulation(index, network)
	simulation.simulateDay()
	simulation.printResults()
}

main()
