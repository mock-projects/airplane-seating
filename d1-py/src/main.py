from classes.eta_calculator import ETACalculator
from classes.suggestion import suggest_midpoint_activity
from utilities.midpoint_utils import load_metro_graph, load_user_requests, load_activities

class Runner:
    def run(self):
        eta_calculator = ETACalculator(load_metro_graph())
        user_requests = load_user_requests()
        activities = load_activities()

        print("Finding suggested activities...\n")

        for request in user_requests:
            suggestion = suggest_midpoint_activity(request.user1_location, request.user2_location, activities, eta_calculator)
            if suggestion is None:
                print(f"No suggestion generated for user: {request.user_id}")
            else:
                print(f"Suggested activity for user: {request.user_id}")
                suggestion.print_details()
            print()


if __name__ == "__main__":
    Runner().run()
