from dataclasses import dataclass, field

from locations.index import LocationIndex
from models.bus import Bus
from models.location import Location, LocationType
from models.person import Person
from network.network import BusNetwork
from simulation.time import time_to_string


@dataclass
class SimulationState:
  """
  Represents the current state of all people and buses in a simulation.
  """

  # Index of all non-bus-stop locations in the simulation
  location_index: LocationIndex

  # Network of bus routes in the simulation
  bus_network: BusNetwork

  # Mapping from bus names to buses
  buses: dict[str, Bus] = field(default_factory=dict)

  # Mapping from person name to person
  people: dict[str, Person] = field(default_factory=dict)

  def setup_simulation_state(self):
    """
    Set up the simulation state.
    """
    # Instantiate all buses
    for route in self.bus_network.routes.values():

      # Determine how frequently buses on this route should depart
      round_trip_time = route.round_trip_time()
      bus_count = route.get_simulated_bus_count()
      bus_interval = round_trip_time / bus_count

      # Schedule the buses to start their routes
      for i in range(bus_count):
        bus = Bus(
          name=f"{route.name} Bus {i + 1}",
          route=route,
          start_delay=int(i * bus_interval),
        )
        self.buses[bus.name] = bus

    # Give each person a random residence, and set that as their initial location
    for person in self.people.values():
      person.residence = self.location_index.find_random(LocationType.RESIDENCE)
      self.set_person_location(person, person.residence)

  def add_person(self, person: Person):
    """
    Add a new person to the state.
    """
    self.people[person.name] = person

  def set_bus_location(self, bus: Bus, stop: Location):
    """
    Add a new bus location to the state.
    """
    self.bus_network.stops[stop.name].buses.append(bus)

  def remove_bus_location(self, bus: Bus, stop: Location):
    """
    Remove a bus from a location in the state.
    """
    self.bus_network.stops[stop.name].buses.remove(bus)

  def set_person_location(self, person: Person, location: Location | Bus):
    """
    Add a new person location to the state.
    """
    if isinstance(location, Bus):
      self.buses[location.name].people.append(person)
    elif location.location_type == LocationType.BUS_STOP:
      self.bus_network.stops[location.name].people.append(person)
    else:
      self.location_index.locations[location.name].people.append(person)

  def remove_person_location(self, person: Person, location: Location | Bus):
    """
    Remove a person from a location in the state.
    """
    if isinstance(location, Bus):
      self.buses[location.name].people.remove(person)
    elif location.location_type == LocationType.BUS_STOP:
      self.bus_network.stops[location.name].people.remove(person)
    else:
      self.location_index.locations[location.name].people.remove(person)

  def move_person(
    self,
    person: Person,
    previous_location: Location | Bus,
    new_location: Location | Bus,
  ):
    """
    Move a person from one location to another.
    """
    self.remove_person_location(person, previous_location)
    self.set_person_location(person, new_location)

  def print_time_report(self, time: int):
    """
    Print a report of the current state of the simulation.
    """
    people_at_bus_stops = sum(
      len(stop.people) for stop in self.bus_network.stops.values()
    )
    people_on_buses = sum(len(bus.people) for bus in self.buses.values())
    print(
      f"Time: {time_to_string(time)} | "
      f"{str(people_on_buses).rjust(4)} people on buses | "
      f"{str(people_at_bus_stops).rjust(4)} people at bus stops"
    )
