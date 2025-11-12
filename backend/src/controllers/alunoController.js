const alunoService = require('../services/alunoService');

class AlunoController {
  // GET /alunos
  getAll(req, res) {
    try {
      const { plano, ativo } = req.query;
      const filters = {};

      if (plano) filters.plano = plano;
      if (ativo !== undefined) filters.ativo = ativo;

      // Ordenação padrão por vencimento ascendente
      const alunos = alunoService.getAll(filters, 'vencimento_asc');

      res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar alunos',
        message: error.message,
      });
    }
  }

  // GET /alunos/:id
  getById(req, res) {
    try {
      const { id } = req.params;
      const aluno = alunoService.getById(id);

      if (!aluno) {
        return res.status(404).json({
          error: 'Aluno não encontrado',
        });
      }

      res.status(200).json(aluno);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao buscar aluno',
        message: error.message,
      });
    }
  }

  // POST /alunos
  create(req, res) {
    try {
      const result = alunoService.create(req.body);

      if (!result.success) {
        return res.status(400).json({
          error: 'Erro de validação',
          errors: result.errors,
        });
      }

      res.status(201).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao criar aluno',
        message: error.message,
      });
    }
  }

  // PUT /alunos/:id
  update(req, res) {
    try {
      const { id } = req.params;
      const result = alunoService.update(id, req.body);

      if (!result.success) {
        const statusCode = result.error === 'Aluno não encontrado' ? 404 : 400;
        return res.status(statusCode).json({
          error: result.error || 'Erro de validação',
          errors: result.errors,
        });
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao atualizar aluno',
        message: error.message,
      });
    }
  }

  // DELETE /alunos/:id
  delete(req, res) {
    try {
      const { id } = req.params;
      const result = alunoService.delete(id);

      if (!result.success) {
        return res.status(404).json({
          error: result.error,
        });
      }

      res.status(200).json({
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Erro ao deletar aluno',
        message: error.message,
      });
    }
  }
}

module.exports = new AlunoController();
