import { Ping } from "./ping";

/**
 * A named vehicle with a sequence of pings.
 */
export class Vehicle {

  name: string;
  pings: Ping[];

  constructor(name: string) {
    this.name = name;
    this.pings = [];
  }

  /**
   * Gets the name of the vehicle.
   * @return Name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Gets the pings for the vehicle, in chronological order (earliest first).
   * @return Pings
   */
  getPings(): Ping[] {
    return this.pings;
  }

  /**
   * Determines the total distance covered by the pings.
   * @param pings - Array of pings
   * @return Distance covered
   */
  static getTotalDistance(pings: Ping[]): number {
    // TODO: implement
    return 0;
  }

  /**
   * Determines the total distance traveled by the vehicle.
   * @return Total distance traveled
   */
  getTotalDistance(): number {
    return Vehicle.getTotalDistance(this.pings);
  }

  /**
   * Determines the average speed of the vehicle.
   * @return Average speed
   */
  getAverageSpeed(): number {
    // TODO: implement
    return 0;
  }
}
