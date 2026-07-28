// api/chat.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OpenAI API key is not configured on the server."
      });
    }

    const userMessages = req.body.messages;

    if (!Array.isArray(userMessages)) {
      return res.status(400).json({
        error: "Invalid request. Expected a messages array."
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: userMessages,
        temperature: 0.7,
        max_tokens: 400
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Error from OpenAI."
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "No reply received from OpenAI."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "An error occurred while communicating with the AI."
    });
  }
}
