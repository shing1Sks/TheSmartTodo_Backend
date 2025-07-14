import fs from "fs/promises";

const DB_PATH = "./store/tasks.json";

export async function getAllTasks() {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function saveTask(task) {
  const tasks = await getAllTasks();
  const newTask = { id: Date.now(), ...task };

  // Add new task at the top
  const updatedTasks = [newTask, ...tasks];

  // Keep only the latest 10 tasks
  const trimmedTasks = updatedTasks.slice(0, 10);

  await fs.writeFile(DB_PATH, JSON.stringify(trimmedTasks, null, 2));
  return newTask;
}

export async function updateTask(targetHeading, newTaskData) {
  const tasks = await getAllTasks();
  const updated = tasks.map((t) =>
    t.heading.toLowerCase() === targetHeading.toLowerCase()
      ? { ...t, ...newTaskData }
      : t
  );
  await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
  return updated;
}

export async function deleteTaskByHeading(targetHeading) {
  const tasks = await getAllTasks();
  const filtered = tasks.filter(
    (t) => t.heading.toLowerCase() !== targetHeading.toLowerCase()
  );
  await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
  return filtered;
}
