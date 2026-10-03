# Task List
You may do these tasks in any order, but take note that they are listed in the order your team has prioritized completing them.

Reminder that you are NOT expected to complete all tasks.
You are expected to write clean, readable code.
Remember to add comments explaining what you were working on if you run out of time in the middle of a task.

## Task 1
1. Gate Data: In [FlightDashboard.tsx], add information about the the departure gate to the flights dashboard, so that the flight details in each row match the wireframe in [wireframe-dashboard.png].

	![wireframe-dashboard.png]

2. Visual Cues: Add visual cues for urgent flight updates.
	You should add CSS styling in [flight-alerts.css] that does the following:
	- Gate Changes:
		- The text for changed gates should appear as orange text with a heavier font weight.
	- Flight Status Changes:
		- "Delayed" should appear as orange text with a heavier font weight.
		- "Cancelled" should appear as red text with a heavier font weight.

3. Flight Data: In order to display the full list of flights in our dashboard, we first need to get the flight data for all arriving and departing flights from a REST API endpoint.
	In [fetchResults.mts], implement `fetchFlightResults()`.

	The list of flights can be obtained by making a `GET` request to `https://api.byteboard.dev/data/flights/{YYYY-MM-DD}`, where the value of the date parameter is the current date (in the browser's time zone).

## Task 2
When users click a flight row, they are taken to the flight card view.
1. To match the wireframe provided in [wireframe-flight-card.png], the flight card view needs to have the following sections of flight details:
	1. Flight Summary
	2. Departing Airport
	3. Arrival Airport

2. Clicking on the header of each card section should allow users to expand or collapse that section.
	For maintainability, you should avoid code duplication where possible.
	You are welcome to modify the existing [FlightCard.tsx] and/or create new functions, classes, or files.

## Task 3
1. Flight Filtering: Allow users to filter the flights dashboard view by either arrival or departure flights.
	Users can toggle between "Arriving Flights" and "Departing Flights" using the dropdown menu located at the top left of the dashboard header.
	When a user selects an option, the displayed flight data should update accordingly to show only the selected type of flights.

	Note that `XYZ` is the airport code for Altitude Airport:
	- Arriving Flights: Flights with a `destination_code` of "XYZ."
	- Departing Flights: Flights with an `origin_code` of "XYZ."

2. Flight Sorting: Allow users to sort the flights dashboard view.
	Add a second dropdown to the dashboard header where the user can choose to sort by:
	- Flight Number
	- Airline
	- Current Departure
	- Current Arrival

	When a user selects a sorting option, the flight list should be sorted accordingly.
	Clicking "Reset" should revert the sort criteria to the default value (e.g., "Flight Number").
	You may edit existing files or create new ones as needed.

	You may find it helpful to focus first on [Header.tsx] and [FlightDashboard.tsx].

[fetchResults.mts]: src/utilities/fetchResults.mts
[flight-alerts.css]: src/styles/flight-alerts.css
[FlightCard.tsx]: src/components/FlightCard.tsx
[FlightDashboard.tsx]: src/components/FlightDashboard.tsx
[Header.tsx]: src/components/Header.tsx
[wireframe-dashboard.png]: wireframe-dashboard.png
[wireframe-flight-card.png]: wireframe-flight-card.png
