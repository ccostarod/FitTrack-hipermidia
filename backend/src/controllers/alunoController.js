const alunoService = require("../services/alunoService");

// Fizemos essa camada Controller para que ela seja a camada que recebe as requisições HTTP e retorna as respostas
// Ela não faz a lógica de negócio, só repassa pro Service que aí sim faz a lógica necessária.
class AlunoController {
  // GET /alunos - Lista todos os alunos (com filtros opcionais, que como definido no site, serão plano e ativo).
  getAll(req, res) {
    try {
      // Pega os filtros da query string (ex: /alunos?plano=Mensal&ativo=true)
      const { plano, ativo } = req.query;
      const filters = {};

      if (plano) filters.plano = plano;
      if (ativo !== undefined) filters.ativo = ativo;

      const alunos = alunoService.getAll(filters, "vencimento_asc");
      res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar alunos",
        message: error.message,
      });
    }
  }

  // GET /alunos/:id, serve para buscar um aluno específico pelo ID
  getById(req, res) {
    try {
      const { id } = req.params; // Pega o ID da URL para buscar o aluno
      const aluno = alunoService.getById(id);

      if (!aluno) {
        return res.status(404).json({
          error: "Aluno não encontrado",
        });
      }

      res.status(200).json(aluno);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao buscar aluno",
        message: error.message,
      });
    }
  }

  // POST /alunos, serve para criar um novo aluno através do body da requisição.
  create(req, res) {
    try {
      const result = alunoService.create(req.body);

      // Se a validação falhar, retorna 400 (Bad Request)
      if (!result.success) {
        return res.status(400).json({
          error: "Erro de validação",
          errors: result.errors,
        });
      }

      res.status(201).json(result.data); 
    } catch (error) {
      res.status(500).json({
        error: "Erro ao criar aluno",
        message: error.message,
      });
    }
  }

  // PUT /alunos/:id, serve para atualizar um aluno existente usando também o body da requisição.
  update(req, res) {
    try {
      const { id } = req.params;
      const result = alunoService.update(id, req.body);

      if (!result.success) {
        // Se o aluno não existe, retorna 404; se é erro de validação, retorna 400
        const statusCode = result.error === "Aluno não encontrado" ? 404 : 400;
        return res.status(statusCode).json({
          error: result.error || "Erro de validação",
          errors: result.errors,
        });
      }

      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({
        error: "Erro ao atualizar aluno",
        message: error.message,
      });
    }
  }

  // DELETE /alunos/:id, serve para remover um aluno através do ID da URL.
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
        error: "Erro ao deletar aluno",
        message: error.message,
      });
    }
  }
}

module.exports = new AlunoController();
