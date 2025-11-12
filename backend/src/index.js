const express = require('express');
const cors = require('cors');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/alunos', alunoRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'FitTrack API - Academia/Alunos',
    endpoints: {
      alunos: '/alunos',
      swagger: 'Em desenvolvimento',
    },
  });
});

// Middleware de erro 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

module.exports = app;
