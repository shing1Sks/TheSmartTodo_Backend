import express from "express";
import { parseTask } from "../utils/llm.js";
import {
  saveTask,
  updateTask,
  deleteTaskByHeading,
  getAllTasks,
} from "../utils/db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const parsed = await parseTask(prompt);

    let result = {};
    switch (parsed.command) {
      case "create":
        result = await saveTask(parsed.task);
        break;
      case "update":
        result = await updateTask(parsed.target, parsed.new_task);
        break;
      case "delete":
        result = await deleteTaskByHeading(parsed.target);
        break;
      default:
        return res.status(400).json({ error: "Unknown command from AI" });
    }

    res.json({ success: true, command: parsed.command, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process task command" });
  }
});

// Optional GET all tasks
router.get("/", async (req, res) => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

export default router;
