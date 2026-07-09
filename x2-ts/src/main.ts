import * as path from "path"

import {LocationIndex} from "./locations/geoindex"
import {readLocationsFromFile} from "./locations/util"
import {BusNetwork} from "./network/network"
import {readRoutesFromFile} from "./network/util"
import {Simulation} from "./simulation/simulation"

const LOCATIONS_FILENAME = path.join(__dirname, "data", "locations.csv")
const BUS_STOPS_FILENAME = path.join(__dirname, "data", "bus_stops.csv")
const BUS_ROUTES_FILENAME = path.join(__dirname, "data", "bus_routes.csv")

const main = async () => {
  const locations = await readLocationsFromFile(LOCATIONS_FILENAME)
  console.log(`Loaded ${locations.length} locations.`)

  const index = new LocationIndex(locations)
  console.log("Created location index.")

  const busStops = await readLocationsFromFile(BUS_STOPS_FILENAME)
  console.log(`Loaded ${busStops.length} bus stops.`)

  const routes = await readRoutesFromFile(busStops, BUS_ROUTES_FILENAME)
  console.log(`Loaded ${routes.length} bus routes.`)

  const network = new BusNetwork(routes)
  console.log("Created bus route network.")

  const simulation = new Simulation(index, network)
  simulation.simulateDay()
  simulation.printResults()
}

main()
