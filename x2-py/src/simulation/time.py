def time_to_string(time: int):
  """
  Convert number of minutes since midnight to 24hr time string.
  """
  hours, minutes = divmod(time, 60)
  return f"{hours:02}:{minutes:02}"


def string_to_time(time: str):
  """
  Convert 24hr time string to number of minutes since midnight.
  """
  hours, minutes = map(int, time.split(":"))
  return hours * 60 + minutes
