import { Seat, SeatSection } from "./seat.ts";

export class Passenger {
  id: number;
  name: string;
  section: SeatSection;
  partyId: number;
  seat: Seat | null;

  constructor(
    id: number,
    name: string,
    section: SeatSection,
    partyId: number,
    seat?: Seat
  ) {
    this.id = id;
    this.name = name;
    this.section = section;
    this.partyId = partyId;
    this.seat = seat || null;
  }
}
