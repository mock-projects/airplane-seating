import { Passenger } from "./passenger";
import { Seat, SeatSection, SeatType } from "./seat";

export class Flight {
  id: number;
  rows: Array<Array<Seat>>;
  passengers: Array<Passenger>;

  constructor(id: number, passengers: Array<Passenger>) {
    this.id = id;
    this.rows = [];
    this.passengers = passengers;
  }

  /**
   * Adds a new row of seats to the plane in a given section, where each row is a list of
   * adjacent Seat instances.
   *
   * @param section The section in which to add the row
   * @param seats The list of seats to add to the row
   */
  addRow(section: SeatSection, seats: [string, SeatType][]) {
    let rowNumber: number = this.rows.length + 1;
    let row: Seat[] = [];
    for (let [position, seatType] of seats) {
      row.push(new Seat(rowNumber, position, section, seatType, false));
    }
    this.rows.push(row);
  }

  /**
   * Assigns a given Passenger instance to a particular Seat instance.
   *
   * @param passenger The passenger to assign
   * @param seat The seat to assign to the passenger
   */
  assignSeat(passenger: Passenger, seat: Seat) {
    if (passenger.seat) {
      passenger.seat.occupied = false;
    }
    seat.occupied = true;
    passenger.seat = seat;
  }

  /**
   * Returns a Seat instance based on its row number and position on plane, or null if no
   * seat matches those parameters.
   *
   * @param rowNumber The row number
   * @param position The position
   * @returns The seat instance, or null if no such seat exists
   * }
   */
  getSeatByRowAndPosition(rowNumber: number, position: string): Seat | null {
    let row = this.rows[rowNumber - 1];
    for (let seat of row) {
      if (seat.rowNumber == rowNumber && seat.position == position) {
        return seat;
      }
    }
    return null;
  }

  /**
   * Returns a list of all unoccupied seats on the plane.
   *
   * @returns The list of unoccupied seats
   */
  getAvailableSeats(): Array<Seat> {
    let availableSeats: Array<Seat> = [];
    for (let row of this.rows) {
      for (let seat of row) {
        if (!seat.occupied) {
          availableSeats.push(seat);
        }
      }
    }
    return availableSeats;
  }

  /**
   * Prints a visualization of the plane's seat map, color-coded with available seats in
   * green and occupied seats in gray.
   */
  printVisualization() {
    const GRAY = "\x1b[0;37m";
    const GREEN = "\x1b[0;32m";
    const END = "\x1b[0m";
    console.log("=== Flight Seating Chart ===");
    console.log(
      `Key:    ${GREEN}Seat Available${END}    ${GRAY}Seat Occupied${END}`
    );
    console.log();
    for (let row of this.rows) {
      for (let seat of row) {
        let color = seat.occupied ? GRAY : GREEN;
        process.stdout.write(`${color}${seat.identifier().padStart(5)}${END}`);
      }
      console.log();
    }

    console.log("=== End of Seating Chart ===");
    console.log();
  }

  /**
   * Return a list of passengers who satisfy the predicate function.
   *
   * @param predicate The predicate function
   * @returns The list of passengers who satisfy the predicate
   */
  getPassengersSatisfying(predicate: (p: Passenger) => boolean): Passenger[] {
    return this.passengers.filter(predicate);
  }
}
