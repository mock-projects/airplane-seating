export enum SeatType {
  AISLE = "aisle",
  MIDDLE = "middle",
  WINDOW = "window",
}

export enum SeatSection {
  PREMIUM_ECONOMY_CLASS = "premium_economy_class",
  ECONOMY_CLASS = "economy_class",
  BASIC_ECONOMY_CLASS = "basic_economy_class",
}

export class Seat {
  rowNumber: number;
  position: string;
  section: SeatSection;
  seatType: SeatType;
  occupied: boolean;

  constructor(
    rowNumber: number,
    position: string,
    section: SeatSection,
    seatType: SeatType,
    occupied: boolean
  ) {
    this.rowNumber = rowNumber;
    this.position = position;
    this.section = section;
    this.seatType = seatType;
    this.occupied = occupied;
  }

  /**
   * Returns the seat identifier, with both row and position.
   *
   * @returns The seat identifier
   */
  identifier(): string {
    return `${this.rowNumber}${this.position}`;
  }
}
