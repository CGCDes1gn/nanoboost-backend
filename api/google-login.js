export default async function handler(req, res) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;

  const redirectUri = "https://project-old7j.vercel.app/api/google-callback";

  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "https://www.googleapis.com/auth/cloud-platform",
      access_type: "offline",
      prompt: "consent"
    });

  return res.redirect(url);
}
