import {LocationIndexNode} from './geonode'
import {Location, LocationType} from '../models/location'
import {PriorityQueue} from '../util/prioqueue'
import { pickRandom } from '../util/pickrandom'

/**
 * An in-memory store for efficiently querying locations by geographic region.
 */
class LocationIndex {
  root: LocationIndexNode

  // Mapping from location name to location
  locations: Record<string, Location>

  /**
   * Create a new location index with the given locations.
   */
  constructor(locations: Location[]) {
    this.root = LocationIndexNode.createRoot()
    this.locations = {}

    for (const location of locations) {
      this.locations[location.name] = location
      const roots = this.root.insertLocation(location)

      // If the root overflows, split the root and make a new root.
      if (roots.length === 2) {
        this.root = LocationIndexNode.createRoot()
        this.root.isLeaf = false
        for (const root of roots) {
          this.root.addChild(root)
        }
      }
    }
  }

  /**
   * Finds the `n` nearest locations of the given type to the given coordinates.
   */
  findNearestN(
    locationType: LocationType,
    n: number,
    x: number,
    y: number,
  ): Location[] {
    // Maintain a priority queue of locations sorted by distance from target
    const queue = new PriorityQueue<Location | LocationIndexNode>()

    // Add the root node to the queue
    const distance = this.root.boundingBox.distanceToPoint(x, y)
    queue.push(distance, this.root)

    const results: Location[] = []

    while (!queue.isEmpty()) {
      // Pop the closest node from the queue
      const node = queue.pop()

      // Resolve undefined nodes
      if (node === undefined) {
        throw new Error('Node value should never be undefined')
      }

      // If the node is a location, we've found a match
      else if (node instanceof Location) {
        results.push(node)
        if (results.length === n) {
          return results
        }
      }

      // If the node is a leaf node, add all matching location types to queue
      else if ((node instanceof LocationIndexNode) && node.isLeaf) {
        for (const location of node.locations) {
          if (location.locationType === locationType) {
            const distance = location.distanceToPoint(x, y)
            queue.push(distance, location)
          }
        }
      }

      // Otherwise, the node is an internal node. Add children to the queue
      else {
        for (const child of node.children) {
          const distance = child.boundingBox.distanceToPoint(x, y)
          queue.push(distance, child)
        }
      }
    }

    return results
  }

  /**
   * Finds the nearest location of the given type to the given coordinates.
   */
  findNearest(
    locationType: LocationType,
    x: number,
    y: number,
  ): Location | undefined {
    return this.findNearestN(locationType, 1, x, y)[0]
  }

  /**
   * Finds a random location of the given type, weighted by popularity.
   */
  findRandom(locationType: LocationType): Location {
    // Generate random numbers between -1000 and +1000, inclusive
    const x = Math.floor(Math.random() * 2001) - 1000
    const y = Math.floor(Math.random() * 2001) - 1000
    const locations = this.findNearestN(locationType, 10, x, y)

    // Randomly sample from locations based using popularity as a weight
    const entries = locations.map((location): [Location, number] => {
      return [location, location.popularity]
    })
    return pickRandom(entries)
  }
}

export {LocationIndex}
