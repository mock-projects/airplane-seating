# Task List

You may do these tasks in any order, but take note that they are listed in the order your team has prioritized completing them.

Reminder that you are NOT expected to complete all tasks. You are expected to write clean, readable code. Remember to add comments explaining what you were working on if you run out of time in the middle of a task.


## Task 1

In `vehicle.ts`, implement the method with the prototype:
**static getTotalDistance(pings);**
This method takes a list of Pings and should return the total distance traversed by the given forklift. You can assume the input list is sorted with the earliest ping at the start. Once you are done, use `vehicle.getTotalDistance()` in your implementation of:
**getAverageSpeed();**
This method should return the average speed (total distance / total time) observed for the given forklift. A forklift which has never moved would have an average speed of 0 meters per second. You can assume the input list of Pings is sorted with the earliest ping at the start.


## Task 2

In `warehouse_server.ts`, implement the method with the prototype
**getMostTraveledSince(maxResults, timestamp);**
This method returns an array of the `maxResults` forklifts that have traveled the most distance since `timestamp` (inclusive), sorted by those that have moved most to least. You can assume the lists of `pings` for each vehicle are sorted with the earliest ping at the start.


## Task 3

We want to be as proactive as possible in providing maintenance and repairs to our forklifts, especially those which may have been damaged. In `warehouse_server.ts`, implement the method with the prototype
**checkForDamage();**
This method should identify a list of forklifts that might need to be inspected. Examples of behavior that might warrant an inspection include forklifts which have been driven aggressively (quick acceleration and deceleration) or when forklifts collide with one another. You can use any heuristics you like, but are encouraged to make sure your decisions are well documented and your code is appropriately decomposed.

