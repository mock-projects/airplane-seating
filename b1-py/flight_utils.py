import csv

from flight import Flight
from passenger import Passenger
from seat import SeatSection, SeatType


ROW_FOUR_SEATS = [
    ("A", SeatType.WINDOW),
    ("B", SeatType.AISLE),
    ("C", SeatType.AISLE),
    ("D", SeatType.WINDOW),
]

ROW_SIX_SEATS = [
    ("A", SeatType.WINDOW),
    ("B", SeatType.MIDDLE),
    ("C", SeatType.AISLE),
    ("D", SeatType.AISLE),
    ("E", SeatType.MIDDLE),
    ("F", SeatType.WINDOW),
]


def load_flight() -> Flight:
    passenger_assignments = load_passengers("passengers.csv")

    # Create a new flight
    flight = Flight(
        id=1, passengers=[passenger for _, passenger in passenger_assignments]
    )

    # Add seats to the flight
    for _ in range(3):
        flight.add_row(SeatSection.PREMIUM_ECONOMY_CLASS, ROW_FOUR_SEATS)
    for _ in range(4):
        flight.add_row(SeatSection.ECONOMY_CLASS, ROW_SIX_SEATS)
    for _ in range(5):
        flight.add_row(SeatSection.BASIC_ECONOMY_CLASS, ROW_SIX_SEATS)

    # Allocate pre-assigned seats to passengers
    for seat, passenger in passenger_assignments:
        if seat is None:
            continue
        row_number, position = seat.split("-")
        seat = flight.get_seat_by_row_and_position(int(row_number), position)
        if seat is None:
            raise Exception("Passenger seat was improperly formatted.")
        flight.assign_seat(passenger, seat)
    return flight


def load_passengers(filename: str) -> list[tuple[str | None, Passenger]]:
    """
    Loads passengers from a CSV file and returns a list of tuples, where each
    tuple contains the assigned seat and the Passenger instance.
    """
    passenger_assignments: list[tuple[str | None, Passenger]] = []
    with open(filename) as passengers_file:
        reader = csv.DictReader(passengers_file)
        for row in reader:
            passenger = Passenger(
                id=int(row["id"]),
                name=row["name"],
                section=SeatSection(row["seat_section"]),
                party_id=int(row["party_id"]),
            )
            assigned_seat = row.get("assigned_seat") or None
            passenger_assignments.append((assigned_seat, passenger))

    return passenger_assignments


