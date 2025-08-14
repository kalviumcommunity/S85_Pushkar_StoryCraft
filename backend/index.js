import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// POST endpoint to generate a story
app.post("/story", async (req, res) => {
  const { character, keywords, style, mode, length, tone, previousStory } = req.body;

  // Validate input
  if (!character || !keywords || !Array.isArray(keywords) || !style) {
    return res.status(400).json({ error: "Missing or invalid input fields" });
  }

  // Start constructing the base prompt
  let prompt = "";

  // Include one-shot or multi-shot examples if needed
  if (mode === "one-shot") {
    const exampleStory = `
Example:
Character: Alice
Keywords: magic, rabbit, clock
Style: whimsical
Story: Alice followed the white rabbit through the enchanted forest, discovering a magical clock that ticked backward, revealing hidden wonders.
    `;
    prompt += `You are Story Buddy, a creative short story generator.\n${exampleStory}\n`;
  } else if (mode === "multi-shot") {
    const examples = `
Example 1:
Character: Luna the mage
Keywords: castle, magic, friendship
Style: whimsical
Story: Luna the mage wandered through the enchanted castle, her wand glowing as she discovered new friends in every corner. Magic swirled around them, and laughter echoed through the halls.

Example 2:
Character: Arlo the knight
Keywords: dragon, forest, bravery
Style: adventurous
Story: Arlo ventured into the dark forest, sword in hand, ready to face the dragon. His courage never wavered, and he formed a bond with the dragon along the way.
    `;
    prompt += `You are Story Buddy, a creative short story generator.\n${examples}\n`;
  } else {
    // Zero-shot: just instructions
    prompt += `You are Story Buddy, a creative short story generator.\n`;
  }

  // Add dynamic user inputs
  prompt += `Now write a story using:\n- Character: ${character}\n- Keywords: ${keywords.join(", ")}\n- Style: ${style}\n`;

  if (length) {
    prompt += `- Length: ${length}\n`;
  }

  if (tone) {
    prompt += `- Tone: ${tone}\n`;
  }

  if (previousStory) {
    prompt += `- Continue this story: ${previousStory}\n`;
  }

  prompt += `Story should be engaging, use all keywords, and be under 150 words.`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt, stream: false })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ollama API error: ${text}`);
    }

    const data = await response.json();

    res.json({ story: data.response });
  } catch (error) {
    console.error("Error generating story:", error.message);
    res.status(500).json({ error: "Failed to generate story" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Story Buddy running on http://localhost:${PORT}`);
});
