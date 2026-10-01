class Station {
  name: string;
  coordinates: [number, number];

  constructor(name: string, coordinates: [number, number]) {
    this.name = name;
    this.coordinates = coordinates;
  }

  equals(other: any): boolean {
    if (!(other instanceof Station)) {
      return false;
    }
    return this.name === other.name;
  }

  toString(): string {
    return `Station(${this.name})`;
  }
}

class MetroGraph {
  // Mapping from station name -> station name -> travel time
  graph: { [key: string]: { [key: string]: number } };
  // Mapping from station name to stations
  stations: { [key: string]: Station };

  constructor() {
    this.graph = {};
    this.stations = {};
  }

  // Add station to the graph
  addStation(station: Station): void {
    if (!(station.name in this.stations)) {
      this.stations[station.name] = station;
      this.graph[station.name] = {};
    }
  }

  // Add connection time between two station names.
  addConnection(startStation: string, endStation: string, time: number): void {
    const startConnection = this.graph[startStation];
    const endConnection = this.graph[endStation];
    if (startConnection == null || endConnection == null) {
      throw new Error('Invalid connection: One or more stations not in graph.');
    }

    // Assume bidirectional connections
    startConnection[endStation] = time;
    endConnection[startStation] = time;
  }

  // Returns the distance and shortest path between stations.
  shortestPath(startStation: string, endStation: string): [number, string[] | null] {
    // Initialize distances dictionary with infinity for all stations except startStation
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};

    for (const station in this.graph) {
      distances[station] = Infinity;
      previous[station] = null;
    }
    distances[startStation] = 0;

    const priorityQueue: Array<[number, string]> = [];
    priorityQueue.push([0, startStation]);

    while (priorityQueue.length > 0) {
      // Manually find the smallest item in priority queue and remove it from queue
      priorityQueue.sort((a, b) => a[0] - b[0]);
      const [currentDistance, currentStation] = priorityQueue.shift()!;

      // If we reach the end station, reconstruct and return the shortest path
      if (currentStation === endStation) {
        const path: string[] = [];
        let step: string | null = currentStation;
        while (step !== null) {
          path.push(step);
          step = previous[step] ?? null;
        }
        path.reverse();
        const distanceToStation = distances[endStation] ?? Infinity;
        return [distanceToStation, path];
      }

      // Iterate through neighboring stations
      const neighborEtas = Object.entries(this.graph[currentStation] ?? {});
      for (const [neighbor, travelTime] of neighborEtas) {
        const distance = currentDistance + travelTime;

        // If found shorter path to neighbor, update distances, previous station, and queue
        const distanceToNeighor = distances[neighbor] ?? Infinity;
        if (distance < distanceToNeighor) {
          distances[neighbor] = distance;
          previous[neighbor] = currentStation;

          // Update the queue: Remove old entry if it exists and add new
          const index = priorityQueue.findIndex(([_, station]) => station === neighbor);
          if (index !== -1) {
            priorityQueue.splice(index, 1);
          }
          priorityQueue.push([distance, neighbor]);
        }
      }
    }

    // End station is not reachable from start
    return [Infinity, null];
  }
}

export { Station, MetroGraph };
