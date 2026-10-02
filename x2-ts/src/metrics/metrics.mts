import {SimulationState} from '../simulation/state.mts'

class SimulationMetric {
	constructor(public name: string) {}

	recordMetric(time: number, state: SimulationState) {}

	printMetric() {}
}

class BusOccupancyMetric extends SimulationMetric {
	// Map from bus names to max occupancy
	maxOccupancyByBus: Record<string, number>

	constructor() {
		super('Bus Occupancy Metric')
		this.maxOccupancyByBus = {}
	}

	override recordMetric(time: number, state: SimulationState) {
		for (const bus of Object.values(state.buses)) {
			const occupancy = bus.people.length

			// Record max occupancy for bus
			if (!this.maxOccupancyByBus.hasOwnProperty(bus.name)) {
				this.maxOccupancyByBus[bus.name] = occupancy
			} else {
				this.maxOccupancyByBus[bus.name] = Math.max(
					occupancy,
					this.maxOccupancyByBus[bus.name]!,
				)
			}
		}
	}

	override printMetric() {
		// Get most popular bus lines
		const mostPopularBuses = Object.entries(this.maxOccupancyByBus)
			.sort(([bus1, occupancy1], [bus2, occupancy2]) => occupancy2 - occupancy1)
			.slice(0, 5)

		console.log('Most popular buses:')
		for (const [bus, occupancy] of mostPopularBuses) {
			console.log(`  ${bus}: ${occupancy} max occupancy`)
		}
	}
}

/**
 * Tracks how frequently each route is used by passengers.
 */
class RouteUtilizationMetric extends SimulationMetric {
	// Map from route name to set of passenger names
	routeUsage: Record<string, Set<string>>

	constructor() {
		super('Route Utilization Metric')
		this.routeUsage = {}
	}

	override recordMetric(time: number, state: SimulationState) {
		for (const bus of Object.values(state.buses)) {
			const passengers = new Set(bus.people.map((p) => p.name))

			this.routeUsage[bus.route.name] ??= new Set()
			for (const passenger of passengers) {
				this.routeUsage[bus.route.name]!.add(passenger)
			}
		}
	}

	override printMetric() {
		const topRoutes = Object.entries(this.routeUsage)
			.sort(
				([route1, passengers1], [route2, passengers2]) =>
					passengers2.size - passengers1.size,
			)
			.slice(0, 10)

		console.log('Top routes by total unique passengers:')
		for (const [route, passengers] of topRoutes) {
			console.log(`  ${route}: ${passengers.size} passengers`)
		}
	}
}

export {SimulationMetric, BusOccupancyMetric, RouteUtilizationMetric}
