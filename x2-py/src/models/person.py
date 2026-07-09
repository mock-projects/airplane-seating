from dataclasses import dataclass, field

from models.location import Location


@dataclass
class Person:
  """
  Simulated person.
  """

  name: str

  residence: Location | None = None

  # List of next destinations for the person
  current_journey: list[Location] = field(default_factory=list)

  def __str__(self):
    return self.name

  def journey_complete(self) -> bool:
    """
    Check if the person has completed their journey.
    """
    return not self.current_journey

  def next_destination(self) -> Location:
    """
    Get the next destination for the person.
    """
    try:
      return self.current_journey[0]
    except IndexError:
      raise Exception(f"{self} does not have a next destination")

  def arrive_at_next_destination(self) -> Location:
    """
    Arrive at the next destination in the person's journey.
    Update the journey to be the remaining destinations.

    Returns the location that the person arrived at.
    """
    return self.current_journey.pop(0)
