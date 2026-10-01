export type SeatType = (typeof SEAT_TYPES)[number]
export type SeatSection = (typeof SEAT_SECTIONS)[number]

export const SEAT_TYPES = [
  "aisle",
  "middle",
  "window",
] as const;

export const SEAT_SECTIONS = [
  "premium_economy_class",
  "economy_class",
  "basic_economy_class",
] as const;

/**
 * Checks whether a value is a valid seat type.
 */
export const isSeatType = (value: string): value is SeatType => {
  return (
    value === "aisle"
    || value === "middle"
    || value === "window"
  )
};

/**
 * Checks whether a value is a valid seat section.
 */
export const isSeatSection = (value: string): value is SeatSection => {
  return (
    value === "premium_economy_class"
    || value === "economy_class"
    || value === "basic_economy_class"
  );
};

/**
 * Returns the seat type or throws if it is invalid.
 */
export const confirmSeatType = (seatType: string): SeatType => {
  if (isSeatType(seatType)) return seatType
  else throw new Error("Invalid seat type.")
};

/**
 * Returns the seat section or throws if it is invalid.
 */
export const confirmSeatSection = (seatSection: string): SeatSection => {
  if (isSeatSection(seatSection)) return seatSection;
  else throw new Error("Invalid seat section.");
};

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
