const Aluno = require("../models/Aluno");
const db = require("../database");

// Service - é onde fica a lógica de negócio e a comunicação com o banco de dados
// Separar assim deixa o código mais organizado e fácil de manter
class AlunoService {
  constructor() {
    this.initializeWithSampleData();
  }

  // Adiciona um aluno de exemplo se o banco estiver vazio
  // Isso facilita pra testar a API sem precisar criar alunos manualmente
  initializeWithSampleData() {
    const count = db.prepare("SELECT COUNT(*) as count FROM alunos").get();

    if (count.count === 0) {
      const aluno = new Aluno({
        nome: "Marina",
        plano: "Mensal",
        objetivo: "Hipertrofia",
        imc: 22.5,
        freqSemanal: 4,
        vencimento: "2025-12-05",
        ativo: true,
      });

      // Prepared statement - mais seguro contra SQL Injection
      db.prepare(
        `
        INSERT INTO alunos (id, nome, plano, objetivo, imc, freqSemanal, vencimento, ativo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        aluno.id,
        aluno.nome,
        aluno.plano,
        aluno.objetivo,
        aluno.imc,
        aluno.freqSemanal,
        aluno.vencimento,
        aluno.ativo ? 1 : 0 // Converte boolean pra 0 ou 1 (SQLite não tem boolean)
      );
    }
  }

  // Busca todos os alunos com filtros opcionais
  getAll(filters = {}, ordenacao = null) {
    // Começa a query com WHERE 1=1 pra facilitar adicionar condições depois
    let query = "SELECT * FROM alunos WHERE 1=1";
    const params = [];

    // Filtro por plano (case insensitive)
    if (filters.plano) {
      query += " AND LOWER(plano) = LOWER(?)";
      params.push(filters.plano);
    }

    // Filtro por status ativo/inativo
    if (filters.ativo !== undefined) {
      const ativoFilter = filters.ativo === "true" || filters.ativo === true;
      query += " AND ativo = ?";
      params.push(ativoFilter ? 1 : 0);
    }

    // Ordena por vencimento se solicitado
    if (ordenacao === "vencimento_asc") {
      query += " ORDER BY vencimento ASC";
    }

    const rows = db.prepare(query).all(...params);

    // Converte o campo ativo de 0/1 pra false/true
    return rows.map((row) => ({
      id: row.id,
      nome: row.nome,
      plano: row.plano,
      objetivo: row.objetivo,
      imc: row.imc,
      freqSemanal: row.freqSemanal,
      vencimento: row.vencimento,
      ativo: row.ativo === 1,
    }));
  }

  // Busca um aluno pelo ID
  getById(id) {
    const row = db.prepare("SELECT * FROM alunos WHERE id = ?").get(id);
    if (!row) return null;

    return {
      id: row.id,
      nome: row.nome,
      plano: row.plano,
      objetivo: row.objetivo,
      imc: row.imc,
      freqSemanal: row.freqSemanal,
      vencimento: row.vencimento,
      ativo: row.ativo === 1,
    };
  }

  // Cria um novo aluno
  create(data) {
    const aluno = new Aluno(data);
    const validation = aluno.validate();

    // Se a validação falhar, retorna os erros
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Insere no banco de dados
    db.prepare(
      `
      INSERT INTO alunos (id, nome, plano, objetivo, imc, freqSemanal, vencimento, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      aluno.id,
      aluno.nome,
      aluno.plano,
      aluno.objetivo,
      aluno.imc,
      aluno.freqSemanal,
      aluno.vencimento,
      aluno.ativo ? 1 : 0
    );

    return {
      success: true,
      data: aluno.toJSON(),
    };
  }

  // Atualiza um aluno existente
  update(id, data) {
    // Primeiro verifica se o aluno existe
    const exists = db.prepare("SELECT id FROM alunos WHERE id = ?").get(id);
    if (!exists) {
      return {
        success: false,
        error: "Aluno não encontrado",
      };
    }

    // Cria um objeto Aluno com os novos dados pra validar
    const updatedData = { ...data, id };
    const aluno = new Aluno(updatedData);
    const validation = aluno.validate();

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    // Atualiza no banco
    db.prepare(
      `
      UPDATE alunos
      SET nome = ?, plano = ?, objetivo = ?, imc = ?, freqSemanal = ?, vencimento = ?, ativo = ?
      WHERE id = ?
    `
    ).run(
      aluno.nome,
      aluno.plano,
      aluno.objetivo,
      aluno.imc,
      aluno.freqSemanal,
      aluno.vencimento,
      aluno.ativo ? 1 : 0,
      id
    );

    return {
      success: true,
      data: aluno.toJSON(),
    };
  }

  // Remove um aluno
  delete(id) {
    const result = db.prepare("DELETE FROM alunos WHERE id = ?").run(id);

    // result.changes indica quantas linhas foram afetadas
    // Se for 0, o aluno não existia
    if (result.changes === 0) {
      return {
        success: false,
        error: "Aluno não encontrado",
      };
    }

    return {
      success: true,
      message: "Aluno removido com sucesso",
    };
  }
}

// Exporta uma instância única do service
const alunoService = new AlunoService();

module.exports = alunoService;
