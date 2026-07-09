import unittest
from models.bus import Bus
from models.route import BusRoute
from models.location import Location, LocationType


class TestBus(unittest.TestCase):
  def setUp(self):
    # Create test stops
    self.stop1 = Location("Stop 1", LocationType.BUS_STOP, 0, 0, 50)
    self.stop2 = Location("Stop 2", LocationType.BUS_STOP, 3, 4, 50)
    self.stop3 = Location("Stop 3", LocationType.BUS_STOP, 6, 8, 50)

    # Create test route
    self.route = BusRoute("Test Route", [self.stop1, self.stop2, self.stop3])

    # Create test bus
    self.bus = Bus("Test Bus", self.route, start_delay=0)

  def test_bus_movement(self):
    """Test bus moving forward and changing directions"""
    # Test initial position
    self.assertEqual(self.bus.current_stop(), self.stop1)
    self.assertEqual(self.bus.next_stop(), self.stop2)

    # Test moving forward
    self.bus.arrive_at_next_stop()
    self.assertEqual(self.bus.current_stop(), self.stop2)
    self.assertEqual(self.bus.next_stop(), self.stop3)

    # Test direction change at end
    self.bus.arrive_at_next_stop()  # Now at stop3
    self.assertEqual(self.bus.direction, -1)  # Should change direction
    self.assertEqual(self.bus.next_stop(), self.stop2)
