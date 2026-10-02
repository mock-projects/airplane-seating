import {Seat, confirmSeatSection} from './seat.mts'
import type {SeatSection} from './seat.mts'

class Passenger {
	id: number
	name: string
	section: SeatSection
	partyId: number
	seat: Seat | null

	constructor(
		id: number,
		name: string,
		section: string,
		partyId: number,
		seat?: Seat,
	) {
		this.id = id
		this.name = name
		this.section = confirmSeatSection(section)
		this.partyId = partyId
		this.seat = seat || null
	}
}

export {Passenger}
