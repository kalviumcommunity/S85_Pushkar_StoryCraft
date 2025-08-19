import { useState } from "react";
import axios from "axios";

export default function StoryForm() {
  const [character, setCharacter] = useState("");
  const [keywords, setKeywords] = useState("");
  const [style, setStyle] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/story", {
        character,
        keywords: keywords.split(",").map(k => k.trim()),
        style
      });
      setStory(res.data.story);
    } catch (err) {
      console.error(err);
      setStory("Error generating story.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">📖 StoryCraft</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Character"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Style (e.g., funny, spooky, poetic)"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Generate Story
        </button>
      </form>

      {story && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="font-semibold mb-2">Your Story:</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}
