import * as fs from "fs";
import * as readline from "readline";

import { Ping } from "./ping";
import { Vehicle } from "./vehicle";

export class WarehouseServer {

  // Array of vehicle instances
  vehicles: Vehicle[];

  constructor() {
    this.vehicles = [];
  }

  /**
   * Returns an object mapping vehicle name to that vehicle's average speed for
   * all vehicles.
   */
  getAverageSpeeds(): Partial<Record<string, number>> {
    return this.vehicles.reduce((acc: Partial<Record<string, number>>, vehicle: Vehicle) => {
      acc[vehicle.getName()] = vehicle.getAverageSpeed();
      return acc;
    }, {});
  }

  /**
   * Returns a sorted array of size maxResults of vehicle names corresponding
   * to the vehicles that have traveled the most distance since the given
   * timestamp (in seconds).
   *
   * @param maxResults
   * @param timestamp
   *
   * @returns Array of vehicle names
   */
  getMostTraveledSince(maxResults: number, timestamp: number): string[] {
    // TODO: Implement
    return [];
  }

  /**
   * Returns an array of names identifying vehicles that might have been
   * damaged through any number of risky behaviors, including collision with
   * another vehicle and excessive acceleration.
   *
   * @returns Array of vehicle names
   */
  checkForDamage(): string[] {
    // TODO: Implement
    return [];
  }

  initializeServer(fileName: string): Promise<void> {
    return new Promise(resolve => {
      const reader = readline.createInterface({
        input: fs.createReadStream(fileName),
      });
      reader.on('line', (line: string) => {
        const [name, x, y, timestamp] = line.split(',');
        this.processPing(name, parseInt(x), parseInt(y), parseInt(timestamp));
      });
      reader.on('close', resolve);
    });
  }

  processPing(vehicleName: string, x: number, y: number, timestamp: number) {
    const ping = new Ping(x, y, timestamp);
    if (!this.vehicles.some(vehicle => vehicle.getName() === vehicleName)) {
      this.vehicles.push(new Vehicle(vehicleName));
    }
    this.vehicles[this.vehicles.length - 1].getPings().push(ping);
  }
}
