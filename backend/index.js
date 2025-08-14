import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

app.post("/story", async (req, res) => {
  const { character, keywords, style } = req.body;

  const prompt = `
  You are Story Buddy, a creative short story generator.
  Write a short story using:
  - Character: ${character}
  - Keywords: ${keywords.join(", ")}
  - Style: ${style}
  Story should be engaging, use all keywords, and be under 150 words.
  `;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt, stream: false }) // <— disable streaming
    });

    // Now it's safe to parse as JSON
    const data = await response.json();

    res.json({ story: data.response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () =>
  console.log("Story Buddy running on http://localhost:3000")
);
