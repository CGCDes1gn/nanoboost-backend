export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Falta code de Google");
  }

  return res.status(200).send("Código recibido: " + code);
}
