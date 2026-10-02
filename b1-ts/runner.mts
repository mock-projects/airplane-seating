import { AssignmentServer } from "./assignmentServer.mts";
import { loadFlight } from "./flightUtils.mts";

async function run() {
  const assignmentServer = new AssignmentServer(await loadFlight());
  assignmentServer.printFlightInfo();

  console.log("Assigning seats to all unassigned passengers...");
  assignmentServer.assignSeats();
  assignmentServer.printFlightInfo();
  assignmentServer.evaluateFlightSeatAssignments();
}

run();
