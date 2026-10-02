/**
 * A Position represents an x, y coordinate in a given warehouse. Position
 * can be used to determine how far apart or near together two vehicles are.
 */
export class Position {

  // x coordinate
  x: number

  // y coordinate
  y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  equals(obj: any): boolean {
    if (!(obj instanceof Position)) return false;
    return (this.x == obj.getX() && this.y == obj.getY());
  }

  /**
   * Determines the distance between two Positions
   * Distance is calculated as the Euclidean distance in two dimensions
   * https://en.wikipedia.org/wiki/Euclidean_distance
   */
  static getDistance(position1: Position, position2: Position): number {
    const xDiff = Math.abs(position1.getX() - position2.getX());
    const yDiff = Math.abs(position1.getY() - position2.getY());
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
  }
}
