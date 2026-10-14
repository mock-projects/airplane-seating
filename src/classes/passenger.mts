import {confirmSeatSection} from './seat.mts'
import type {SeatSection} from './seat.mts'

class Passenger {
	id: number
	name: string
	section: SeatSection
	partyId: number

	constructor(
		id: number,
		name: string,
		section: string,
		partyId: number,
	) {
		this.id = id
		this.name = name
		this.section = confirmSeatSection(section)
		this.partyId = partyId
	}
}

export {Passenger}
