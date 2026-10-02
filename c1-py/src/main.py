from classes.assignment_server import AssignmentServer
from utilities.util import load_tasks, load_volunteers

def main():
	tasks = load_tasks('src/data/tasks.csv')
	volunteers = load_volunteers('src/data/volunteers.csv', tasks)

	server = AssignmentServer(tasks, volunteers)
	server.assign_tasks()
	server.print_assignments()

if __name__ == '__main__':
	main()
