import math
import random

from locations.index import LocationIndex
from locations.util import pick_random_destination_type
from metrics.metrics import (
	BusOccupancyMetric,
	RouteUtilizationMetric,
	SimulationMetric,
)
from models.bus import Bus
from models.location import Location, LocationType
from models.person import Person
from network.network import BusNetwork
from simulation.actions import (
	Action,
	BusMovementAction,
	BusPickupDropoffAction,
	PersonMovementAction,
	PersonStartJourneyAction,
	StartBusRouteAction,
)
from simulation.constants import BUS_PACE, WALKING_PACE
from simulation.journey import plan_journey
from simulation.state import SimulationState
from simulation.time import string_to_time, time_to_string

class Simulation:
	# Mapping from times to actions that need to happen at a particular time
	schedule: dict[int, list[Action]]

	# Current state of simulated city
	state: SimulationState

	# Metrics we want to track about the simulation
	metrics: list[SimulationMetric]

	def __init__(
		self,
		location_index: LocationIndex,
		bus_network: BusNetwork,
		person_count: int = 2000,
	):
		'''Initialize a new simulation with a given number of people.'''
		# Initialize simulation state
		self.schedule = dict()
		self.state = SimulationState(
			location_index=location_index,
			bus_network=bus_network,
		)

		# Add people to simulation
		for i in range(person_count):
			person = Person(f'Person {i}')
			self.state.add_person(person)

		# Add metrics to keep track of
		self.metrics = [
			BusOccupancyMetric(),
			RouteUtilizationMetric(),
		]

	def schedule_action(self, time: int, action: Action):
		'''Schedule an action to occur at a particular time.'''
		self.schedule.setdefault(time, []).append(action)

	def simulate_day(self, start_time: str = '04:00', end_time: str = '23:00'):
		start_minutes = string_to_time(start_time)
		end_minutes = string_to_time(end_time)
		self.setup_simulation(start_minutes)

		print('Starting simulation...')
		for time in range(start_minutes, end_minutes + 1):
			self.simulate_time(time)
			for metric in self.metrics:
				metric.record_metric(time, self.state)
		print('Simulation complete!')

	def setup_simulation(self, start_minutes: int):
		self.state.setup_simulation_state()

		# Add initial actions for all buses to start their routes
		for bus in self.state.buses.values():
			time = start_minutes + bus.start_delay
			action = StartBusRouteAction(bus=bus)
			self.schedule_action(time, action)

		# Add initial actions for all people to start their day
		for person in self.state.people.values():
			residence = person.residence
			if not residence:
				raise Exception(f'{person} does not have a residence')

			# Pick a random time for the person to start their day
			time = start_minutes + int(random.uniform(10, 200))
			action = PersonStartJourneyAction(person=person, start_location=residence)
			self.schedule_action(time, action)

		print('Simulation setup complete.')

	def simulate_time(self, time: int):
		self.state.print_time_report(time)
		actions = self.schedule.get(time, [])

		# Perform all actions associated with the time
		for action in actions:
			action.perform(time, self.state, self.schedule_action)

	def print_results(self):
		for metric in self.metrics:
			print()
			print('====================')
			print(metric.name)
			print('--------------------')
			metric.print_metric()
			print('====================')
			print()
