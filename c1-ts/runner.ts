import { AssignmentServer } from "./assignmentServer.ts";
import { loadTasks, loadVolunteers } from "./util.ts";

const main = async () => {
  const tasks = await loadTasks("tasks.csv");
  const volunteers = await loadVolunteers("volunteers.csv", tasks);
  const server = new AssignmentServer(tasks, volunteers);

  server.assignTasks();
  server.printAssignments();
};

main();
