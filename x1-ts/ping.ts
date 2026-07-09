import { Position } from "./position";

/**
 * A Ping represents a vehicle's position at a given timestamp
 */
export class Ping {

  position: Position
  timestamp: number

  /**
   * @param x - X position
   * @param y - Y position
   * @param timestamp - Timestamp of the ping, in seconds since epoch.
   */
  constructor(x: number, y: number, timestamp: number) {
    this.position = new Position(x, y);
    this.timestamp = timestamp;
  }

  getPosition(): Position {
    return this.position;
  }

  getTimestamp(): number {
    return this.timestamp;
  }

  /**
   * The difference between the timestamps of the pings, in seconds. The
   * result is positive if ping1 is earlier than ping2.
   *
   * @param ping1 - First ping
   * @param ping2 - Second ping
   * 
   * @returns Seconds between pings
   */
  static secondsBetween(ping1: Ping, ping2: Ping): number {
    return ping2.getTimestamp() - ping1.getTimestamp();
  }
}

