import csv

from models.location import Location
from models.route import BusRoute


def read_routes_from_file(stops: list[Location], filename: str) -> list[BusRoute]:
  """
  Parse a CSV file of bus routes and return a list of `BusRoute` objects.
  """
  # Convert stops to a map from name to location
  stop_map = {stop.name: stop for stop in stops}

  routes_file = open(filename)
  reader = csv.DictReader(routes_file)
  routes = []
  for row in reader:
    name = row["name"]
    stops = [stop_map[stop_name] for stop_name in row["stops"].split(" -> ")]
    route = BusRoute(name, stops)
    routes.append(route)
  return routes
