from task import Task


class Volunteer:
    id: int
    name: str
    interested_tasks: list[Task]

    def __init__(self, id: int, name: str):
        self.id = id
        self.name = name
        self.interested_tasks = []

    def __str__(self):
        return f"Volunteer #{self.id}: {self.name}"

    def __repr__(self):
        return f"Volunteer({self.__dict__})"

    def add_interested_task(self, task: Task):
        self.interested_tasks.append(task)

    def remove_interested_task(self, task: Task):
        self.interested_tasks.remove(task)

    def is_interested(self, task: Task) -> bool:
        return task in self.interested_tasks
