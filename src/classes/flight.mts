import type {Passenger} from './passenger.mts'
import {Seat} from './seat.mts'
import type {
	SeatCoordinates,
	SeatSection,
	SeatType,
} from './seat.mts'

class Flight {
	id: number
	rows: Array<Array<Seat>>
	assignments: Map<Passenger, Seat | null>

	constructor(id: number, passengers: Iterable<Passenger>) {
		this.id = id
		this.rows = [ ]
		this.assignments = new Map( )

		Object.values(passengers).forEach((passenger) => {
			this.assignments.set(passenger, null)
		})
	}

	get seats( ): Readonly<Array<Seat>> {
		return this.rows.flat( )
	}

	get passengers( ): Readonly<Array<Passenger>> {
		return [...this.assignments.keys( )]
	}

	/**
	 * Adds a new row of seats to the plane in a given section,
	 * where each row is a list of adjacent Seat instances.
	 *
	 * @param section The section in which to add the row
	 * @param seats The list of seats to add to the row
	 */
	addRow(section: SeatSection, seats: Iterable<[Uppercase<string>, SeatType]>) {
		const flightRow: Array<Seat> = [ ]
		const seatRow: bigint = BigInt(this.rows.length) + 1n
		for (const [seatColumn, seatType] of seats) {
			const seat = new Seat(seatRow, seatColumn, section, seatType)
			flightRow.push(seat)
		}
		this.rows.push(flightRow)
	}

	/**
	 * Assigns a given Passenger instance
	 * to a particular Seat instance.
	 *
	 * @param passenger The passenger to assign
	 * @param seat The seat to assign to the passenger
	 */
	assign(passenger: Passenger, seat: Seat) {
		const oldSeat = this.getAssignedSeat(passenger)
		if (oldSeat != null) oldSeat.occupied = false
		seat.occupied = true
		this.assignments.set(passenger, seat)
	}

	/**
	 * Retruns a specified passenger's assigned seat;
	 * avoid using this.assignments.get() directly.
	 */
	getAssignedSeat(passenger: Passenger) {
		const seat = this.assignments.get(passenger)
		if (seat === undefined) {
			throw new Error('The given passenger isn\'t a part of this flight.')
		}
		else {
			return seat
		}
	}

	/**
	 * Returns a Seat instance based on its row number and column
	 * letter on plane, or null if no seat matches those parameters.
	 *
	 * @param row The seat row number
	 * @param column The seat column letter
	 * @returns The seat instance, or null if no such seat exists
	 * }
	 */
	getSeatByCoordinates([row, column]: SeatCoordinates): Seat | null {
		return this.seats.find((seat) => (
			seat.row === row && seat.column === column
		)) ?? null
	}

	/**
	 * Returns a list of all unoccupied seats on the plane.
	 *
	 * @returns The list of unoccupied seats
	 */
	getAvailableSeats( ): Array<Seat> {
		return this.seats.filter((seat) => (
			!seat.occupied
		))
	}

	/**
	 * Returns a list of all unseated passengers on the plane.
	 *
	 * @returns The list of unseated passengers
	 */
	getUnseatedPassengers( ): Array<Passenger> {
		return this.passengers.filter((passenger) => (
			this.getAssignedSeat(passenger) == null
		))
	}

	/**
	 * Prints a visualization of the plane's seat map,
	 * color-coded with available seats in green and occupied seats in gray.
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
				process.stdout.write(`${color}${seat.toString( ).padStart(5)}${end}`)
			}
			console.log( )
		}

		console.log('=== End of Seating Chart ===')
		console.log( )
	}
}

export {Flight}
