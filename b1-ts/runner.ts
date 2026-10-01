import { AssignmentServer } from "./assignmentServer.ts";
import { loadFlight } from "./flightUtils.ts";

async function run() {
  const assignmentServer = new AssignmentServer(await loadFlight());
  assignmentServer.printFlightInfo();

  console.log("Assigning seats to all unassigned passengers...");
  assignmentServer.assignSeats();
  assignmentServer.printFlightInfo();
  assignmentServer.evaluateFlightSeatAssignments();
}

run();
