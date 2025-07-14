import axios from "axios";

const SYSTEM_PROMPT = `
You are a task planner AI. 
Convert natural language input into structured JSON with the following fields:

{
  "command": "create" | "update" | "delete",
  "heading": string,
  "task": string,
  "subtasks": string[] | [],
  "reminder": {
    "type": "once" | "weekly" | "monthly" | null,
    "time": string | null
  }
}

Respond ONLY with the JSON object. Do not include any explanations.
`;

export async function parseTask(userPrompt) {
  const res = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
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

  raw = raw.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/```(?:json)?\s*([\s\S]*?)\s*```/, "$1");
  }

  return JSON.parse(raw);
}
