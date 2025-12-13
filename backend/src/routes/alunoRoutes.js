const express = require("express");
const alunoController = require("../controllers/alunoController");

// Router do Express, serve pra agrupar rotas relacionadas  
const router = express.Router();

// Aqui definimos as rotas seguindo o padrão REST e também seguindo o que foi especificado no site:
// - GET = buscar dados
// - POST = criar novo registro
// - PUT = atualizar registro existente
// - DELETE = remover registro

router.get("/", (req, res) => alunoController.getAll(req, res)); // Lista todos

router.get("/:id", (req, res) => alunoController.getById(req, res)); // Busca por ID

router.post("/", (req, res) => alunoController.create(req, res)); // Cria novo

router.put("/:id", (req, res) => alunoController.update(req, res)); // Atualiza

router.delete("/:id", (req, res) => alunoController.delete(req, res)); // Deleta

module.exports = router;
