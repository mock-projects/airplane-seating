"use client";

import { useState } from "react";
import FlightCard from "./FlightCard";
import FlightDashboard from "./FlightDashboard";
import type { Flight } from "../types/flight.d.mts";

const App = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  return (
    <main className="main-container">
      {selectedFlight === null ? (
        <FlightDashboard setSelectedFlight={setSelectedFlight} />
      ) : (
        <FlightCard
          flight={selectedFlight}
          onBackClick={() => setSelectedFlight(null)}
        />
      )}
    </main>
  );
};

export default App;
