import { Task } from "./task.ts";
import { Volunteer } from "./volunteer.ts";

class AssignmentServer {
  tasks: Record<number, Task>;
  volunteers: Record<number, Volunteer>;
  assignments: Map<Task, Volunteer>;

  constructor(
    tasks: Record<number, Task>,
    volunteers: Record<number, Volunteer>
  ) {
    this.tasks = tasks;
    this.volunteers = volunteers;
    this.assignments = new Map();
  }

  /**
   * Returns a list of volunteers who are interested in the given task.
   */
  getInterestedVolunteers(task: Task): Volunteer[] {
    return Object.values(this.volunteers).filter((volunteer) => {
      return volunteer.isInterested(task);
    })
  }

  /**
   * Assigns a volunteer to each task based on their interests.
   */
  assignTasks() {
    for (const task of Object.values(this.tasks)) {
      const interestedVolunteers = this.getInterestedVolunteers(task)
      if (interestedVolunteers.length > 0) {
        this.assignments.set(task, interestedVolunteers[0]);
      } else {
        this.assignments.set(task, Object.values(this.volunteers)[0]);
      }
    }
  }

  /**
   * Prints assignments of volunteers to tasks.
   */
  printAssignments() {
    for (const task of Object.values(this.tasks)) {
      const assignee = this.assignments.get(task);
      console.log(`${task}`);
      if (assignee !== undefined) {
        console.log(`\tAssigned to ${assignee}`);
      } else {
        console.log("\tUnassigned");
      }
      console.log();
    }
  }
}

export { AssignmentServer };
