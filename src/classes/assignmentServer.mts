import type {Flight} from './flight.mts'

class AssignmentServer {
	flight: Flight

	constructor(flight: Flight) {
		// Initializes a new flight assignment server
		// with a flight that it is responsible for.
		this.flight = flight
	}

	/**
	 * Assigns a seat to all passengers on the flight
	 * who do not yet have a seat assignment.
	 */
	assignSeats( ) {
		const availableSeats = this.flight.getAvailableSeats( )
		const unseatedPassengers = this.flight.getUnseatedPassengers( )
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
			this.flight.assign(passenger, seat)
		}
	}
}

export {AssignmentServer}
