import random

from locations.node import LocationIndexNode
from models.location import Location, LocationType
from util.prio_queue import PriorityQueue


class LocationIndex:
  """
  An in-memory store for efficiently querying locations by geographic region.
  """

  root: LocationIndexNode

  # Mapping from location name to location
  locations: dict[str, Location]

  def __init__(self, locations: list[Location]):
    """
    Create a new location index with the given locations.
    """
    self.root = LocationIndexNode.create_root()
    self.locations = dict()

    for location in locations:
      self.locations[location.name] = location
      roots = self.root.insert_location(location)

      # If the root overflows, split the root and make a new root.
      if len(roots) == 2:
        self.root = LocationIndexNode.create_root()
        self.root.is_leaf = False
        for root in roots:
          self.root.add_child(root)

  def find_n_nearest(
    self, location_type: LocationType, n: int, x: float, y: float
  ) -> list[Location]:
    """
    Finds the `n` nearest locations of the given type to the given coordinates.
    """

    # Maintain a priority queue of locations sorted by distance from target
    queue = PriorityQueue()

    # Add the root node to the queue
    distance = self.root.bounding_box.distance_to_point(x, y)
    queue.push(distance, self.root)

    results: list[Location] = []

    while not queue.is_empty():
      # Pop the closest node from the queue
      node = queue.pop()

      # If the node is a location, we've found a match
      if isinstance(node, Location):
        results.append(node)
        if len(results) == n:
          return results

      # If the node is a leaf node, add all matching location types to queue
      elif isinstance(node, LocationIndexNode) and node.is_leaf:
        for location in node.locations:
          if location.location_type == location_type:
            distance = location.distance_to_point(x, y)
            queue.push(distance, location)

      # Otherwise, the node is an internal node. Add children to the queue
      else:
        for child in node.children:
          distance = child.bounding_box.distance_to_point(x, y)
          queue.push(distance, child)

    return results

  def find_nearest(self, location_type: LocationType, x: float, y: float) -> Location:
    """
    Finds the nearest location of the given type to the given coordinates.
    """
    return self.find_n_nearest(location_type, 1, x, y)[0]

  def find_random(self, location_type: LocationType) -> Location:
    """
    Finds a random location of the given type, weighted by popularity.
    """
    x = random.uniform(-1000, 1000)
    y = random.uniform(-1000, 1000)
    locations = self.find_n_nearest(location_type, 10, x, y)

    # Randomly sample from locations based on popularity
    return random.choices(
      locations, [location.popularity for location in locations]
    )[0]
