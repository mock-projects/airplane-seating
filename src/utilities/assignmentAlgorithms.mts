import {Flight} from '../classes/flight.mts'

/**
 * Automatically assigns a seat to all passengers on the
 * flight who do not yet have a seat assignment.
 */
const makeNaiveAssignments = (flight: Flight) => {
	const availableSeats = flight.getAvailableSeats( )
	const unseatedPassengers = flight.getUnseatedPassengers( )
	for (const passenger of unseatedPassengers) {
		// Skip seated passengers, though none should be seated here.
		if (passenger.seat != null) continue

		const sectionSeats = availableSeats.filter(
			(seat) => (seat.section === passenger.section)
		)

		// Find an appropriate seat for the customer.
		let seat
		if (sectionSeats.length > 0) {
			seat = sectionSeats[0]
		}
		else if (availableSeats.length > 0) {
			seat = availableSeats[0]
		}

		// No seat could be found!
		if (seat == null) {
			throw new Error('Passenger cannot be assigned a seat.')
		}

		// Remove the seat (it is unavailable) and seat the customer.
		availableSeats.splice(availableSeats.indexOf(seat), 1)
		flight.assign(passenger, seat)
	}
}

export {
	makeNaiveAssignments,
}
