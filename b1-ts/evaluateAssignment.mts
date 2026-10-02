import { Flight } from "./flight.mts";

const PROGRESS_LENGTH = 20;

/**
 * Evaluates a flight's seat assignments along a variety of criteria.
 */
export function evaluateFlightSeatAssignments(flight: Flight) {
  console.log("=== Evaluate Flight Seat Assignments ===");
  printProgress(
    evaluatePassengersWithSeats(flight),
    "Passengers assigned to a seat"
  );
  printProgress(
    evaluatePassengersInCorrectSections(flight),
    "Passengers seated in correct sections"
  );
  console.log("=== End of Flight Seat Assignment Evaluation ===");
  console.log();
}

/**
 * Returns the proportion of passengers who have been assigned a seat.
 * First, counts the number of passengers who are assigned to a seat. Then, counts the
 * total number of passengers.
 *
 * @param flight
 * @returns The proportion of passengers assigned to a seat, or 1 if there are no
 * passengers.
 */
function evaluatePassengersWithSeats(flight: Flight): number {
  let count = flight.getPassengersSatisfying((p) => p.seat != null).length;
  let total = flight.passengers.length;

  return total == 0 ? 1 : count / total;
}

/**
 * Returns the proportion of passengers with seats who are in the correct plane section.
 * First, counts the number of passengers who are assigned a seat and whose seat section
 * matches the passenger's section. Then, counts the number of passengers who are
 * assigned to a seat.
 *
 * @param flight
 * @returns The proportion of passengers assigned to a seat in the correct section, or 1
 * if there are no passengers assigned to a seat.
 */
function evaluatePassengersInCorrectSections(flight: Flight): number {
  let count = flight.getPassengersSatisfying(
    (p) => p.seat != null && p.seat.section == p.section
  ).length;
  let total = flight.getPassengersSatisfying((p) => p.seat != null).length;

  return total == 0 ? 1 : count / total;
}

/**
 * Prints progress bar.
 *
 * @param percent
 * @param description
 */
function printProgress(percent: number, description: string) {
  let complete = Math.floor(
    Math.min(Math.max(percent, 0), 1) * PROGRESS_LENGTH
  );
  let incomplete = PROGRESS_LENGTH - complete;
  let progress = "■".repeat(complete) + "□".repeat(incomplete);
  console.log(
    `${progress} ${Math.floor(percent * 100)
      .toString()
      .padStart(3)}% ${description}`
  );
}
