export default async function handler(req, res) {
  const accessToken = process.env.VERTEX_ACCESS_TOKEN;

  const projectId = "project-9efb2e59-d82e-4d40-bfe";

  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: "Di hola en una frase corta" }]
        }
      ]
    })
  });

  const data = await response.json();

  return res.status(200).json(data);
}
