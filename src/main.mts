import {AssignmentServer} from './classes/assignmentServer.mts'
import {evaluateFlightSeatAssignments} from './utilities/evaluateAssignment.mts'
import {loadFlight} from './utilities/flightUtils.mts'

const run = async ( ) => {
	const assignmentServer = new AssignmentServer(await loadFlight( ))
	assignmentServer.flight.printVisualization( )

	console.log('Assigning seats to all unassigned passengers...')
	assignmentServer.assignSeats( )
	assignmentServer.flight.printVisualization( )
	evaluateFlightSeatAssignments(assignmentServer.flight)
}

void run( )
