import type {Passenger} from './passenger.mts'
import {Seat} from './seat.mts'
import type {SeatSection, SeatType} from './seat.mts'

class Flight {
	id: number
	rows: Array<Array<Seat>>
	passengers: Array<Passenger>

	constructor(id: number, passengers: Array<Passenger>) {
		this.id = id
		this.rows = [ ]
		this.passengers = passengers
	}

	/**
	 * Adds a new row of seats to the plane in a given section, where each row is a list of
	 * adjacent Seat instances.
	 *
	 * @param section The section in which to add the row
	 * @param seats The list of seats to add to the row
	 */
	addRow(section: SeatSection, seats: [string, SeatType][ ]) {
		let rowNumber: number = this.rows.length + 1
		let row: Seat[ ] = [ ]
		for (const [position, seatType] of seats) {
			row.push(new Seat(rowNumber, position, section, seatType, false))
		}
		this.rows.push(row)
	}

	/**
	 * Assigns a given Passenger instance to a particular Seat instance.
	 *
	 * @param passenger The passenger to assign
	 * @param seat The seat to assign to the passenger
	 */
	assignSeat(passenger: Passenger, seat: Seat) {
		if (passenger.seat) {
			passenger.seat.occupied = false
		}
		seat.occupied = true
		passenger.seat = seat
	}

	/**
	 * Returns a Seat instance based on its row number and position on plane, or null if no
	 * seat matches those parameters.
	 *
	 * @param rowNumber The row number
	 * @param position The position
	 * @returns The seat instance, or null if no such seat exists
	 * }
	 */
	getSeatByRowAndPosition(rowNumber: number, position: string): Seat | null {
		let row = this.rows[rowNumber - 1] ?? [ ]
		for (const seat of row) {
			if (seat.rowNumber == rowNumber && seat.position == position) {
				return seat
			}
		}
		return null
	}

	/**
	 * Returns a list of all unoccupied seats on the plane.
	 *
	 * @returns The list of unoccupied seats
	 */
	getAvailableSeats( ): Array<Seat> {
		let availableSeats: Array<Seat> = [ ]
		for (const row of this.rows) {
			for (const seat of row) {
				if (!seat.occupied) {
					availableSeats.push(seat)
				}
			}
		}
		return availableSeats
	}

	/**
	 * Prints a visualization of the plane's seat map, color-coded with available seats in
	 * green and occupied seats in gray.
	 */
	printVisualization( ) {
		const gray = '\x1b[0;37m'
		const green = '\x1b[0;32m'
		const end = '\x1b[0m'
		console.log('=== Flight Seating Chart ===')
		console.log(
			`Key:    ${green}Seat Available${end}    ${gray}Seat Occupied${end}`,
		)
		console.log( )
		for (const row of this.rows) {
			for (const seat of row) {
				const color = seat.occupied ? gray : green
				process.stdout.write(`${color}${seat.identifier( ).padStart(5)}${end}`)
			}
			console.log( )
		}

		console.log('=== End of Seating Chart ===')
		console.log( )
	}

	/**
	 * Return a list of passengers who satisfy the predicate function.
	 *
	 * @param predicate The predicate function
	 * @returns The list of passengers who satisfy the predicate
	 */
	getPassengersSatisfying(predicate: (passenger: Passenger) => boolean): Passenger[ ] {
		return this.passengers.filter(predicate)
	}
}

export {Flight}
