import csv

from classes.task import Task
from classes.volunteer import Volunteer


def load_tasks(filename: str) -> dict[int, Task]:
    tasks = {}
    with open(filename) as tasks_file:
        reader = csv.DictReader(tasks_file)
        for row in reader:
            task_id = int(row["id"])
            tasks[task_id] = Task(
                id=task_id,
                name=row["name"],
                description=row["description"],
            )
    return tasks


def load_volunteers(filename: str, tasks: dict[int, Task]) -> dict[int, Volunteer]:
    volunteers = {}

    with open(filename) as volunteers_file:
        reader = csv.DictReader(volunteers_file)
        for row in reader:
            volunteer_id = int(row["id"])
            volunteer = Volunteer(
                id=volunteer_id,
                name=row["name"],
            )

            # Load interested tasks
            for task_id in row["interested_tasks"].split():
                task = tasks.get(int(task_id))
                if task:
                    volunteer.add_interested_task(task)

            volunteers[volunteer_id] = volunteer

    return volunteers
