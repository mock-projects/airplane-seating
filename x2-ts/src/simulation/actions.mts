import {pickRandomDestinationType} from '../locations/util.mts'
import {Bus} from '../models/bus.mts'
import {Location, LocationType} from '../models/location.mts'
import {Person} from '../models/person.mts'
import {BUS_PACE, WALKING_PACE} from './constants.mts'
import {planJourney} from './journey.mts'
import {SimulationState} from './state.mts'

type Schedule = (time: number, action: Action) => void

/**
 * Base class representing an action to be performed in a simulation.
 */
abstract class Action {
	/**
	 * Perform the action at the given time.
	 *
	 * Arguments:
	 * - `time`: The time at which the action is being performed.
	 * - `state`: The current state of the simulation.
	 * - `schedule`: A function that can be used to schedule new actions, given a time
	 *    and a next action.
	 */
	abstract perform(
		time: number,
		state: SimulationState,
		schedule: Schedule,
	): void
}

/**
 * Represents a bus starting its route.
 */
class StartBusRouteAction extends Action {
	constructor(public bus: Bus) {
		super()
	}

	/**
	 * Moves the bus to its starting stop and schedules a pickup event.
	 */
	perform(time: number, state: SimulationState, schedule: Schedule) {
		// Update state to put bus at the start stop
		const startStop = this.bus.currentStop()
		state.setBusLocation(this.bus, startStop)

		// Schedule a pickup event
		const nextAction = new BusPickupDropoffAction(this.bus)
		schedule(time + 1, nextAction)
	}
}

/**
 * Represents a bus picking up passengers and dropping off passengers.
 */
class BusPickupDropoffAction extends Action {
	constructor(public bus: Bus) {
		super()
	}

	/**
	 * Simulate the bus picking up and dropping off passengers at a given stop.
	 */
	perform(time: number, state: SimulationState, schedule: Schedule) {
		const bus = this.bus
		const stop = bus.currentStop()
		const nextStop = bus.nextStop()

		const peopleAtStop = [...stop.people]
		const peopleOnBus = [...bus.people]

		// Check if any passengers need to get on the bus
		for (const person of peopleAtStop) {
			// If the person's next stop is the bus's next stop, get person on bus
			if (person.nextDestination() === nextStop) {
				state.movePerson(person, stop, bus)
			}
		}

		// Check if any passengers need to get off the bus
		for (const person of peopleOnBus) {
			// Validate that the person is meant to go through this stop
			if (person.nextDestination() !== stop) {
				throw new Error(`${person} arrived at ${stop} unexpectedly`)
			}
			person.arriveAtNextDestination()

			// If the person's next stop isn't the bus's next stop, get person off bus
			if (person.nextDestination() !== nextStop) {
				state.movePerson(person, bus, stop)

				// If passenger is done riding the bus, have them
				// walk to final destination
				if (person.nextDestination().locationType !== LocationType.BUS_STOP) {
					const walkingTime = Math.ceil(
						stop.distanceToLocation(person.nextDestination()) * BUS_PACE,
					)

					state.removePersonLocation(person, stop)
					const nextAction = new PersonMovementAction(
						person,
						person.nextDestination(),
					)
					schedule(time + 1 + walkingTime, nextAction)
				}
			}
		}

		// Remove bus from its current stop
		state.removeBusLocation(bus, stop)

		// Schedule bus movement to next stop
		const duration = Math.ceil(stop.distanceToLocation(nextStop) * BUS_PACE)
		const nextAction = new BusMovementAction(bus)
		schedule(time + 1 + duration, nextAction)
	}
}

/**
 * Represents bus arriving at its next stop.
 */
class BusMovementAction extends Action {
	constructor(public bus: Bus) {
		super()
	}

	/**
	 * Simulate the bus arriving at its next stop and schedule a pickup event.
	 */
	perform(time: number, state: SimulationState, schedule: Schedule) {
		const bus = this.bus
		bus.arriveAtNextStop()

		// Update state to put bus at this new stop
		state.setBusLocation(bus, bus.currentStop())

		// Schedule a pickup event
		const nextAction = new BusPickupDropoffAction(bus)
		schedule(time + 1, nextAction)
	}
}

/**
 * Represents a person starting their day.
 */
class PersonStartJourneyAction extends Action {
	constructor(
		public person: Person,
		public startLocation: Location,
	) {
		super()
	}

	/**
	 * Simulate a person choosing a new destination and starting their journey
	 * towards that destination.
	 */
	perform(time: number, state: SimulationState, schedule: Schedule) {
		const person = this.person

		// Pick a new destination for the person
		const locationType = pickRandomDestinationType()
		const destination = state.locationIndex.findRandom(locationType)

		// Plan the person's journey to the destination
		person.currentJourney = planJourney(
			state.busNetwork,
			[this.startLocation.x, this.startLocation.y],
			[destination.x, destination.y],
		)
		person.currentJourney.push(destination)

		// Remove the person from their current location
		state.removePersonLocation(person, this.startLocation)

		// Schedule the person walking to their next location
		const next_location = person.nextDestination()
		const walkingTime = Math.ceil(
			this.startLocation.distanceToLocation(destination) * WALKING_PACE,
		)
		const nextAction = new PersonMovementAction(person, next_location)
		schedule(time + 1 + walkingTime, nextAction)
	}
}

/**
 * Represents a person arriving at a new location.
 */
class PersonMovementAction extends Action {
	constructor(
		public person: Person,
		public location: Location | Bus,
	) {
		super()
	}

	perform(time: number, state: SimulationState, schedule: Schedule) {
		const person = this.person

		// Validate that person is at the correct location
		if (person.nextDestination() !== this.location) {
			throw new Error(`${person} is not at the correct location`)
		}
		person.arriveAtNextDestination()

		// Update state to reflect that person is at new location
		state.setPersonLocation(person, this.location)

		// If person is at their final destination, schedule a new journey
		if (person.journeyComplete()) {
			// Validate that person is not on a bus, which would be an invalid final destination
			if (this.location instanceof Bus) {
				throw new Error(`${person} ended a journey on a bus`)
			}

			const action = new PersonStartJourneyAction(person, this.location)
			// Generate a random number between 60 and 120, inclusive
			const delay = Math.floor(Math.random() * 61) + 60
			schedule(time + delay, action)
		}
	}
}

export {
	Action,
	StartBusRouteAction,
	BusPickupDropoffAction,
	BusMovementAction,
	PersonStartJourneyAction,
	PersonMovementAction,
}
