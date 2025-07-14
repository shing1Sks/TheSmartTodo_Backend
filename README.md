# 🧠 Smart Tasks Backend (MCP AI-Powered Task Manager)

This is the backend for **Smart Tasks**, an AI-driven task organizer that uses Groq's LLM to parse natural language inputs into structured task commands.

---

## 📦 Tech Stack

- Node.js
- Express
- Groq API (LLaMA 3)
- Local JSON file as DB
- dotenv

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/smart-tasks-backend.git
cd smart-tasks-backend
npm install
```

### 2. Setup `.env`

Create a `.env` file with your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Start the server

```bash
node app.js
```

Server runs on: `http://localhost:5000`

---

## 🧠 API Endpoints

### `POST /parse-task`

Parses a natural language prompt and executes the command (`create`, `update`, `delete`).

**Request:**

```json
{
  "prompt": "Remind me to call mom every Sunday at 9am"
}
```

**Response:**

```json
{
  "success": true,
  "command": "create",
  "result": { ... }
}
```

---

### `GET /parse-task`

Fetches all saved tasks.

---

## 📁 File Structure

```
backend/
├── app.js
├── routes/
│   └── agent.js
├── utils/
│   ├── db.js
│   └── groq.js
├── store/
│   └── tasks.json
├── .env
```

---

## 📌 Notes

- All tasks are stored in `store/tasks.json`
- You can extend this easily to use a real DB like MongoDB or PostgreSQL
- Supports full MCP-style flow with AI-driven command execution
