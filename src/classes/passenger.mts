import type {SeatSection, SeatType} from './seat.mts'

type LoyaltyTier = (typeof LOYALTY_TIERS)[number]

const LOYALTY_TIERS = [
	'gold',
	'silver',
	'bronze',
] as const

/**
 * Checks whether a value is a valid loyalty tier.
 */
const isLoyaltyTier = (value: string): value is LoyaltyTier => (
	value === 'gold' ||
	value === 'silver' ||
	value === 'bronze'
)

/**
 * Returns the seat type or throws if it is invalid.
 */
const confirmLoyaltyTier = (loyaltyTier: string): LoyaltyTier => {
	if (isLoyaltyTier(loyaltyTier)) return loyaltyTier
	else throw new Error('Invalid loyalty tier.')
}

class Passenger {
	id: number
	name: string
	section: SeatSection
	partyId: number
	bookingTimestamp: Date

	loyaltyTier: LoyaltyTier | null
	preferredSeatType: SeatType | null

	constructor(
		id: number,
		name: string,
		section: SeatSection,
		partyId: number,
		bookingTimestamp: Date,

		loyaltyTier?: LoyaltyTier | null,
		preferredSeatType?: SeatType | null,
	) {
		this.id = id
		this.name = name
		this.section = section
		this.partyId = partyId
		this.bookingTimestamp = bookingTimestamp

		this.loyaltyTier = loyaltyTier ?? null
		this.preferredSeatType = preferredSeatType ?? null
	}
}

export type {LoyaltyTier}

export {
	Passenger,
	LOYALTY_TIERS,
	confirmLoyaltyTier,
	isLoyaltyTier,
}
