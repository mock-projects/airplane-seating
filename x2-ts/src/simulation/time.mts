type Time = `${number}:${number}`

/**
 * Convert number of minutes since midnight to 24hr time string.
 */
const timeToString = (time: number) => {
	const hours = `${Math.floor(time / 60)}`.padStart(2, '0')
	const minutes = `${time % 60}`.padStart(2, '0')
	return `${hours}:${minutes}`
}

/**
 * Convert 24hr time string to number of minutes since midnight.
 */
const stringToTime = (time: Time) => {
	const [hours, minutes] = time.split(':').map((n) => (parseInt(n))) as [
		number,
		number,
	]
	return hours * 60 + minutes
}

export {stringToTime, timeToString}

export type {Time}
