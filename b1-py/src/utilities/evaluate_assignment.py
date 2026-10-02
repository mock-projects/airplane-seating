from classes.flight import Flight

PROGRESS_LENGTH = 20


def evaluate_flight_seat_assignments(flight: Flight):
	"""
	Evaluates a flight's seat assignments along a variety of criteria.
	"""
	print('=== Evaluate Flight Seat Assignments ===')
	print_progress(
		evaluate_passengers_with_seats(flight), 'Passengers assigned to a seat'
	)
	print_progress(
		evaluate_passengers_in_correct_sections(flight),
		'Passengers seated in correct sections',
	)
	print('=== End of Flight Seat Assignment Evaluation ===')
	print()


def evaluate_passengers_with_seats(flight: Flight) -> float:
	"""
	Returns the proportion of passengers who have been assigned a seat.

	First, counts the number of passengers who are assigned to a seat. Then,
	counts the total number of passengers. Returns the proportion of passengers
	assigned to a seat, or 1 if there are no passengers.
	"""
	count = len(flight.get_passengers_satisfying(lambda p: p.seat is not None))
	total = len(flight.passengers)
	try:
		return count / total
	except ZeroDivisionError:
		return 1


def evaluate_passengers_in_correct_sections(flight: Flight) -> float:
	"""
	Returns the proportion of passengers with seats who are in the correct
	plane section.

	First, counts the number of passengers who are assigned a seat and whose
	seat section matches the passenger's section. Then, counts the number of
	passengers who are assigned to a seat. Returns the proportion of passengers
	assigned to a seat in the correct section, or 1 if there are no passengers
	assigned to a seat.
	"""
	count = len(
		flight.get_passengers_satisfying(
			lambda p: p.seat is not None and p.seat.section == p.section
		)
	)
	total = len(flight.get_passengers_satisfying(lambda p: p.seat is not None))
	try:
		return count / total
	except ZeroDivisionError:
		return 1


def print_progress(percent: float, description: str):
	"""
	Prints progress bar.
	"""
	complete = int(min(max(percent, 0), 1) * PROGRESS_LENGTH)
	for _ in range(complete):
		print('■', end='')
	for _ in range(PROGRESS_LENGTH - complete):
		print('□', end='')
	print(f' {int(percent * 100):>3}% {description}')
