import unittest

from models.location import Location, LocationType

class TestLocation(unittest.TestCase):
	def setUp(self):
		self.location = Location(
			name='Test Location',
			location_type=LocationType.BUS_STOP,
			x=0.0,
			y=0.0,
			popularity=50.0,
		)

	def test_distance_to_point(self):
		'''Test distance calculation to a point'''
		distance = self.location.distance_to_point(3.0, 4.0)
		self.assertAlmostEqual(distance, 5.0)

	def test_distance_to_location(self):
		'''Test distance calculation to another location'''
		other_location = Location(
			name='Other Location',
			location_type=LocationType.BUS_STOP,
			x=3.0,
			y=4.0,
			popularity=50.0,
		)
		distance = self.location.distance_to_location(other_location)
		self.assertAlmostEqual(distance, 5.0)
