export default async function handler(req, res) {
  const code = req.query.code;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      redirect_uri: "https://project-old7j.vercel.app/api/google-callback",
      grant_type: "authorization_code"
    })
  });

  const data = await tokenRes.json();

  console.log("OAUTH TOKENS:", data);

  return res.send("Conectado correctamente. Puedes volver al plugin.");
}
