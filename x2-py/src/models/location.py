from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING, ForwardRef

if TYPE_CHECKING:
	from models.bus import Bus
	from models.person import Person

class LocationType(Enum):
	RESIDENCE = 'RESIDENCE'
	COMMERCIAL = 'COMMERCIAL'
	EDUCATION = 'EDUCATION'
	CIVIC = 'CIVIC'
	HEALTHCARE = 'HEALTHCARE'
	RECREATION = 'RECREATION'
	OTHER = 'OTHER'
	BUS_STOP = 'BUS_STOP'

@dataclass
class Location:
	'''A location of interest.'''

	# Name and type of the location
	name: str
	location_type: LocationType

	# Coordinates of the location
	x: float
	y: float

	# Representation of how frequently we expect people to visit the location.
	# In the case of a bus stop, represents how frequently the bus runs.
	popularity: float

	# People currently at the location
	people: list['Person'] = field(default_factory=list)

	# Buses currently at the location
	buses: list['Bus'] = field(default_factory=list)

	def __str__(self):
		return self.name

	def __repr__(self):
		return self.name

	def distance_to_point(self, x: float, y: float) -> float:
		return ((self.x - x) ** 2 + (self.y - y) ** 2) ** 0.5

	def distance_to_location(self, location: 'Location') -> float:
		return self.distance_to_point(location.x, location.y)
