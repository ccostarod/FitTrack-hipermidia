// Importando o express - é o framework que facilita criar APIs em Node.js
const express = require("express");
// CORS é pra permitir que o frontend acesse o backend mesmo estando em portas diferentes
const cors = require("cors");
const alunoRoutes = require("./routes/alunoRoutes");

const app = express();
const fullUrl = process.env.URL || "http://localhost:3000";
const parsedUrl = new URL(fullUrl);
const PORT = parsedUrl.port || 3000;

// Middlewares - são funções que rodam antes das rotas
app.use(cors()); // Habilita CORS pra todas as origens (senão o navegador bloqueia as requisições)
app.use(express.json()); // Permite receber JSON no body das requisições
app.use(express.urlencoded({ extended: true })); // Permite receber dados de formulário

// Todas as rotas de /alunos vão pro arquivo alunoRoutes
app.use("/alunos", alunoRoutes);

// Rota principal da API - só retorna uma mensagem de boas vindas
app.get("/", (req, res) => {
  res.json({
    message: "FitTrack API - Academia/Alunos",
    endpoints: {
      alunos: "/alunos",
      swagger: "Em desenvolvimento",
    },
  });
});

// Middleware pra quando a rota não existe - retorna 404
app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
  });
});

// Middleware de erro geral - pega qualquer erro que acontecer na aplicação
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erro interno do servidor",
    message: err.message,
  });
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: ${fullUrl}`);
});

module.exports = app;
