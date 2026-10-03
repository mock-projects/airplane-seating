'use client'

import {useState} from 'react'
import type {Flight} from '../types/flight.d.mts'
import {FlightCard} from './FlightCard.tsx'
import {FlightDashboard} from './FlightDashboard.tsx'

const App = ( ) => {
	const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)

	return (
		<main className='main-container'>
			{selectedFlight === null ? (
				<FlightDashboard setSelectedFlight={setSelectedFlight} />
			) : (
				<FlightCard
					flight={selectedFlight}
					onBackClick={( ) => (setSelectedFlight(null))}
				/>
			)}
		</main>
	)
}

export {App}
