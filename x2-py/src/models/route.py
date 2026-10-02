import math
from dataclasses import dataclass

from models.location import Location, LocationType
from simulation.constants import BUS_PACE


@dataclass
class BusRoute:
	"""
	Represents a bus route.
	"""

	# Name of the route
	name: str

	# Stops on the route
	stops: list[Location]

	def __post_init__(self):
		# Ensure that all locations are bus stops
		for stop in self.stops:
			if stop.location_type != LocationType.BUS_STOP:
				raise ValueError(
					f'Route contains location {stop.name} that is not a bus stop'
				)

	def __str__(self):
		return self.name

	def __repr__(self):
		return self.name

	def average_stop_popularity(self) -> float:
		"""
		Returns the average popularity of the stops on the route.
		"""
		return sum(stop.popularity for stop in self.stops) / len(self.stops)

	def round_trip_distance(self) -> float:
		"""
		Returns the total distance of the route.
		"""
		total_distance = 0
		for i in range(len(self.stops) - 1):
			total_distance += self.stops[i].distance_to_location(self.stops[i + 1])
		return total_distance * 2

	def round_trip_time(self) -> float:
		return self.round_trip_distance() * BUS_PACE

	def get_simulated_bus_count(self, min_count=5, max_count=13) -> int:
		"""
		Returns the number of buses to simulate on the route.

		The number of buses is determined by the average popularity of the stops
		on the route.
		"""
		return math.floor(
			min_count + (max_count - min_count) * (self.average_stop_popularity() / 100)
		)
