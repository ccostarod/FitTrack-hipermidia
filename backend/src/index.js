const express = require("express");
const cors = require("cors");
const alunoRoutes = require("./routes/alunoRoutes");

const app = express();
const fullUrl = process.env.URL || "http://localhost:3000";
const parsedUrl = new URL(fullUrl);
const PORT = parsedUrl.port || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/alunos", alunoRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "FitTrack API - Academia/Alunos",
    endpoints: {
      alunos: "/alunos",
      swagger: "Em desenvolvimento",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: ${fullUrl}`);
});

module.exports = app;
