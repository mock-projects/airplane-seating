/** We'll use coordinates to store seat identification, not a SeatId string. */
type SeatCoordinates = [row: bigint, column: Uppercase<string>]
/** This SeatId type is a bit more lax than the isSeatId check. */
type SeatId = `${bigint}-${Uppercase<string>}`
type SeatSection = (typeof SEAT_SECTIONS)[number]
type SeatType = (typeof SEAT_TYPES)[number]

const SEAT_SECTIONS = [
	'premium_economy_class',
	'economy_class',
	'basic_economy_class',
] as const

const SEAT_TYPES = [
	'aisle',
	'middle',
	'window',
] as const

/**
 * Checks whether a seat id is formatted properly.
 * The proper format of a SeatId is as follows:
 * "(Integer)-(One Capital Letter)", ignoring parentheses.
 * The actual SeatId type is a bit more lax than this,
 * though, due to TypeScript's limitations.
 */
const isSeatId = (value: string): value is SeatId => (
	/^\d+-[A-Z]$/.test(value)
)

/** Checks whether a value is a valid seat type. */
const isSeatType = (value: string): value is SeatType => (
	value === 'aisle' ||
	value === 'middle' ||
	value === 'window'
)

/** Checks whether a value is a valid seat section. */
const isSeatSection = (value: string): value is SeatSection => (
	value === 'premium_economy_class' ||
	value === 'economy_class' ||
	value === 'basic_economy_class'
)

/** Returns the seat ID or throws if it is invalid. */
const confirmSeatId = (seatId: string): SeatId => {
	if (isSeatId(seatId)) return seatId
	else throw new Error('Invalid seat ID.')
}

/** Returns the seat type or throws if it is invalid. */
const confirmSeatType = (seatType: string): SeatType => {
	if (isSeatType(seatType)) return seatType
	else throw new Error('Invalid seat type.')
}

/** Returns the seat section or throws if it is invalid. */
const confirmSeatSection = (seatSection: string): SeatSection => {
	if (isSeatSection(seatSection)) return seatSection
	else throw new Error('Invalid seat section: ' + seatSection)
}

class Seat {
	readonly row: bigint
	readonly column: Uppercase<string>
	section: SeatSection
	seatType: SeatType
	occupied: boolean

	constructor(
		row: bigint,
		column: Uppercase<string>,
		section: SeatSection,
		seatType: SeatType,
		occupied: boolean = false,
	) {
		this.row = row
		this.column = column
		this.section = section
		this.seatType = seatType
		this.occupied = occupied
	}

	static seatIdToCoordinates(seatId: SeatId): SeatCoordinates {
		const row = BigInt(seatId.slice(0, seatId.indexOf('-')))
		const column = (
			seatId
			.slice(seatId.indexOf('-') + 1)
			.toUpperCase( )
		 ) as Uppercase<string> // WARN: We used an assertion here!
		return [row, column] as const
	}

	get coordinates( ): Readonly<SeatCoordinates> {
		return [this.row, this.column] as const
	}

	get seatId( ): Readonly<SeatId> {
		return `${this.row}-${this.column}` as const
	}
}

export type {
	SeatCoordinates,
	SeatId,
	SeatSection,
	SeatType,
}

export {
	Seat,
	SEAT_SECTIONS,
	SEAT_TYPES,
	confirmSeatId,
	confirmSeatSection,
	confirmSeatType,
	isSeatId,
	isSeatSection,
	isSeatType,
}
