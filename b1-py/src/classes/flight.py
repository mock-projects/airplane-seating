from classes.passenger import Passenger
from classes.seat import Seat, SeatSection, SeatType

class Flight:
	def __init__(self, id: int, passengers: list[Passenger]):
		self.id = id
		self.rows = []
		self.passengers = passengers

	def add_row(self, section: SeatSection, seats: list[tuple[str, SeatType]]):
		'''
		Adds a new row of seats to the plane in a given section, where each row
		is a list of adjacent Seat instances.
		'''
		row_number = len(self.rows) + 1
		row = []
		for position, seat_type in seats:
			row.append(Seat(row_number, position, section, seat_type, False))
		self.rows.append(row)

	def assign_seat(self, passenger: Passenger, seat: Seat):
		'''Assigns a given Passenger instance to a particular Seat instance.'''
		if passenger.seat is not None:
			passenger.seat.occupied = False
		seat.occupied = True
		passenger.seat = seat

	def get_seat_by_row_and_position(
		self, row_number: int, position: str
	) -> Seat | None:
		'''
		Returns a Seat instance based on its row number and position on plane,
		or None if no seat matches those parameters.
		'''
		try:
			row = self.rows[row_number - 1]
		except IndexError:
			return None
		for seat in row:
			if seat.row_number == row_number and seat.position == position:
				return seat
		return None

	def get_available_seats(self) -> list[Seat]:
		'''Returns a list of all unoccupied seats on the plane.'''
		available_seats = []
		for row in self.rows:
			for seat in row:
				if not seat.occupied:
					available_seats.append(seat)
		return available_seats

	def print_visualization(self):
		'''
		Prints a visualization of the plane's seat map, color-coded with
		available seats in green and occupied seats in gray.
		'''
		gray = '\033[0;37m'
		green = '\033[0;32m'
		end = '\033[0m'
		print('=== Flight Seating Chart ===')
		print(f'Key:    {green}Seat Available{end}    {gray}Seat Occupied{end}')
		print()
		for row in self.rows:
			for seat in row:
				color = gray if seat.occupied else green
				print(f'{color}{seat.identifier().rjust(3)}{end}', end=' ')
			print()
		print('=== End of Seating Chart ===')
		print()

	def get_passengers_satisfying(self, predicate) -> list[Passenger]:
		'''Return a list of passengers who satisfy the predicate function.'''
		return [passenger for passenger in self.passengers if predicate(passenger)]

	def __str__(self):
		return f'Flight {self.id}'

	def __repr__(self):
		return f'Flight({self.__dict__})'
