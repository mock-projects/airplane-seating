from activity import Activity
from metro_graph import MetroGraph, Station
from eta_calculator import ETACalculator
from user_request import UserRequest

class Suggestion():
    """A suggestion is an activity recommended based on a given user request."""
    def __init__(self, activity: Activity, user1_eta: float, user2_eta: float):
        self.activity = activity
        self.user1_eta = user1_eta
        self.user2_eta = user2_eta

    def print_details(self):
        print(f"Suggested activity: {self.activity.name}")
        print(f"Distance from User 1: {self.user1_eta} minutes")
        print(f"Distance from User 2: {self.user2_eta} minutes")

def suggest_midpoint_activity(
    user1_location: tuple[float, float],
    user2_location: tuple[float, float],
    activities: list[Activity],
    eta_calculator: ETACalculator
) -> Suggestion:
    """
    Returns a suggested activity that's somewhere between the users' locations.
    """
    # TODO
    pass
