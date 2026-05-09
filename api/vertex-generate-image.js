import fetch from "node-fetch";

async function getAccessTokenFromRefreshToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token"
    })
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error("No se pudo renovar access token: " + JSON.stringify(data));
  }

  return data.access_token;
}

// 👇 TU HANDLER
export default async function handler(req, res) {
  try {
    const prompt = req.body?.prompt || "A cinematic photo of a futuristic city";
    const PROJECT_ID = process.env.GCP_PROJECT_ID;
    const LOCATION = "us-central1";

    // 👇 CAMBIO CLAVE
    const accessToken = await getAccessTokenFromRefreshToken();

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-002:predict`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`, // 👈 ya no usas GCP_ACCESS_TOKEN
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
