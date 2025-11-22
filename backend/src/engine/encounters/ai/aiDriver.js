import OpenAI from "openai";
import config from "../../../config.js";

let client = null;
if (config.aiEnabled) {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// If AI not enabled, return null.
export async function getAIResponse(prompt) {
  if (!config.aiEnabled) {
    return {
      npc: "Mysterious Stranger",
      text: "You meet someone interesting, but nothing unusual happens.",
      choices: [
        { label: "Nod politely", tag: "[retreat]" },
        { label: "Strike up a chat", tag: "[flirt]" },
        { label: "Walk away", tag: "[retreat]" }
      ]
    };
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      max_tokens: 250,
      messages: [
        { role: "system", content: "You write retro 90s text RPG encounters." },
        { role: "user", content: prompt }
      ]
    });

    const out = JSON.parse(response.choices[0].message.content);
    return out;

  } catch (err) {
    console.error("AI error:", err.message);

    return {
      npc: "Glitched Stranger",
      text: "Something feels… off. The air distorts, as if reality hiccups.",
      choices: [

