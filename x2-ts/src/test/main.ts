import { TestBus } from "./bus.test"
import { TestJourney } from "./journey.test"
import { TestLocation } from "./location.test";


const main = () => {
  const testLoc = new TestLocation()
  testLoc.testDistanceToPoint()
  testLoc.testDistanceToLocation()

  const testBus = new TestBus()
  testBus.testBusMovement()

  const testJourney = new TestJourney()
  testJourney.testSimpleJourney()
  testJourney.testSameLocationJourney()

  console.log("All tests passed!")
}

main()
