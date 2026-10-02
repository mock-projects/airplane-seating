import heapq
import random

from typing import Any


class PriorityQueue:
	queue: list[tuple[float, float, Any]]

	def __init__(self):
		self.queue = []

	def push(self, priority: float, item: Any):
		"""
		Push an item onto the queue with a given priority.
		Break ties randomly if the priorities are the same.
		"""
		heapq.heappush(self.queue, (priority, random.random(), item))

	def pop(self) -> Any:
		return heapq.heappop(self.queue)[2]

	def peek(self) -> Any:
		return self.queue[0][2]

	def is_empty(self) -> bool:
		return len(self.queue) == 0
