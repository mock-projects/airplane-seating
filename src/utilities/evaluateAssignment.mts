import type {Flight} from '../classes/flight.mts'

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
