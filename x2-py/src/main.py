import os

from locations.index import LocationIndex
from locations.node import LocationIndexNode
from locations.util import read_locations_from_file
from models.location import LocationType
from network.network import BusNetwork
from network.util import read_routes_from_file
from simulation.journey import plan_journey
from simulation.simulation import Simulation

LOCATIONS_FILENAME = os.path.join(os.path.dirname(__file__), 'data', 'locations.csv')
BUS_STOPS_FILENAME = os.path.join(os.path.dirname(__file__), 'data', 'bus-stops.csv')
BUS_ROUTES_FILENAME = os.path.join(os.path.dirname(__file__), 'data', 'bus-routes.csv')


def main():
	locations = read_locations_from_file(LOCATIONS_FILENAME)
	print(f'Loaded {len(locations)} locations.')

	index = LocationIndex(locations)
	print('Created location index.')

	bus_stops = read_locations_from_file(BUS_STOPS_FILENAME)
	print(f'Loaded {len(bus_stops)} bus stops.')

	routes = read_routes_from_file(bus_stops, BUS_ROUTES_FILENAME)
	print(f'Loaded {len(routes)} bus routes.')

	network = BusNetwork(routes)
	print('Created bus route network.')

	simulation = Simulation(index, network)
	simulation.simulate_day()
	simulation.print_results()


if __name__ == '__main__':
	main()
