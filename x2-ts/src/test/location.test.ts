import {LocationType, Location} from "../models/location"

class TestLocation {
  location: Location

  constructor () {
    const name = "Test Location"
    const locationType = LocationType.BUS_STOP
    const x = 0.0
    const y = 0.0
    const popularity = 50.0

    this.location = new Location(name, locationType, x, y, popularity)
  }

  assertAlmostEqual(num01: number, num02: number) {
    const almostEqual = Math.floor(num01 * 10**7) / 10**7 === Math.floor(num02 * 10**7) / 10**7
    if (!almostEqual) throw new Error(`${num01} and ${num02} aren't almost equal.`)
  }

  /**
   * Test distance calculation to a point
   */
  testDistanceToPoint() {
    const distance = this.location.distanceToPoint(3.0, 4.0)
    this.assertAlmostEqual(distance, 5.0)
  }

  /**
   * Test distance calculation to another location
   */
  testDistanceToLocation() {
    const name = "Other Location"
    const locationType = LocationType.BUS_STOP
    const x = 3.0
    const y = 4.0
    const popularity = 50.0

    const otherLocation = new Location(name, locationType, x, y, popularity)
    const distance = this.location.distanceToLocation(otherLocation)
    this.assertAlmostEqual(distance, 5.0)
  }
}

export {TestLocation}
