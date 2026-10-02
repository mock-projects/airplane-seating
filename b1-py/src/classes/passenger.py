from typing import Optional

from classes.seat import Seat, SeatSection


class Passenger(object):
	def __init__(
		self,
		id: int,
		name: str,
		section: SeatSection,
		party_id: int,
		seat: Optional[Seat] = None,
	):
		self.id = id
		self.name = name
		self.section = section
		self.party_id = party_id
		self.seat = seat

	def __str__(self):
		return f'Passenger {self.name}'

	def __repr__(self):
		return f'Passenger({self.__dict__})'
