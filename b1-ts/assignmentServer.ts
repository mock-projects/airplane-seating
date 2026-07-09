import { evaluateFlightSeatAssignments } from "./evaluateAssignment";
import { Flight } from "./flight";
import { Seat } from "./seat";

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

        let seat: Seat;
        if (sectionSeats.length > 0) {
          seat = sectionSeats[0];
        } else {
          seat = availableSeats[0];
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
