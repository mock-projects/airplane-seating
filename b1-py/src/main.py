from classes.assignment_server import AssignmentServer
from utilities.flight_utils import load_flight


class Runner:
	def run(self):
		assignment_server = AssignmentServer(load_flight())
		assignment_server.print_flight_info()

		print('Assigning seats to all unassigned passengers...')
		assignment_server.assign_seats()
		assignment_server.print_flight_info()
		assignment_server.evaluate_flight_seat_assignments()


if __name__ == '__main__':
	Runner().run()
