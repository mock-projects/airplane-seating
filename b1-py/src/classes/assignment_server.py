from utilities.evaluate_assignment import evaluate_flight_seat_assignments
from classes.flight import Flight


class AssignmentServer(object):
	def __init__(self, flight: Flight):
		"""
		Initializes a new flight assignment server with a flight that it is
		responsible for.
		"""
		self.flight = flight

	def print_flight_info(self):
		"""
		Prints visualization of seating chart for the flight.
		"""
		self.flight.print_visualization()

	def assign_seats(self):
		"""
		Assigns a seat to all passengers on the flight who do not yet have a
		seat assignment.
		"""

		available_seats = self.flight.get_available_seats()

		for passenger in self.flight.passengers:
			if passenger.seat is None:
				# Check for available seat in passenger's section
				section_seats = [
					seat
					for seat in available_seats
					if seat.section == passenger.section
				]

				if section_seats:
					seat = section_seats[0]
				else:
					seat = available_seats[0]
				available_seats.remove(seat)
				self.flight.assign_seat(passenger, seat)

	def evaluate_flight_seat_assignments(self):
		evaluate_flight_seat_assignments(self.flight)
