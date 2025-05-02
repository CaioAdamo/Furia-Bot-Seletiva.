const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/mensagem", async (req, res) => {
  const mensagem = req.body.mensagem;

  try {
    const prompt = `
      Responda apenas se a pergunta estiver relacionada ao time FURIA ou aos seus jogadores, modalidades ou torneios.
      Caso não tenha relação com a FURIA, responda: "Desculpe, só posso responder perguntas sobre a FURIA."

      Pergunta: ${mensagem}
    `;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDlIIe6P_ow4fnK0vvBy1s2sh1fkKzYqkE`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const respostaTexto = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
    res.json({ resposta: respostaTexto });

  } catch (error) {
    console.error("Erro ao processar a mensagem:", error.response?.data || error.message);
    res.status(500).json({ erro: "Não foi possível processar sua mensagem." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});







