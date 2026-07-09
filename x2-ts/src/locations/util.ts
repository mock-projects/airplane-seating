import * as readline from 'readline'
import * as fs from 'fs'

import {Location, LocationType} from "../models/location"
import {pickRandom} from '../util/pickrandom'

/**
 * Parse a CSV file of locations and return a list of `Location` objects.
 */
const readLocationsFromFile = async (filename: string): Promise<Location[]> => {
  const reader = readline.createInterface({input: fs.createReadStream(filename)})
  const locations: Location[] = []

  // Maps a string to a location type
  const stringToLocationType = (str: string): LocationType => {
    if (Object.values<string>(LocationType).includes(str)) {
      return str as LocationType
    }
    return LocationType.OTHER
  }

  let isHeaderRow = true
  for await (const line of reader) {
    // Skip the header row, it has no data.
    if (isHeaderRow) {
      isHeaderRow = false
      continue
    }

    const data = line.split(",")

    // Skip invalid rows if there are any.
    if (
      data[0] == null
      || data[1] == null
      || data[2] == null
      || data[3] == null
      || data[4] == null
    ) continue

    const name = data[0]
    const locationType = stringToLocationType(data[1])
    const popularity = parseFloat(data[2])
    const x = parseFloat(data[3])
    const y = parseFloat(data[4])

    const location = new Location(name, locationType, x, y, popularity)
    locations.push(location)
  }

  return locations
}

/**
 * Picks a random non-residence location type.
 */
const pickRandomDestinationType = (): LocationType => {
  const distribution: Record<LocationType, number> = {
    [LocationType.COMMERCIAL]: 0.3,
    [LocationType.EDUCATION]: 0.3,
    [LocationType.CIVIC]: 0.1,
    [LocationType.HEALTHCARE]: 0.1,
    [LocationType.RECREATION]: 0.1,
    [LocationType.OTHER]: 0.1,
    [LocationType.RESIDENCE]: 0,
    [LocationType.BUS_STOP]: 0,
  }
  const entries = Object.entries(distribution) as [item: LocationType, weight: number][]
  return pickRandom(entries)
}

export {
  readLocationsFromFile,
  pickRandomDestinationType,
}
