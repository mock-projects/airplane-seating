interface Flight {
	flight_id: string
	airline: string
	flight_number: string
	flight_status: string
	origin_code: string
	origin_name: string
	origin_terminal: string
	origin_gate: string
	destination_code: string
	destination_name: string
	destination_terminal: string
	destination_gate: string
	gate_changed: boolean
	scheduled_departure_time: string
	scheduled_arrival_time: string
	current_departure_time: string
	current_arrival_time: string
	flight_duration: number
}

export type {Flight}
