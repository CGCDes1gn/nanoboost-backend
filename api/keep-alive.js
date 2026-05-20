export default async function handler(req, res) {
  try {
    await fetch(process.env.SUPABASE_URL + "/rest/v1/google_tokens?select=user_id&limit=1", {
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    return res.status(200).json({ ok: true, message: "Supabase activo" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
