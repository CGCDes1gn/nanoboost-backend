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

    // ✅ validar primero
    if (!data.refresh_token && !data.access_token) {
      return res.status(500).json(data);
    }

    // ✅ guardar en Supabase
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/google_tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        user_id: "demo-user",
        refresh_token: data.refresh_token,
        access_token: data.access_token
      })
    });

    return res.send(`
      <h2>Google Cloud conectado ✅</h2>
      <p>Ya puedes volver a NanoBoost4k.</p>
    `);

  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
