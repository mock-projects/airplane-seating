from enum import Enum

class SeatType(Enum):
	AISLE = 'aisle'
	MIDDLE = 'middle'
	WINDOW = 'window'

class SeatSection(Enum):
	PREMIUM_ECONOMY_CLASS = 'premium_economy_class'
	ECONOMY_CLASS = 'economy_class'
	BASIC_ECONOMY_CLASS = 'basic_economy_class'

class Seat:
	def __init__(
		self,
		row_number: int,
		position: str,
		section: SeatSection,
		seat_type: SeatType,
		occupied: bool,
	):
		self.row_number = row_number
		self.position = position  # position in row, e.g. "A"
		self.section = section
		self.seat_type = seat_type
		self.occupied = occupied

	def identifier(self):
		'''Returns the seat identifier, with both row and position.'''
		return f'{self.row_number}{self.position}'

	def __str__(self):
		return f'Seat {self.identifier()}'

	def __repr__(self):
		return f'Seat({self.__dict__})'
