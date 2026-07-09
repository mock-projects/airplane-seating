import {Location} from './location'

/**
 * Simulated person.
 */
class Person {
  constructor (
    public name: string,
    public residence: Location | null = null,

    // List of next destinations for the person
    public currentJourney: Location[] = [],
  ) {}

  toString() {
    return this.name
  }

  /**
   * Check if the person has completed their journey.
   */
  journeyComplete(): boolean {
    return this.currentJourney.length === 0
  }

  /**
   * Get the next destination for the person.
   */
  nextDestination(): Location {
    const destination = this.currentJourney[0]
    if (destination == null) {
      throw new Error(`${this} does not have a next destination`)
    }
    return destination
  }

  /**
   * Arrive at the next destination in the person's journey.
   * Update the journey to be the remaining destinations.
   *
   * Returns the location that the person arrived at.
   */
  arriveAtNextDestination(): Location {
    const destination = this.currentJourney.shift()
    if (destination == null) {
      throw new Error(`${this} does not have a next destination`)
    }
    return destination
  }
}

export {Person}
