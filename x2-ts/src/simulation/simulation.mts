import type {LocationIndex} from '../locations/geoIndex.mts'
import {
	BusOccupancyMetric,
	RouteUtilizationMetric,
} from '../metrics/metrics.mts'
import type {SimulationMetric} from '../metrics/metrics.mts'
import {Person} from '../models/person.mts'
import type {BusNetwork} from '../network/network.mts'
import type {Action} from './actions.mts'
import {PersonStartJourneyAction, StartBusRouteAction} from './actions.mts'
import {SimulationState} from './state.mts'
import {stringToTime} from './time.mts'
import type {Time} from './time.mts'

class Simulation {
	// Mapping from times to actions that need to happen at a particular time
	schedule: Record<number, Action[ ]>

	// Current state of simulated city
	state: SimulationState

	// Metrics we want to track about the simulation
	metrics: SimulationMetric[ ]

	/**
	 * Initialize a new simulation with a given number of people.
	 */
	constructor(
		locationIndex: LocationIndex,
		busNetwork: BusNetwork,
		personCount: number = 2000,
	) {
		// Initialize simulation state
		this.schedule = { }
		this.state = new SimulationState(locationIndex, busNetwork)

		// Add people to simulation
		for (let i = 0; i < personCount; i++) {
			const person = new Person(`Person ${i}`)
			this.state.addPerson(person)
		}

		// Add metrics to keep track of
		this.metrics = [new BusOccupancyMetric( ), new RouteUtilizationMetric( )]
	}

	/**
	 * Schedule an action to occur at a particular time.
	 */
	scheduleAction(time: number, action: Action) {
		this.schedule[time] ??= [ ]
		this.schedule[time].push(action)
	}

	simulateDay(startTime: Time = '04:00', endTime: Time = '23:00') {
		const startMinutes = stringToTime(startTime)
		const endMinutes = stringToTime(endTime)
		this.setupSimulation(startMinutes)

		console.log('Starting simulation...')

		for (let time = startMinutes; time < endMinutes + 1; time++) {
			this.simulateTime(time)
			for (const metric of this.metrics) {
				metric.recordMetric(time, this.state)
			}
		}

		console.log('Simulation complete!')
	}

	setupSimulation(startMinutes: number) {
		this.state.setupSimulationState( )

		// Add initial actions for all buses to start their routes
		for (const bus of Object.values(this.state.buses)) {
			const time = startMinutes + bus.startDelay
			const action = new StartBusRouteAction(bus)
			this.scheduleAction(time, action)
		}

		// Add initial actions for all people to start their day
		for (const person of Object.values(this.state.people)) {
			const residence = person.residence
			if (!residence) {
				throw new Error(`${person} does not have a residence`)
			}

			// Pick a random time for the person to start their day, between 10 and 200 (inclusive)
			const time = startMinutes + Math.floor(Math.random( ) * 191) + 10
			const action = new PersonStartJourneyAction(person, residence)
			this.scheduleAction(time, action)
		}

		console.log('Simulation setup complete.')
	}

	simulateTime(time: number) {
		this.state.printTimeReport(time)
		const actions = this.schedule[time] ?? [ ]

		// Perform all actions associated with the time
		for (const action of actions) {
			action.perform(time, this.state, this.scheduleAction.bind(this))
		}
	}

	printResults( ) {
		for (const metric of this.metrics) {
			console.log( )
			console.log('====================')
			console.log(metric.name)
			console.log('--------------------')
			metric.printMetric( )
			console.log('====================')
			console.log( )
		}
	}
}

export {Simulation}
