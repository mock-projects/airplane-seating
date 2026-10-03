class BoundingBox:
	'''Representation of a 2-dimensional bounding box in coordinate space.'''

	min_x: float
	min_y: float
	max_x: float
	max_y: float

	def __init__(self, min_x: float, min_y: float, max_x: float, max_y: float):
		'''Create a new bounding box with the given coordinates.'''
		self.min_x = min_x
		self.min_y = min_y
		self.max_x = max_x
		self.max_y = max_y

	def __str__(self):
		return f'({self.min_x:.2f}, {self.min_y:.2f}) - ({self.max_x:.2f}, {self.max_y:.2f})'

	def area(self) -> float:
		'''Return the area of this bounding box.'''
		return (self.max_x - self.min_x) * (self.max_y - self.min_y)

	def contains_point(self, x: float, y: float) -> bool:
		'''Return whether this bounding box contains the given point.'''
		return self.min_x <= x <= self.max_x and self.min_y <= y <= self.max_y

	def intersects_box(self, other: 'BoundingBox') -> bool:
		'''Return whether this bounding box intersects with another.'''
		return (
			self.min_x <= other.max_x
			and self.max_x >= other.min_x
			and self.min_y <= other.max_y
			and self.max_y >= other.min_y
		)

	def extended_with_point(self, x: float, y: float) -> 'BoundingBox':
		'''Return a new bounding box that includes the given point.'''
		return BoundingBox(
			min(self.min_x, x),
			min(self.min_y, y),
			max(self.max_x, x),
			max(self.max_y, y),
		)

	def extended_with_box(self, other: 'BoundingBox') -> 'BoundingBox':
		'''Return a new bounding box that includes the given box.'''
		return BoundingBox(
			min(self.min_x, other.min_x),
			min(self.min_y, other.min_y),
			max(self.max_x, other.max_x),
			max(self.max_y, other.max_y),
		)

	def distance_to_point(self, x: float, y: float) -> float:
		'''Return the distance between a bounding box and a point.'''

		# If the point is in the box, the distance is zero distance
		if self.contains_point(x, y):
			return 0

		# If the point lies within the x range of box, the distance is the
		# y distance to the nearest edge
		if self.min_x <= x <= self.max_x:
			return min(abs(self.min_y - y), abs(self.max_y - y))

		# If the point lies within the y range of box, the distance is the
		# x distance to the nearest edge
		if self.min_y <= y <= self.max_y:
			return min(abs(self.min_x - x), abs(self.max_x - x))

		# Otherwise, the distance is the distance to the nearest corner
		return min(
			((self.min_x - x) ** 2 + (self.min_y - y) ** 2) ** 0.5,
			((self.min_x - x) ** 2 + (self.max_y - y) ** 2) ** 0.5,
			((self.max_x - x) ** 2 + (self.min_y - y) ** 2) ** 0.5,
			((self.max_x - x) ** 2 + (self.max_y - y) ** 2) ** 0.5,
		)
