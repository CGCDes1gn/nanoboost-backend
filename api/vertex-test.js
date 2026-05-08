export default async function handler(req, res) {
  return res.status(200).json({
    ok: true,
    step: "Listo para conectar Vertex",
    falta: "Ahora necesitamos el PROJECT_ID de Google Cloud"
  });
}
