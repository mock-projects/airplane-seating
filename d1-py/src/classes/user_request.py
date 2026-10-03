class UserRequest:
	'''Represents a request received by the application to find a midpoint activity between two users.'''

	def __init__(
		self,
		user_id: str,
		user1_location: tuple[float, float],
		user2_location: tuple[float, float],
		activity_type: str,
		rating: float,
		price_category: float,
		time_needed: float,
	):
		self.user_id = user_id
		self.user1_location = user1_location
		self.user2_location = user2_location
		self.activity_type = activity_type
		self.rating = rating
		self.price_category = price_category
		self.time_needed = time_needed

	def __repr__(self):
		return f'UserRequest({self.user_id})'
