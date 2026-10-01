import * as fs from "fs";
import * as readline from "readline";
import { Task } from "./task.ts";
import { Volunteer } from "./volunteer.ts";

const loadTasks = async (filename: string) => {
  const tasks: Record<number, Task> = {};

  const reader = readline.createInterface({
    input: fs.createReadStream(filename),
  });

  for await (const line of reader) {
    const parsedLine = line.split(",");

    const taskId = parseInt(parsedLine[0]);
    const name = parsedLine[1];
    const description = parsedLine[3];

    // Skip invalid task IDs.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(taskId)) continue;

    // Create a new task given this data.
    tasks[taskId] = new Task(taskId, name, description);
  }

  return tasks;
};

const loadVolunteers = async (
  filename: string,
  tasks: Record<number, Task>
) => {
  const volunteers: Record<number, Volunteer> = {};

  const reader = readline.createInterface({
    input: fs.createReadStream(filename),
  });

  for await (const line of reader) {
    const parsedLine = line.split(",");

    const volunteerId = parseInt(parsedLine[0]);
    const name = parsedLine[1];
    // Entries after the second position in the CSV are task IDs.
    const taskIds = parsedLine[2]
      .split(" ")
      .map((id: string) => parseInt(id))
      .filter((id: number) => !isNaN(id));

    // Skip invalid volunteer IDs.
    // This is usually just the first row in the CSV, since it's a header.
    if (isNaN(volunteerId)) continue;

    // Create a new volunteer and add interested tasks.
    const volunteer = new Volunteer(volunteerId, name);
    taskIds
      .map((taskId: number) => tasks[taskId])
      .filter((task: Task) => task !== undefined)
      .forEach((task: Task) => volunteer.addInterestedTask(task));

    volunteers[volunteerId] = volunteer;
  }

  return volunteers;
};

export { loadTasks, loadVolunteers };
