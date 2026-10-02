const getTimeString = (datetime: string): string => {
	const date = new Date(datetime)
	const formattedTime = date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
	})
	return formattedTime
}

const getFlightDurationString = (flightDuration: number): string => {
	const hours = Math.floor(flightDuration / 60)
	const minutes = flightDuration % 60
	return `${hours}h ${minutes}m`
}

export {getFlightDurationString, getTimeString}
