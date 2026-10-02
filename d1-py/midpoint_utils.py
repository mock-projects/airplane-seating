import csv
import os

from activity import Activity
from metro_graph import MetroGraph, Station
from user_request import UserRequest


def load_metro_graph() -> MetroGraph:
    """Loads metro stations and connections from disk to create metro map."""
    graph = MetroGraph()

    # Load stations into metro graph
    with open(os.path.join("data", "metro-stations.csv")) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row["Station"]
            coordinates = float(row["Latitude"]), float(row["Longitude"])
            station = Station(name, coordinates)
            graph.add_station(station)

    # Load station connections into graph
    with open(os.path.join("data", "metro-timetable.csv")) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            start_station = row["Start"]
            end_station = row["End"]
            time = float(row["Time Between Stops"])
            if start_station in graph.stations and end_station in graph.stations:
                graph.add_connection(start_station, end_station, time)
            else:
                raise Exception(f"Stations {start_station} and/or {end_station} not found in the graph.")

    return graph


def load_user_requests() -> list[UserRequest]:
    user_requests = []
    with open(os.path.join("data", "user-requests.csv")) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            user_requests.append(UserRequest(
                user_id=row["user_id"],
                user1_location=(float(row["L1_latitude"]), float(row["L1_longitude"])),
                user2_location=(float(row["L2_latitude"]), float(row["L2_longitude"])),
                activity_type=row["activity_type"],
                rating=float(row["rating"]),
                price_category=float(row["price_category"]),
                time_needed=float(row["time_needed"]),
            ))
    return user_requests

def load_activities() -> list[Activity]:
    activities = []
    with open(os.path.join("data", "activities.csv")) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            activities.append(Activity(
                name=row["name"],
                coordinates=(float(row["lat"]), float(row["lon"])),
                activity_type=row["activity_type"],
                rating=float(row["rating"]),
                price_category=float(row["price_category"]),
                time_needed=float(row["time_needed"]),
            ))
    return activities
