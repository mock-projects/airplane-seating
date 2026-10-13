import {AssignmentServer} from './classes/assignmentServer.mts'
import {loadFlight} from './utilities/flightUtils.mts'

const run = async ( ) => {
	const assignmentServer = new AssignmentServer(await loadFlight( ))
	assignmentServer.printFlightInfo( )

	console.log('Assigning seats to all unassigned passengers...')
	assignmentServer.assignSeats( )
	assignmentServer.printFlightInfo( )
	assignmentServer.evaluateFlightSeatAssignments( )
}

void run( )
