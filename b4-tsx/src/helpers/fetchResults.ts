import TEST_DATA from "../data/testData";
import { Flight } from "../types";

const fetchFlightResults = async (): Promise<Flight[]> => {
    // TODO: Implement this function. See the README For more details.
    return TEST_DATA;
}

export default fetchFlightResults;
