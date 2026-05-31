async function getRefreshTokenFromSupabase(user_id) {
  const res = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/google_tokens?user_id=eq.${user_id}&select=refresh_token`,
    {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );

  const rows = await res.json();

  if (!rows?.[0]?.refresh_token) {
    throw new Error("No hay refresh_token guardado en Supabase para user_id: " + user_id);
  }

  return rows[0].refresh_token;
}

async function getAccessTokenFromRefreshToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error("No se pudo renovar access token: " + JSON.stringify(data));
  }

  return data.access_token;
}

export default async function handler(req, res) {
  try {
    const { user_id, model, prompt, aspectRatio, imageSize } = req.body || {};

    if (!user_id) throw new Error("No llegó user_id desde el plugin");
    if (!prompt) throw new Error("No llegó prompt desde el plugin");

    const modelMap = {
      "gemini-3-pro-image-preview": "gemini-3-pro-image",
      "gemini-3.1-flash-image-preview": "gemini-3.1-flash-image",
      "gemini-2.5-flash-image": "gemini-2.5-flash-image"
    };

    const finalModel = modelMap[model] || "gemini-3.1-flash-image";

    const PROJECT_ID = process.env.GCP_PROJECT_ID;
    const LOCATION = "us-central1";

    const refreshToken = await getRefreshTokenFromSupabase(user_id);
    const accessToken = await getAccessTokenFromRefreshToken(refreshToken);

    const url = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${finalModel}:generateContent`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
          temperature: 0.6,
          imageConfig: {
            imageSize: imageSize || "2K",
            aspectRatio: aspectRatio || "1:1"
          }
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("VERTEX ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
