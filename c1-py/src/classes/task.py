class Task:
	id: int
	name: str
	description: str

	def __init__(self, id: int, name: str, description: str):
		self.id = id
		self.name = name
		self.description = description

	def __str__(self):
		return f'Task #{self.id}: {self.name}'

	def __repr__(self):
		return f'Task({self.__dict__})'
