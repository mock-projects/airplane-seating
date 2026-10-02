import math
from dataclasses import dataclass

from locations.box import BoundingBox
from models.location import Location

class LocationIndexNode:
	'''A node in a spatial index for locations.'''

	MAX_CHILDREN = 10

	parent: 'LocationIndexNode | None'

	# Bounding box containing all locations in node and its children
	bounding_box: BoundingBox

	# Locations are only stored at the leaves of the tree
	is_leaf: bool
	locations: list[Location]

	# Internal nodes store references to their children
	children: list['LocationIndexNode']

	def __init__(
		self,
		is_leaf: bool,
		parent: 'LocationIndexNode | None',
		locations: list[Location],
		bounding_box: BoundingBox,
		children: list['LocationIndexNode'],
	):
		self.is_leaf = is_leaf
		self.parent = parent
		self.locations = locations
		self.bounding_box = bounding_box
		self.children = children

	def __str__(self):
		if self.is_leaf:
			return f'Node[{len(self.locations)} locations, {self.bounding_box}]'
		return f'Node[{len(self.children)} children, {self.bounding_box}]'

	def create_child(self) -> 'LocationIndexNode':
		'''Create a new leaf node that holds a list of locations.'''
		return LocationIndexNode(
			is_leaf=True,
			parent=self,
			locations=[],
			bounding_box=BoundingBox(math.inf, math.inf, -math.inf, -math.inf),
			children=[],
		)

	@classmethod
	def create_root(cls) -> 'LocationIndexNode':
		'''Create a new root node.'''
		return LocationIndexNode(
			is_leaf=True,
			parent=None,
			locations=[],
			bounding_box=BoundingBox(math.inf, math.inf, -math.inf, -math.inf),
			children=[],
		)

	def bounding_box_of_child(self, child_index: int) -> BoundingBox:
		'''Return the bounding box of the specified child.'''

		# For a leaf, the bounding box of the child is just a box containing a
		# single location.
		if self.is_leaf:
			location = self.locations[child_index]
			return BoundingBox(location.x, location.y, location.x, location.y)

		# For an internal node, use the child's bounding box.
		return self.children[child_index].bounding_box

	def get_child(self, child_index: int) -> 'LocationIndexNode | Location':
		'''Return the child at the specified index.'''
		if self.is_leaf:
			return self.locations[child_index]
		return self.children[child_index]

	def add_child(self, child: 'LocationIndexNode | Location'):
		'''
		Add a child to the node.
		Since leaf nodes have no child nodes, the "children" of a leaf node are just
		location objects. The children of internal nodes are other nodes.
		'''
		if self.is_leaf and isinstance(child, Location):
			self.locations.append(child)
			self.bounding_box = self.bounding_box.extended_with_point(child.x, child.y)
		elif not self.is_leaf and isinstance(child, LocationIndexNode):
			self.children.append(child)
			self.bounding_box = self.bounding_box.extended_with_box(child.bounding_box)
		else:
			raise ValueError('Invalid child type')

	def insert_location(self, location: Location) -> list['LocationIndexNode']:
		'''
		Inserts a location into a tree rooted at the current node,
		returning the new root(s) if changed.

		We might return multiple nodes if the initial node is split.
		'''

		# If this is a leaf node, add the location to the leaf's list of locations.
		if self.is_leaf:
			self.add_child(location)

			# Split the node if it has too many children
			if len(self.locations) > self.MAX_CHILDREN:
				return self.split()
			return [self]

		chosen_child_index = None

		# This is an internal node. Check for a child that already contains location.
		for i, child in enumerate(self.children):
			if child.bounding_box.contains_point(location.x, location.y):
				chosen_child_index = i

		# No children contain the location, so we find the child that requires
		# the least enlargement of its bounding box.
		if chosen_child_index is None:
			best_enlargement = math.inf
			for i, child in enumerate(self.children):
				enlargement = (
					child.bounding_box.extended_with_point(
						location.x, location.y
					).area()
					- child.bounding_box.area()
				)
				if enlargement < best_enlargement:
					chosen_child_index = i
					best_enlargement = enlargement

		if chosen_child_index is None:
			raise ValueError('Internal node with no children')

		# Insert location into the chosen child.
		self.bounding_box = self.bounding_box.extended_with_point(
			location.x, location.y
		)
		chosen_child = self.children[chosen_child_index]
		children = chosen_child.insert_location(location)

		# If the child was split, update the child references.
		if len(children) == 2:
			self.children[chosen_child_index] = children[0]
			self.children.append(children[1])

			# Split the node if it has too many children
			if len(self.children) > self.MAX_CHILDREN:
				return self.split()

		return [self]

	def split(self) -> list['LocationIndexNode']:
		'''Split a node into two nodes.'''
		# Find two children to start the split.
		# We choose the two children that would require the most enlargement
		# to keep together.
		split_indices = None
		worst_enlargement = -math.inf

		num_children = len(self.locations) if self.is_leaf else len(self.children)
		for i in range(num_children):
			for j in range(i + 1, num_children):
				i_box = self.bounding_box_of_child(i)
				j_box = self.bounding_box_of_child(j)
				combined_box = i_box.extended_with_box(j_box)
				enlargement = combined_box.area() - i_box.area() - j_box.area()
				if enlargement > worst_enlargement:
					split_indices = (i, j)
					worst_enlargement = enlargement

		if split_indices is None:
			raise ValueError('No children to split')

		# We need to assign the remaining children to one of the two new nodes.
		remaining_indices = {i for i in range(num_children)} - {
			split_indices[0],
			split_indices[1],
		}

		split1 = (
			self.parent.create_child()
			if self.parent
			else LocationIndexNode.create_root()
		)
		split1.is_leaf = self.is_leaf
		split1.add_child(self.get_child(split_indices[0]))

		split2 = (
			self.parent.create_child()
			if self.parent
			else LocationIndexNode.create_root()
		)
		split2.is_leaf = self.is_leaf
		split2.add_child(self.get_child(split_indices[1]))

		while remaining_indices:
			# Choose the child that has the greatest preference for one child or the
			# other based on enlargement required.
			chosen_child_index = None
			chosen_preference = None
			greatest_enlargement = -math.inf

			for i in remaining_indices:
				i_box = self.bounding_box_of_child(i)
				enlargement1 = (
					split1.bounding_box.extended_with_box(i_box).area()
					- split1.bounding_box.area()
				)
				enlargement2 = (
					split2.bounding_box.extended_with_box(i_box).area()
					- split2.bounding_box.area()
				)

				enlargement = abs(enlargement1 - enlargement2)
				if enlargement > greatest_enlargement:
					chosen_child_index = i
					chosen_preference = (
						split1 if enlargement1 < enlargement2 else split2
					)
					greatest_enlargement = enlargement

			if chosen_child_index is None or chosen_preference is None:
				raise ValueError('No child chosen')

			chosen_preference.add_child(self.get_child(chosen_child_index))
			remaining_indices.remove(chosen_child_index)

		return [split1, split2]
