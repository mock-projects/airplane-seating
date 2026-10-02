const pickRandom = <T = unknown,>(entries: [T, number][]) => {
	// Create a weight distribution table
	let totalWeight = 0
	const weightTable: [T, number][] = []
	for (const entry of entries) {
		const weight = entry[1]
		totalWeight += weight
		weightTable.push([entry[0], totalWeight])
	}

	// Pick a an item based on given weights
	const result = Math.random() * totalWeight
	for (const [item, maxWeight] of weightTable) {
		if (result < maxWeight) return item
	}

	// Should never run; added for typescript type comprehension
	throw new Error('Internal error within "pickRandom" function')
}

export {pickRandom}
