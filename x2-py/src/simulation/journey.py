from models.location import Location
from network.network import BusNetwork


def plan_journey(
	network: BusNetwork, start: tuple[float, float], end: tuple[float, float]
) -> list[Location]:
	"""
	Plans a person's journey between a start and end location.

	Returns a list of stations the person will pass through.
	"""
	start_stop = network.get_nearest_stop(*start)
	end_stop = network.get_nearest_stop(*end)

	# If the start and end stops are the same, we're done
	if start_stop == end_stop:
		return []

	# Find the most efficient bus route between the start and end stops
	distances = {stop.name: float('inf') for stop in network.stops.values()}
	previous: dict[str, Location | None] = {
		stop.name: None for stop in network.stops.values()
	}
	distances[start_stop.name] = 0.0

	# Keep track of all stops we haven't visited yet
	unvisited = set(network.stops.keys())

	while unvisited:
		# Choose stop based on shortest distance
		current_stop_name = min(unvisited, key=lambda stop: distances[stop])
		unvisited.remove(current_stop_name)
		current = network.stops[current_stop_name]

		if current == end_stop:
			break

		# Update knowledge about distances to all potential next stops
		for route_name, next_stop_name in network.connections[current.name]:
			next_stop = network.stops[next_stop_name]
			distance = distances[current.name] + current.distance_to_location(next_stop)
			if distance < distances[next_stop.name]:
				distances[next_stop.name] = distance
				previous[next_stop.name] = current

	# Reconstruct the path from the end stop to the start stop
	current = end_stop
	journey: list[Location] = []
	while current is not None:
		journey.insert(0, current)
		current = previous[current.name]

	return journey
