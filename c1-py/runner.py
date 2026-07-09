from assignment_server import AssignmentServer
from util import load_tasks, load_volunteers

def main():
    tasks = load_tasks("tasks.csv")
    volunteers = load_volunteers("volunteers.csv", tasks)

    server = AssignmentServer(tasks, volunteers)
    server.assign_tasks()
    server.print_assignments()

if __name__ == "__main__":
    main()
