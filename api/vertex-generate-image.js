import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const prompt = req.body?.prompt || "A cinematic photo of a futuristic city";

    const PROJECT_ID = process.env.GCP_PROJECT_ID;
    const LOCATION = "us-central1";

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GCP_ACCESS_TOKEN.trim()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [
          {
            prompt: prompt
          }
        ],
        parameters: {
          sampleCount: 1
        }
      })
    });

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
