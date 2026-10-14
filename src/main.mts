import {makeNaiveAssignments} from './utilities/assignmentAlgorithms.mts'
import {evaluateFlightSeatAssignments} from './utilities/evaluateAssignment.mts'
import {loadFlight} from './utilities/flightUtils.mts'

const run = async ( ) => {
	const flight = await loadFlight( )
	flight.printVisualization( )

	console.log('Assigning seats to all unassigned passengers...')
	makeNaiveAssignments(flight)

	flight.printVisualization( )
	evaluateFlightSeatAssignments(flight)
}

void run( )
