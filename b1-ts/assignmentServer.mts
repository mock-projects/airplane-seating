import { evaluateFlightSeatAssignments } from "./evaluateAssignment.mts";
import { Flight } from "./flight.mts";

export class AssignmentServer {
  flight: Flight;

  constructor(flight: Flight) {
    // Initializes a new flight assignment server with a flight that it is responsible
    // for.
    this.flight = flight;
  }

  /**
   * Prints a visualization of seating chart for the flight.
   */
  printFlightInfo() {
    this.flight.printVisualization();
  }

  /**
   * Assigns a seat to all passengers on the flight who do not yet have a seat
   * assignment.
   */
  assignSeats() {
    let availableSeats = this.flight.getAvailableSeats();
    for (let passenger of this.flight.passengers) {
      if (passenger.seat == null) {
        let sectionSeats = availableSeats.filter(
          (seat) => seat.section == passenger.section
        );

        let seat
        if (sectionSeats.length > 0) {
          seat = sectionSeats[0];
        } else if (availableSeats.length > 0) {
          seat = availableSeats[0];
        }
        if (seat == null) {
          throw new Error('Passenger cannot be assigned a seat.')
        }
        availableSeats.splice(availableSeats.indexOf(seat), 1);
        this.flight.assignSeat(passenger, seat);
      }
    }
  }

  evaluateFlightSeatAssignments() {
    evaluateFlightSeatAssignments(this.flight);
  }
}
