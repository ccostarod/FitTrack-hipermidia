const express = require('express');
const alunoController = require('../controllers/alunoController');

const router = express.Router();

// GET /alunos - Listar todos os alunos (com filtros opcionais)
router.get('/', (req, res) => alunoController.getAll(req, res));

// GET /alunos/:id - Buscar aluno por ID
router.get('/:id', (req, res) => alunoController.getById(req, res));

// POST /alunos - Criar novo aluno
router.post('/', (req, res) => alunoController.create(req, res));

// PUT /alunos/:id - Atualizar aluno
router.put('/:id', (req, res) => alunoController.update(req, res));

// DELETE /alunos/:id - Deletar aluno
router.delete('/:id', (req, res) => alunoController.delete(req, res));

module.exports = router;
