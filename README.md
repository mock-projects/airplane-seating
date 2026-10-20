> This repository was built upon a mock-project template.
> You can see in `TODO.md` that there were a series of tasks given to be completed.
>
> All the tasks are complete in this project workspace!
> I had a lot of fun completing these tasks on my own and tweaking the codebase, to help practice and showcase my skills.

# Airplane Seating
This project is designed to assign a group of passengers to seats in a flight optimally, given their preferences and other metadata.
When the script is run, it generates some seat assignments with an algorithm, and outputs a text representation of the results in the terminal.

## How to Run
Download the code, and then run:
1. `npm install`
1. `npm start`

## How to Use
### Input Values
The input values can all be found in the csv files.
Navigate to `./src/data/` in order to view all the passenger input data!

### Terminal Output
When you run the script, data is output in your terminal.
It looks something like this:

~~~md
=== Flight Seating Chart ===
Key:    Seat Available    Seat Occupied

   1-A   1-B   1-C   1-D
   2-A   2-B   2-C   2-D
   3-A   3-B   3-C   3-D
   4-A   4-B   4-C   4-D   4-E   4-F
   5-A   5-B   5-C   5-D   5-E   5-F
   6-A   6-B   6-C   6-D   6-E   6-F
   7-A   7-B   7-C   7-D   7-E   7-F
   8-A   8-B   8-C   8-D   8-E   8-F
   9-A   9-B   9-C   9-D   9-E   9-F
  10-A  10-B  10-C  10-D  10-E  10-F
  11-A  11-B  11-C  11-D  11-E  11-F
  12-A  12-B  12-C  12-D  12-E  12-F
=== End of Seating Chart ===

=== Evaluate Flight Seat Assignments ===
■■■■■■■■■■■■■■■■■■■■ 100% Passengers assigned to a seat
■■■■■■■■■■■■■■■■■■■■ 100% Passengers seated in correct sections
■■■■■■■■■■■■■□□□□□□□  67% Passengers seated near their other partymember(s)
=== End of Flight Seat Assignment Evaluation ===
~~~

This chart shows how passengers are seated on the plane, and it also runs some heuristics to determine how satisfied passengers might be with their seating.
