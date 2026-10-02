import unittest
from network.network import BusNetwork
from models.route import BusRoute
from models.location import Location, LocationType
from simulation.journey import plan_journey


class TestJourney(unittest.TestCase):
	def setUp(self):
		# Create test stops
		self.stop1 = Location('Stop 1', LocationType.BUS_STOP, 0, 0, 50)
		self.stop2 = Location('Stop 2', LocationType.BUS_STOP, 5, 5, 50)
		self.stop3 = Location('Stop 3', LocationType.BUS_STOP, 10, 10, 50)

		# Create test route
		self.route = BusRoute('Test Route', [self.stop1, self.stop2, self.stop3])
		self.network = BusNetwork([self.route])

	def test_simple_journey(self):
		"""Test journey planning between two points"""
		journey = plan_journey(self.network, (1, 1), (11, 11))

		# Should return path through all stops
		self.assertEqual(len(journey), 3)
		self.assertEqual(journey[0], self.stop1)
		self.assertEqual(journey[1], self.stop2)
		self.assertEqual(journey[2], self.stop3)

	def test_same_location_journey(self):
		"""Test journey when start and end are near same stop"""
		journey = plan_journey(self.network, (0, 0), (0.1, 0.1))

		# Should return empty journey
		self.assertEqual(len(journey), 0)
