import * as fs from 'fs';
import * as readline from 'readline';
import { MetroGraph, Station } from './metroGraph.ts';
import { Activity } from './activity.ts';
import { UserRequest } from './userRequest.ts';

type MetroStationCsvRow = [
	station: string,
	latitude: string,
	longitude: string,
];

type MetroTimetableCsvRow = [
	start: string,
	end: string,
	timeBetweenStops: string,
];

type UserRequestCsvRow = [
	userId: string,
	l1Latitude: string,
	l1Longitude: string,
	l2Latitude: string,
	l2Longitude: string,
	activityType: string,
	rating: string,
	priceCategory: string,
	timeNeeded: string,
];

type ActivityCsvRow = [
	name: string,
	lat: string,
	lon: string,
	activityType: string,
	rating: string,
	priceCategory: string,
	timeNeeded: string,
];

const isMetroStationCsvRow = (fields: string[]): fields is MetroStationCsvRow => (
	fields.length === 3
);

const isMetroTimetableCsvRow = (fields: string[]): fields is MetroTimetableCsvRow => (
	fields.length === 3
);

const isUserRequestCsvRow = (fields: string[]): fields is UserRequestCsvRow => (
	fields.length === 9
);

const isActivityCsvRow = (fields: string[]): fields is ActivityCsvRow => (
	fields.length === 7
);

// Loads metro stations and connections from disk to create metro map.
export async function loadMetroGraph(): Promise<MetroGraph> {
  const graph = new MetroGraph();

  // Load stations into metro graph
  let reader = readline.createInterface({
    input: fs.createReadStream('data/metro_stations.csv'),
  });

  for await (const line of reader) {
    // CSV type guard
    const parsedLine = line.split(",")
    if (parsedLine.length <= 1) {
      continue
    } else if (!isMetroStationCsvRow(parsedLine)) {
      throw new Error("Expected exactly 3 metro-station data fields.")
    }

    const name = parsedLine[0];
    const coordinates: [number, number] = [parseFloat(parsedLine[1]), parseFloat(parsedLine[2])];

    // Skip invalid rows.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(coordinates[0])) continue;

    const station = new Station(name, coordinates);
    graph.addStation(station);
  }

  // Load station connections into graph
  reader = readline.createInterface({
    input: fs.createReadStream('data/metro_timetable.csv'),
  });

  for await (const line of reader) {
    // CSV type guard
    const parsedLine = line.split(",")
    if (parsedLine.length <= 1) {
      continue
    } else if (!isMetroTimetableCsvRow(parsedLine)) {
      throw new Error("Expected exactly 3 metro-timetable data fields.")
    }

    const startStation = parsedLine[0];
    const endStation = parsedLine[1];
    const time = parseInt(parsedLine[2]);

    // Skip invalid rows.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(time)) continue;

    if (startStation in graph.stations && endStation in graph.stations) {
      graph.addConnection(startStation, endStation, time);
    } else {
      throw new Error(`Stations ${startStation} and/or ${endStation} not found in the graph.`);
    }
  }

  return graph;
}

export async function loadUserRequests(): Promise<UserRequest[]> {
  const reader = readline.createInterface({
    input: fs.createReadStream('data/user_requests.csv'),
  });
  const userRequests: UserRequest[] = [];
  for await (const line of reader) {
    // CSV type guard
    const parsedLine = line.split(",")
    if (parsedLine.length <= 1) {
      continue
    } else if (!isUserRequestCsvRow(parsedLine)) {
      throw new Error("Expected exactly 9 user-request data fields.")
    }

    const userId = parsedLine[0];
    const user1Location: [number, number] = [parseFloat(parsedLine[1]), parseFloat(parsedLine[2])];
    const user2Location: [number, number] = [parseFloat(parsedLine[3]), parseFloat(parsedLine[4])];
    const activityType = parsedLine[5];
    const rating = parseFloat(parsedLine[6]);
    const priceCategory = parseInt(parsedLine[7]);
    const timeNeeded = parseFloat(parsedLine[8]);

    // Skip invalid rows.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(priceCategory)) continue;

    userRequests.push(
      new UserRequest(userId, user1Location, user2Location, activityType, rating, priceCategory, timeNeeded),
    );
  }
  return userRequests;
}

export async function loadActivities(): Promise<Activity[]> {
  const reader = readline.createInterface({
    input: fs.createReadStream('data/activities.csv'),
  });
  const activities: Activity[] = [];
  for await (const line of reader) {
    // CSV type guard
    const parsedLine = line.split(",")
    if (parsedLine.length <= 1) {
      continue
    } else if (!isActivityCsvRow(parsedLine)) {
      throw new Error("Expected exactly 7 activity data fields.")
    }

    const name = parsedLine[0];
    const coordinates: [number, number] = [parseFloat(parsedLine[1]), parseFloat(parsedLine[2])];
    const activityType = parsedLine[3];
    const rating = parseFloat(parsedLine[4]);
    const priceCategory = parseInt(parsedLine[5]);
    const timeNeeded = parseFloat(parsedLine[6]);

    // Skip invalid rows.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(priceCategory)) continue;

    activities.push(new Activity(name, coordinates, activityType, rating, priceCategory, timeNeeded));
  }
  return activities;
}
