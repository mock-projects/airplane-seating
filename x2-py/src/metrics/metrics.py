from simulation.state import SimulationState


class SimulationMetric:
  name: str

  def record_metric(self, time: int, state: SimulationState):
    pass

  def print_metric(self):
    pass


class BusOccupancyMetric(SimulationMetric):

  # Map from bus names to max occupancy
  max_occupancy_by_bus: dict[str, int]

  def __init__(self):
    self.name = "Bus Occupancy Metric"
    self.max_occupancy_by_bus = dict()

  def record_metric(self, time: int, state: SimulationState):
    for bus in state.buses.values():
      occupancy = len(bus.people)

      # Record max occupancy for bus
      if bus.name not in self.max_occupancy_by_bus:
        self.max_occupancy_by_bus[bus.name] = occupancy
      else:
        self.max_occupancy_by_bus[bus.name] = max(
          occupancy, self.max_occupancy_by_bus[bus.name]
        )

  def print_metric(self):
    # Get most popular bus lines
    most_popular_buses = sorted(
      self.max_occupancy_by_bus.items(), key=lambda x: x[1], reverse=True
    )[:5]
    print("Most popular buses:")
    for bus, occupancy in most_popular_buses:
      print(f"  {bus}: {occupancy} max occupancy")


class RouteUtilizationMetric(SimulationMetric):
  """
  Tracks how frequently each route is used by passengers.
  """

  # Map from route name to set of passenger names
  route_usage: dict[str, set[str]]

  def __init__(self):
    self.name = "Route Utilization Metric"
    self.route_usage = {}

  def record_metric(self, time: int, state: SimulationState):
    for bus in state.buses.values():
      passengers = set(person.name for person in bus.people)
      self.route_usage.setdefault(bus.route.name, set()).update(passengers)

  def print_metric(self):
    top_routes = sorted(
      self.route_usage.items(), key=lambda x: len(x[1]), reverse=True
    )[:10]
    print("Top routes by total unique passengers:")
    for route, passengers in top_routes:
      print(f"  {route}: {len(passengers)} passengers")
