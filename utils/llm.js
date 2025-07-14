import axios from "axios";
import { getAllTasks } from "./db.js";

const SYSTEM_PROMPT = `
You are a task manager AI agent.

You will receive a user's natural language instruction AND the current list of tasks.
Your job is to return a JSON object with:
- command: "create" | "update" | "delete"
- target (optional): the heading/title of task to update/delete
- task (for create): full task object
- new_task (for update): the updated task structure

Example formats:

CREATE:
{
  "command": "create",
  "task": {
    "heading": "Yoga",
    "task": "Daily morning yoga",
    "subtasks": ["Stretch", "Sun Salutation"],
    "reminder": { "type": "weekly", "time": "Mon 6:00 AM" }
  }
}

UPDATE:
{
  "command": "update",
  "target": "Yoga",
  "new_task": {
    "task": "Updated Yoga Routine",
    "reminder": { "type": "weekly", "time": "Tue 7:00 AM" }
  }
}

DELETE:
{
  "command": "delete",
  "target": "Yoga"
}

Respond ONLY with raw JSON. Do not include \`\`\`, explanations, or markdown.
`;

export async function parseTask(userPrompt) {
  const taskDB = await getAllTasks();

  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Current Tasks:\n${JSON.stringify(taskDB, null, 2)}`,
        },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  let raw = res.data.choices?.[0]?.message?.content || "";

  // Strip triple backticks if model adds them
  raw = raw.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1");
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse Groq output:\n", raw);
    throw err;
  }
}
