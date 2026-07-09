import * as fs from "fs";
import * as readline from "readline";
import { Flight } from "./flight";
import { Passenger } from "./passenger";
import { SeatSection, SeatType } from "./seat";

const ROW_FOUR_SEATS: [string, SeatType][] = [
  ["A", SeatType.WINDOW],
  ["B", SeatType.AISLE],
  ["C", SeatType.AISLE],
  ["D", SeatType.WINDOW],
];

const ROW_SIX_SEATS: [string, SeatType][] = [
  ["A", SeatType.WINDOW],
  ["B", SeatType.MIDDLE],
  ["C", SeatType.AISLE],
  ["D", SeatType.AISLE],
  ["E", SeatType.MIDDLE],
  ["F", SeatType.WINDOW],
];

export async function loadFlight(): Promise<Flight> {
  let passengerAssignments = await loadPassengers("passengers.csv");
  let flight = new Flight(
    1,
    passengerAssignments.map((p) => p[1])
  );

  // Add seats to the flight
  for (let _ = 0; _ < 3; _++) {
    flight.addRow(SeatSection.PREMIUM_ECONOMY_CLASS, ROW_FOUR_SEATS);
  }
  for (let _ = 0; _ < 4; _++) {
    flight.addRow(SeatSection.ECONOMY_CLASS, ROW_SIX_SEATS);
  }
  for (let _ = 0; _ < 5; _++) {
    flight.addRow(SeatSection.BASIC_ECONOMY_CLASS, ROW_SIX_SEATS);
  }

  // Allocate pre-assigned seats to passengers
  for (let [assignedSeat, passenger] of passengerAssignments) {
    if (assignedSeat) {
      let [rowNumber, position] = assignedSeat.split("-");
      let seat = flight.getSeatByRowAndPosition(parseInt(rowNumber), position);
      if (seat) {
        flight.assignSeat(passenger, seat);
      }
    }
  }

  return flight;
}

/**
 * Loads passengers from a CSV file and creates a list of tuples, where each tuple
 * contains the assigned seat and the Passenger instance.

 * @param filename
 * @returns A list of tuples, where each tuple contains the assigned seat and the
 * Passenger
 */
export async function loadPassengers(
  filename: string
): Promise<[string | null, Passenger][]> {
  let passengerAssignments: [string | null, Passenger][] = [];

  await new Promise((resolve) => {
    const reader = readline.createInterface({
      input: fs.createReadStream(filename),
    });

    let isHeader = true;
    reader.on("line", (line) => {
      // Skip the header line
      if (isHeader) {
        isHeader = false;
        return;
      }
      const parsedLine = line.split(",");
      let id = parseInt(parsedLine[0]);
      let name = parsedLine[1];
      let section = parsedLine[4].toUpperCase();
      let partyId = parseInt(parsedLine[3]);
      let assignedSeat = parsedLine[6];
      const passenger = new Passenger(
        id,
        name,
        SeatSection[section as keyof typeof SeatSection],
        partyId
      );
      passengerAssignments.push([assignedSeat, passenger]);
    });
    reader.on("close", resolve);
  });
  return passengerAssignments;
}
