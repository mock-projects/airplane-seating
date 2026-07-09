# Task List

You may do these tasks in any order, but take note that they are listed in the order your team has prioritized completing them.

Reminder that you are NOT expected to complete all tasks. You are expected to write clean, readable code. Remember to add comments explaining what you were working on if you run out of time in the middle of a task.


## Task 1

In preparation for designing a system to automatically assign passengers to seats, a member of our team wrote some code to evaluate how effectively the assignment system works.

Our current seat assignment algorithm assigns each passenger a seat in their indicated section. We would like to evaluate the effectiveness of this seat assignment algorithm by also considering the proximity of passengers in the same party. Implement a function that does the following:

- Counts the number of passengers sitting near at least one other member of their party
- Returns the proportion of passengers sitting near their party out of all the passengers on the flight.

Two passengers are considered “near” each other if they are seated in the same row or one row apart. 
Please exclude single-person parties from the calculation, since they cannot be seated next to someone in their party.
After you have implemented the function, the program should call and print the result of your function.


## Task 2

Modify the seat assignment algorithm so that all passengers who have indicated their preferred seat types (e.g., aisle seats, middle seats, or window seats) are more likely to receive them.


## Task 3

We would like to prioritize assigning preferred seats to our loyalty program members in order of tier status (gold, silver, and then bronze). For example, a gold member has priority over a silver member for the same seat type in a section. All loyalty members have priority over passengers without loyalty status.

Please modify the seat assignment algorithm to increase the amount of loyalty program status passengers receiving preferential seats. We define preferential as:

- Sitting in their preferred seat type
- Sitting next to one or more passengers in the same party
- Sitting in a correct or upgraded section

Note that you do not need to meet all the heuristics described above. Our team would prefer one or two completed minor improvements to the current algorithm over an "optimal" solution that is buggy or incomplete.

