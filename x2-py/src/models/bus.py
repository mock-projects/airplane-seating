from dataclasses import dataclass, field
from typing import Literal

from models.location import Location
from models.person import Person
from models.route import BusRoute
from simulation.constants import BUS_PACE


@dataclass
class Bus:
  name: str
  route: BusRoute

  # How long after the start of the day the bus should start moving.
  # This is used to simulate buses that start their routes at different times.
  start_delay: int

  # Most recent station index.
  stop_index: int = 0

  # Direction of the bus is 1 for the bus traveling from start location to end
  # location. Direction of the bus is -1 for the bus traveling from end location
  # to start location.
  direction: int = 1

  # People currently on the bus
  people: list[Person] = field(default_factory=list)

  def __str__(self):
    return self.name

  def arrive_at_next_stop(self):
    self.stop_index += self.direction

    # Change direction if we've reached the end of the line.
    if self.stop_index == 0 or self.stop_index == len(self.route.stops) - 1:
      self.direction *= -1

  def current_stop(self) -> Location:
    return self.route.stops[self.stop_index]

  def next_stop(self) -> Location:
    return self.route.stops[self.stop_index + self.direction]

  def time_to_next_stop(self) -> float:
    return self.current_stop().distance_to_location(self.next_stop()) * BUS_PACE
