from classes.task import Task
from classes.volunteer import Volunteer

class AssignmentServer:
    tasks: dict[int, Task]
    volunteers: dict[int, Volunteer]
    assignments: dict[Task, Volunteer]

    def __init__(self, tasks: dict[int, Task], volunteers: dict[int, Volunteer]):
        self.tasks = tasks
        self.volunteers = volunteers
        self.assignments = {}

    def get_interested_volunteers(self, task: Task) -> list[Volunteer]:
        return [
            volunteer for volunteer in self.volunteers.values()
            if volunteer.is_interested(task)
        ]

    def assign_tasks(self):
        for task in self.tasks.values():
            interested_volunteers = self.get_interested_volunteers(task)
            if len(interested_volunteers) > 0:
                self.assignments[task] = interested_volunteers[0]
            else:
                self.assignments[task] = list(self.volunteers.values())[0]

    def print_assignments(self):
        for task in self.tasks.values():
            assignee = self.assignments.get(task)
            print(task)
            if assignee:
                print(f"    Assigned to {assignee}")
            else:
                print(f"    Unassigned")
            print()
