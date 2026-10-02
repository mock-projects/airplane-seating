import { AssignmentServer } from "./assignmentServer.mts";
import { loadTasks, loadVolunteers } from "./util.mts";

const main = async () => {
  const tasks = await loadTasks("tasks.csv");
  const volunteers = await loadVolunteers("volunteers.csv", tasks);
  const server = new AssignmentServer(tasks, volunteers);

  server.assignTasks();
  server.printAssignments();
};

main();
