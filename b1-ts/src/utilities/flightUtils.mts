import * as fs from 'fs'
import * as readline from 'readline'
import {Flight} from '../classes/flight.mts'
import {Passenger} from '../classes/passenger.mts'
import type {SeatType} from '../classes/seat.mts'

type PassengerCsvRow = [
	id: string,
	name: string,
	loyaltyStatus: string,
	partyId: string,
	seatSection: string,
	seatTypePreference: string,
	assignedSeat: string,
	bookingDatetime: string,
]

const ROW_FOUR_SEATS: [string, SeatType][] = [
	['A', 'window'],
	['B', 'aisle'],
	['C', 'aisle'],
	['D', 'window'],
] as const

const ROW_SIX_SEATS: [string, SeatType][] = [
	['A', 'window'],
	['B', 'middle'],
	['C', 'aisle'],
	['D', 'aisle'],
	['E', 'middle'],
	['F', 'window'],
] as const

const isPassengerCsvRow = (fields: string[]): fields is PassengerCsvRow =>
	fields.length === 8

export async function loadFlight(): Promise<Flight> {
	let passengerAssignments = await loadPassengers('src/data/passengers.csv')
	let flight = new Flight(
		1,
		passengerAssignments.map((p) => p[1]),
	)

	// Add seats to the flight
	for (let _ = 0; _ < 3; _++) {
		flight.addRow('premium_economy_class', ROW_FOUR_SEATS)
	}
	for (let _ = 0; _ < 4; _++) {
		flight.addRow('economy_class', ROW_SIX_SEATS)
	}
	for (let _ = 0; _ < 5; _++) {
		flight.addRow('basic_economy_class', ROW_SIX_SEATS)
	}

	// Allocate pre-assigned seats to passengers
	for (let [assignedSeat, passenger] of passengerAssignments) {
		if (assignedSeat) {
			let [rowNumber, position] = assignedSeat.split('-')

			// Ensure the assigned seat was valid
			if (rowNumber == null || position == null) {
				throw new Error('Passenger has an invalid seat.')
			}

			let seat = flight.getSeatByRowAndPosition(parseInt(rowNumber), position)
			if (seat) {
				flight.assignSeat(passenger, seat)
			}
		}
	}

	return flight
}

/**
 * Loads passengers from a CSV file and creates a list of tuples, where each tuple
 * contains the assigned seat and the Passenger instance.

 * @param filename
 * @returns A list of tuples, where each tuple contains the assigned seat and the
 * Passenger
 */
export async function loadPassengers(
	filename: string,
): Promise<[string | null, Passenger][]> {
	let passengerAssignments: [string | null, Passenger][] = []

	await new Promise((resolve) => {
		const reader = readline.createInterface({
			input: fs.createReadStream(filename),
		})

		let isHeader = true
		reader.on('line', (line) => {
			// Skip the header line
			if (isHeader) {
				isHeader = false
				return
			}

			// CSV type guard
			const parsedLine = line.split(',')
			if (parsedLine.length <= 1) {
				return // This was an empty row, we can throw it out.
			} else if (!isPassengerCsvRow(parsedLine)) {
				throw new Error('Expected exactly 8 passenger data fields.')
			}

			let id = parseInt(parsedLine[0])
			let name = parsedLine[1]
			let section = parsedLine[4].toLowerCase()
			let partyId = parseInt(parsedLine[3])
			let assignedSeat = parsedLine[6]
			const passenger = new Passenger(id, name, section, partyId)
			passengerAssignments.push([assignedSeat, passenger])
		})
		reader.on('close', resolve)
	})
	return passengerAssignments
}
