import type {Flight} from '../classes/flight.mts'
import type { Passenger } from '../classes/passenger.mts'

const PROGRESS_LENGTH = 20

/**
 * Evaluates a flight's seat assignments along a variety of criteria.
 */
const evaluateFlightSeatAssignments = (flight: Flight) => {
	console.log('=== Evaluate Flight Seat Assignments ===')
	printProgress(
		evaluatePassengersWithSeats(flight),
		'Passengers assigned to a seat',
	)
	printProgress(
		evaluatePassengersInCorrectSections(flight),
		'Passengers seated in correct sections',
	)
	printProgress(
		evaluatePassengersNearPartyMembers(flight),
		'Passengers seated near their other party member(s)',
	)
	console.log('=== End of Flight Seat Assignment Evaluation ===')
	console.log( )
}

/**
 * Returns the proportion of passengers who have been assigned a seat.
 * First, counts the number of passengers who are assigned to a seat.
 * Then, counts the total number of passengers.
 *
 * @param flight
 * @returns The proportion of passengers assigned to a seat,
 * or 1 if there are no passengers.
 */
const evaluatePassengersWithSeats = (flight: Flight): number => {
	// Count the total number of passengers.
	const total = flight.passengers.length

	// Find and count passengers who are assigned a seat.
	const count = flight.passengers.filter((passenger) => (
		flight.getAssignedSeat(passenger) != null
	)).length

	return total === 0 ? 1 : count / total
}

/**
 * Returns the proportion of passengers with seats who are in
 * the correct plane section.
 * First, counts the number of passengers who are assigned a seat
 * and whose seat section matches the passenger's section.
 * Then, counts the number of passengers who are assigned to a seat.
 *
 * @param flight
 * @returns The proportion of passengers assigned to a seat in the
 * correct section, or 1 if there are no passengers assigned to a seat.
 */
const evaluatePassengersInCorrectSections = (flight: Flight): number => {
	// Find and count passengers who are assigned a seat.
	const total = flight.passengers.filter((passenger) => (
		flight.getAssignedSeat(passenger) != null
	)).length

	// Find and count passengers who are assigned a seat
	// in the correct section.
	const count = flight.passengers.filter((passenger) => (
		flight.getAssignedSeat(passenger)?.section === passenger.section
	)).length

	return total === 0 ? 1 : count / total
}

/**
 * Returns the proportion of passengers who have been seated near
 * other members of their party.
 * First, this creates a lookup dictionary of parties, with a list
 * of each member as its values.
 * Then, this loops over each party, counting successful matches.
 *
 * @param flight
 * @returns The proportion of passengers assigned next to a seat "near"
 * other members of their party, skipping single-person and zero-person parties.
 */
const evaluatePassengersNearPartyMembers = (flight: Flight): number => {
	const parties = flight.parties

	// Count the total number of seated passengers in parties of two or more.
	const counter = (total: number, partyMembers: Set<Passenger>) => {
		// Skip parties of one.
		if (partyMembers.size <= 1) {
			return total
		}
		// Don't count unseated passengers.
		const seatedMembers = [...partyMembers].filter((member) => (
			flight.getAssignedSeat(member) != null)
		)
		// Once that's done, increment the total and continue!
		return total + seatedMembers.length
	}
	const total = parties.values( ).reduce(counter, 0)

	// Find passengers seated next to other party members.
	const matches = new Set( )
	for (const party of parties.values( )) {
		for (const member01 of party) {
			if (matches.has(member01)) continue // Already confirmed!
			for (const member02 of party) {
				if (member01 === member02) {
					continue // A passenger can't sit next to themselves.
				}
				const seat01 = flight.getAssignedSeat(member01)
				const seat02 = flight.getAssignedSeat(member02)
				if (seat01 == null || seat02 == null) {
					continue // Without a seat, you can't sit next to anyone.
				}
				if (flight.areSeatsNear(seat01, seat02)) {
					// These party members are seated near one another!
					matches.add(member01)
					matches.add(member02)
				}
			}
		}
	}

	return total === 0 ? 1 : matches.size / total
}

/**
 * Prints progress bar.
 *
 * @param percent
 * @param description
 */
const printProgress = (percent: number, description: string) => {
	if (percent < 0) percent = 0
	if (percent > 1) percent = 1
	const completeBars = Math.floor(percent * PROGRESS_LENGTH)
	const incompleteBars = PROGRESS_LENGTH - completeBars
	const displayProgress = (
		'■'.repeat(completeBars) +
		'□'.repeat(incompleteBars)
	)

	const displayPercent = Math
	.floor(percent * 100)
	.toString( )
	.padStart(3)

	console.log(
		`${displayProgress} ${displayPercent}% ${description}`,
	)
}

export {evaluateFlightSeatAssignments}
