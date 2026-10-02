import math
import random
from dataclasses import dataclass
from typing import Callable

from locations.util import pick_random_destination_type
from models.bus import Bus
from models.location import Location, LocationType
from models.person import Person
from simulation.constants import BUS_PACE, WALKING_PACE
from simulation.journey import plan_journey
from simulation.state import SimulationState


@dataclass
class Action:
	"""
	Base class representing an action to be performed in a simulation.
	"""

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		"""
		Perform the action at the given time.

		Arguments:

		- `time`: The time at which the action is being performed.
		- `state`: The current state of the simulation.
		- `schedule`: A function that can be used to schedule new actions, given a time
		   and a next action.
		"""
		pass


@dataclass
class StartBusRouteAction(Action):
	"""
	Represents a bus starting its route.
	"""

	bus: Bus

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		"""
		Moves the bus to its starting stop and schedules a pickup event.
		"""
		# Update state to put bus at the start stop
		start_stop = self.bus.current_stop()
		state.set_bus_location(self.bus, start_stop)

		# Schedule a pickup event
		next_action = BusPickupDropoffAction(bus=self.bus)
		schedule(time + 1, next_action)


@dataclass
class BusPickupDropoffAction(Action):
	"""
	Represents a bus picking up passengers and dropping off passengers.
	"""

	bus: Bus

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		"""
		Simulate the bus picking up and dropping off passengers at a given stop.
		"""
		bus = self.bus
		stop = bus.current_stop()
		next_stop = bus.next_stop()

		people_at_stop = list(stop.people)
		people_on_bus = list(bus.people)

		# Check if any passengers need to get on the bus
		for person in people_at_stop:
			# If the person's next stop is the bus's next stop, get person on bus
			if person.next_destination() == next_stop:
				state.move_person(person, previous_location=stop, new_location=bus)

		# Check if any passengers need to get off the bus
		for person in people_on_bus:
			# Validate that the person is meant to go through this stop
			if person.next_destination() != stop:
				raise Exception(f'{person} arrived at {stop} unexpectedly')
			person.arrive_at_next_destination()

			# If the person's next stop isn't the bus's next stop, get person off bus
			if person.next_destination() != next_stop:
				state.move_person(person, previous_location=bus, new_location=stop)

				# If passenger is done riding the bus, have them
				# walk to final destination
				if person.next_destination().location_type != LocationType.BUS_STOP:
					walking_time = math.ceil(
						stop.distance_to_location(person.next_destination()) * BUS_PACE
					)

					state.remove_person_location(person, stop)
					next_action = PersonMovementAction(
						person=person, location=person.next_destination()
					)
					schedule(time + 1 + walking_time, next_action)

		# Remove bus from its current stop
		state.remove_bus_location(bus, stop)

		# Schedule bus movement to next stop
		duration = math.ceil(stop.distance_to_location(next_stop) * BUS_PACE)
		next_action = BusMovementAction(bus=bus)
		schedule(time + 1 + duration, next_action)


@dataclass
class BusMovementAction(Action):
	"""
	Represents bus arriving at its next stop.
	"""

	bus: Bus

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		"""
		Simulate the bus arriving at its next stop and schedule a pickup event.
		"""
		bus = self.bus
		bus.arrive_at_next_stop()

		# Update state to put bus at this new stop
		state.set_bus_location(bus, bus.current_stop())

		# Schedule a pickup event
		next_action = BusPickupDropoffAction(bus=bus)
		schedule(time + 1, next_action)


@dataclass
class PersonStartJourneyAction(Action):
	"""
	Represents a person starting their day.
	"""

	person: Person
	start_location: Location

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		"""
		Simulate a person choosing a new destination and starting their journey
		towards that destination.
		"""
		person = self.person

		# Pick a new destination for the person
		location_type = pick_random_destination_type()
		destination = state.location_index.find_random(location_type)

		# Plan the person's journey to the destination
		person.current_journey = plan_journey(
			state.bus_network,
			(self.start_location.x, self.start_location.y),
			(destination.x, destination.y),
		)
		person.current_journey.append(destination)

		# Remove the person from their current location
		state.remove_person_location(person, self.start_location)

		# Schedule the person walking to their next location
		next_location = person.next_destination()
		walking_time = math.ceil(
			self.start_location.distance_to_location(destination) * WALKING_PACE
		)
		next_action = PersonMovementAction(person=person, location=next_location)
		schedule(time + 1 + walking_time, next_action)


@dataclass
class PersonMovementAction(Action):
	"""
	Represents a person arriving at a new location.
	"""

	person: Person
	location: Location | Bus

	def perform(
		self,
		time: int,
		state: SimulationState,
		schedule: Callable[[int, 'Action'], None],
	):
		person = self.person

		# Validate that person is at the correct location
		if person.next_destination() != self.location:
			raise Exception(f'{person} is not at the correct location')
		person.arrive_at_next_destination()

		# Update state to reflect that person is at new location
		state.set_person_location(person, self.location)

		# If person is at their final destination, schedule a new journey
		if person.journey_complete():
			# Validate that person is not on a bus, which would be an invalid final
			# destination
			if isinstance(self.location, Bus):
				raise Exception(f'{person} ended a journey on a bus')

			action = PersonStartJourneyAction(person, self.location)
			delay = int(random.uniform(60, 120))
			schedule(time + delay, action)
