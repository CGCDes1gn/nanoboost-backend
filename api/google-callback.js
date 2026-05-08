export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Falta code de Google");
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  const redirectUri = "https://project-old7j.vercel.app/api/google-callback";

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    })
  });

  const data = await tokenRes.json();

  return res.status(200).send(`
    <h2>Login completo ✅</h2>
    <pre>${JSON.stringify(data, null, 2)}</pre>
  `);
}
