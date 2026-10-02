import type {Flight} from '../types/flight.d.mts'
import {
	getFlightDurationString,
	getTimeString,
} from '../utilities/flightUtils.mts'

interface FlightCardProps {
	flight: Flight
	onBackClick: ( ) => void
}

const FlightCard = ({flight, onBackClick}: FlightCardProps) => {
	return (
		<div className='flight-card'>
			<nav>
				<button
					onClick={onBackClick}
					className='button-back'
				>
					Back
				</button>
			</nav>
			<header className='flight-card-header'>
				<h2>Flight {flight.flight_number}</h2>
				<h2>
					{flight.origin_code} - {flight.destination_code}
				</h2>
			</header>
			<div className='flight-card-body'>
				<section className='flight-card-section'>
					<h3 className='flight-card-section-header'>Flight Summary</h3>
					<div className='flight-card-section-content'>
						<p>Airline: {flight.airline}</p>
						<p>
							Departure Time: {getTimeString(flight.current_departure_time)}
							{flight.flight_status === 'Delayed' && (
								<span>
									{' '}
									(was {getTimeString(flight.scheduled_departure_time)})
								</span>
							)}
						</p>
						<p>
							Arrival Time:{' '}
							{flight.flight_status === 'Cancelled'
								? '-'
								: getTimeString(flight.current_arrival_time)}
							{flight.flight_status === 'Delayed' && (
								<span>
									{' '}
									(was {getTimeString(flight.scheduled_arrival_time)})
								</span>
							)}
						</p>
						<p>Flight Status: {flight.flight_status}</p>
						<p>
							Flight Duration: {getFlightDurationString(flight.flight_duration)}
						</p>
					</div>
				</section>
			</div>
		</div>
	)
}

export {FlightCard}
