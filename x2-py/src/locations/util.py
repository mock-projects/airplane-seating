import csv
import random

from models.location import Location, LocationType


def read_locations_from_file(filename: str) -> list[Location]:
	"""
	Parse a CSV file of locations and return a list of `Location` objects.
	"""
	location_file = open(filename)
	reader = csv.DictReader(location_file)
	locations = []
	for row in reader:
		try:
			location_type = LocationType(row['location_type'])
		except ValueError:
			raise ValueError(f'Invalid location type: {row["location_type"]}')

		location = Location(
			name=row['name'],
			location_type=location_type,
			x=float(row['x']),
			y=float(row['y']),
			popularity=float(row['popularity']),
		)
		locations.append(location)
	location_file.close()
	return locations


def pick_random_destination_type() -> LocationType:
	"""
	Picks a random non-residence location type.
	"""
	distribution = {
		LocationType.COMMERCIAL: 0.3,
		LocationType.EDUCATION: 0.3,
		LocationType.CIVIC: 0.1,
		LocationType.HEALTHCARE: 0.1,
		LocationType.RECREATION: 0.1,
		LocationType.OTHER: 0.1,
	}
	location_types = list(distribution.keys())
	location_type_weights = list(distribution.values())
	return random.choices(location_types, weights=location_type_weights)[0]
