import { Router } from "express";
import { parseTask } from "../utils/llm.js";

const agentRouter = Router();

// Define your routes here
agentRouter.post("/", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const taskJSON = await parseTask(prompt);
    res.json(taskJSON);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to parse task" });
  }
});

export default agentRouter;
