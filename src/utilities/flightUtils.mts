import * as fs from 'fs'
import * as readline from 'readline'
import {Flight} from '../classes/flight.mts'
import {Passenger} from '../classes/passenger.mts'
import {confirmSeatSection, isSeatId, Seat} from '../classes/seat.mts'
import type {SeatId, SeatType} from '../classes/seat.mts'

type PassengerCsvRow = [
	id: string,
	name: string,
	loyaltyTier: string,
	partyId: string,
	seatSection: string,
	preferredSeatType: string,
	assignedSeat: string,
	bookingDatetime: string,
]

const ROW_FOUR_SEATS: [Uppercase<string>, SeatType][ ] = [
	['A', 'window'],
	['B', 'aisle'],
	['C', 'aisle'],
	['D', 'window'],
] as const

const ROW_SIX_SEATS: [Uppercase<string>, SeatType][ ] = [
	['A', 'window'],
	['B', 'middle'],
	['C', 'aisle'],
	['D', 'aisle'],
	['E', 'middle'],
	['F', 'window'],
] as const

const isPassengerCsvRow = (fields: string[ ]): fields is PassengerCsvRow => (
	fields.length === 8
)

const loadFlight = async ( ): Promise<Flight> => {
	const passengerAssignments = await loadPassengers('src/data/passengers.csv')
	const seatedPassengers = passengerAssignments.map(([_, passenger]) => (passenger))
	const flight = new Flight(1, seatedPassengers)

	// Add seats to the flight
	for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
		flight.addRow('premium_economy_class', ROW_FOUR_SEATS)
	}
	for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
		flight.addRow('economy_class', ROW_SIX_SEATS)
	}
	for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
		flight.addRow('basic_economy_class', ROW_SIX_SEATS)
	}

	// Allocate pre-assigned seats to passengers
	for (const [assignedSeat, passenger] of passengerAssignments) {
		if (assignedSeat) {
			const [seatRow, seatColumn] = Seat.seatIdToCoordinates(assignedSeat)

			// Ensure the assigned seat was valid
			if (seatRow == null || seatColumn == null) {
				throw new Error('Passenger has an invalid seat.')
			}

			const seat = flight.getSeatByCoordinates([seatRow, seatColumn])
			if (seat) {
				flight.assign(passenger, seat)
			}
		}
	}

	return flight
}

/**
 * Loads passengers from a CSV file and creates a list of tuples, where each tuple
 * contains the assigned seat and the Passenger instance.
 *
 * @param filename
 * @returns A list of tuples, where each tuple contains the assigned seat and the
 * Passenger
 */
const loadPassengers = async (
	filename: string,
): Promise<[SeatId | null, Passenger][ ]> => {
	const passengerAssignments: [SeatId | null, Passenger][ ] = [ ]

	const reader = readline.createInterface({
		input: fs.createReadStream(filename),
	})

	let isHeader = true
	for await (const line of reader) {
		// Skip the header line
		if (isHeader) {
			isHeader = false
			continue
		}
		// CSV type guard
		const parsedLine = line.split(',')
		if (parsedLine.length <= 1) {
			continue // This was an empty row, we can throw it out.
		}
		else if (!isPassengerCsvRow(parsedLine)) {
			throw new Error('Expected exactly 8 passenger data fields.')
		}

		// In case the csv data isn't entirely clean, let's sanitize a few entries.
		parsedLine[4] = parsedLine[4].toLowerCase( )
		parsedLine[6] = parsedLine[6].toUpperCase( )

		// Extrapolate new passenger instance arguments, using type-guards where needed.
		const id = parseInt(parsedLine[0])
		const name = parsedLine[1]
		const section = confirmSeatSection(parsedLine[4])
		const partyId = parseInt(parsedLine[3])

		// Although we don't "use" the assigned seat ID with the passenger class,
		// its still useful to return that data cleaned at the end of this function.
		const assignedSeatId = isSeatId(parsedLine[6]) ? parsedLine[6] : null

		const passenger = new Passenger(id, name, section, partyId)
		passengerAssignments.push([assignedSeatId, passenger])
	}

	return passengerAssignments
}

export {loadFlight, loadPassengers}
