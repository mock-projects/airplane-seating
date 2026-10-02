import {TestBus} from './bus.test.mts'
import {TestJourney} from './journey.test.mts'
import {TestLocation} from './location.test.mts'

const main = () => {
	const testLoc = new TestLocation()
	testLoc.testDistanceToPoint()
	testLoc.testDistanceToLocation()

	const testBus = new TestBus()
	testBus.testBusMovement()

	const testJourney = new TestJourney()
	testJourney.testSimpleJourney()
	testJourney.testSameLocationJourney()

	console.log('All tests passed!')
}

main()
