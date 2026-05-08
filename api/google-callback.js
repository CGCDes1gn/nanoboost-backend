export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Falta code de Google");
  }

  return res.status(200).send(`
    <h2>Login Google conectado ✅</h2>
    <p>Código recibido correctamente.</p>
    <p>Ahora falta cambiar este código por access token.</p>
  `);
}
