import {LocationIndex} from "../locations/geoIndex.mts"
import {Bus} from "../models/bus.mts"
import {Location, LocationType} from "../models/location.mts"
import {Person} from "../models/person.mts"
import {BusNetwork} from "../network/network.mts"
import {timeToString} from "./time.mts"

/**
 * Represents the current state of all people and buses in a simulation.
 */
class SimulationState {
  constructor (
    // Index of all non-bus-stop locations in the simulation
    public locationIndex: LocationIndex,

    // Network of bus routes in the simulation
    public busNetwork: BusNetwork,

    // Mapping from bus names to buses
    public buses: Record<string, Bus> = {},

    // Mapping from person name to person
    public people: Record<string, Person> = {},
  ) {}

  /**
   * Set up the simulation state.
   */
  setupSimulationState() {
    // Instantiate all buses
    for (const route of Object.values(this.busNetwork.routes)) {

      // Determine how frequently buses on this route should depart
      const roundTripTime = route.roundTripTime()
      const busCount = route.getSimulatedBusCount()
      const busInterval = roundTripTime / busCount

      // Schedule the buses to start their routes
      for (let i = 0; i < busCount; i++) {
        const bus = new Bus(
          `${route.name} Bus ${i + 1}`, // bus name
          route, // bus route
          Math.floor(i * busInterval), // start-delay
        )
        this.buses[bus.name] = bus
      }
    }

    // Give each person a random residence, and set that as their initial location
    for (const person of Object.values(this.people)) {
      person.residence = this.locationIndex.findRandom(LocationType.RESIDENCE)
      this.setPersonLocation(person, person.residence)
    }
  }

  /**
   * Verifies that a given location exists in the current state.
   * If it does not, then the system throws an error.
   */
  verifyLocation(location: Location | Bus) {
    if (location instanceof Bus) {
      if (!this.buses.hasOwnProperty(location.name)) {
        throw new Error(`Location ${location} doesn't exist in busses list!`)
      }
    }

    else if (location.locationType === LocationType.BUS_STOP) {
      if (!this.busNetwork.stops.hasOwnProperty(location.name)) {
        throw new Error(`Location ${location} doesn't exist in bus-stops list!`)
      }
    }

    else {
      if (!this.locationIndex.locations.hasOwnProperty(location.name)) {
        throw new Error(`Location ${location} doesn't exist in locations list!`)
      }
    }
  }

  /**
   * Add a new person to the state.
   */
  addPerson(person: Person) {
    this.people[person.name] = person
  }

  /**
   * Add a new bus location to the state.
   */
  setBusLocation(bus: Bus, stop: Location) {
    this.verifyLocation(stop)
    stop.buses.push(bus)
  }

  /**
   * Remove a bus from a location in the state.
   */
  removeBusLocation(bus: Bus, stop: Location) {
    this.verifyLocation(stop)
    const index = stop.buses.indexOf(bus)
    if (index !== -1) stop.buses.splice(index, 1)
  }

  /**
   * Add a new person location to the state.
   */
  setPersonLocation(person: Person, location: Location | Bus) {
    this.verifyLocation(location)
    location.people.push(person)
  }

  /**
   * Remove a person from a location in the state.
   */
  removePersonLocation(person: Person, location: Location | Bus) {
    this.verifyLocation(location)
    const index = location.people.indexOf(person)
    if (index !== -1) location.people.splice(index, 1)
  }

  /**
   * Move a person from one location to another.
   */
  movePerson(
    person: Person,
    previousLocation: Location | Bus,
    newLocation: Location | Bus,
  ) {
    this.removePersonLocation(person, previousLocation)
    this.setPersonLocation(person, newLocation)
  }

  /**
   * Print a report of the current state of the simulation.
   */
  printTimeReport(time: number) {
    const peopleAtBusStops = Object.values(this.busNetwork.stops)
    .reduce((sum, stop) => sum + stop.people.length, 0)

    const peopleOnBuses = Object.values(this.buses)
    .reduce((sum, bus) => sum + bus.people.length, 0)

    console.log(
      `Time: ${timeToString(time)} | `,
      `${peopleOnBuses.toString().padStart(4)} people on buses | `,
      `${peopleAtBusStops.toString().padStart(4)} people at bus stops`
    )
  }
}

export {SimulationState}
