import { useState } from "react";
import FlightCard from "./components/FlightCard";
import FlightDashboard from "./components/FlightDashboard";
import { Flight } from "./types";

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
