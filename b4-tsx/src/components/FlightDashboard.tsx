import {Fragment, useEffect, useState} from 'react'
import type {Flight} from '../types/flight.d.mts'
import {fetchFlightResults} from '../utilities/fetchResults.mts'
import {getTimeString} from '../utilities/flightUtils.mts'
import {Header} from './Header.tsx'

interface FlightDashboardProps {
	setSelectedFlight: (flight: Flight) => void
}

const FlightDashboard = ({setSelectedFlight}: FlightDashboardProps) => {
	const [flights, setFlights] = useState<Flight[ ]>([ ])
	const [viewId, setViewId] = useState(0)

	useEffect(( ) => {
		const loadFlights = async ( ) => {
			const flights = await fetchFlightResults( )
			setFlights(flights)
		}
		void loadFlights( )
	}, [ ])

	return (
		<Fragment>
			<Header
				viewId={viewId}
				setViewId={setViewId}
			/>
			<section className='dashboard-container'>
				{flights.length > 0 && (
					<table>
						<thead>
							<tr>
								<th scope='col'>Flight Number</th>
								<th scope='col'>Airline</th>
								<th scope='col'>Origin</th>
								<th scope='col'>Destination</th>
								<th scope='col'>Current Departure</th>
								<th scope='col'>Current Arrival</th>
								<th scope='col'>Status</th>
							</tr>
						</thead>
						<tbody>
							{flights.map((flight) => (
								<tr
									key={flight.flight_id}
									onClick={( ) => (setSelectedFlight(flight))}
								>
									<td>{flight.flight_number}</td>
									<td>{flight.airline}</td>
									<td>{flight.origin_code}</td>
									<td>{flight.destination_code}</td>
									<td>{getTimeString(flight.current_departure_time)}</td>
									<td>{getTimeString(flight.current_arrival_time)}</td>
									<td>{flight.flight_status}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</section>
		</Fragment>
	)
}

export {FlightDashboard}
