import { saveUserToken } from "./google-token-store.js";
export default async function handler(req, res) {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ error: "No llegó code desde Google" });
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: "https://project-old7j.vercel.app/api/google-callback",
        grant_type: "authorization_code"
      })
    });

    const data = await tokenRes.json();

    console.log("OAUTH TOKENS:", data);
    
    const userId = "demo-user"; // luego esto será dinámico
    saveUserToken(userId, data);

    if (!data.refresh_token && !data.access_token) {
  return res.status(500).json(data);
}

return res.send(`
  <h2>Google Cloud conectado ✅</h2>
  <p>Ya puedes volver a NanoBoost4k.</p>
`);
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
