import math

from models.location import Location
from models.route import BusRoute


class BusNetwork:
  """
  An in-memory representation of the city's bus routes.
  """

  # Mapping from stop name to stop
  stops: dict[str, Location]

  # Mapping from route name to route
  routes: dict[str, BusRoute]

  # Mapping from stop name to all possible (route name, next_stop name) pairs
  connections: dict[str, list[tuple[str, str]]]

  def __init__(self, routes: list[BusRoute]):
    self.stops = dict()
    self.routes = dict()
    self.connections = dict()

    for route in routes:
      for i in range(len(route.stops) - 1):
        stop = route.stops[i]
        next_stop = route.stops[i + 1]

        if stop.name not in self.stops:
          self.stops[stop.name] = stop

        if next_stop.name not in self.stops:
          self.stops[next_stop.name] = next_stop

        if route.name not in self.routes:
          self.routes[route.name] = route

        # Add forward connection
        self.connections.setdefault(stop.name, []).append(
          (route.name, next_stop.name)
        )

        # Add reverse connection
        self.connections.setdefault(next_stop.name, []).append(
          (route.name, stop.name)
        )

  def get_nearest_stop(self, x: float, y: float) -> Location:
    """
    Returns the nearest stop to the given coordinates.
    """
    nearest_stop = None
    nearest_distance = math.inf
    for stop in self.stops.values():
      distance = stop.distance_to_point(x, y)
      if distance < nearest_distance:
        nearest_stop = stop
        nearest_distance = distance
    if nearest_stop is None:
      raise ValueError("No stops found in network")
    return nearest_stop
