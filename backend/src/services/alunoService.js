const Aluno = require('../models/Aluno');
const db = require('../database');

class AlunoService {
  constructor() {
    this.initializeWithSampleData();
  }

  initializeWithSampleData() {
    // Adicionar dados de exemplo se banco estiver vazio
    const count = db.prepare('SELECT COUNT(*) as count FROM alunos').get();

    if (count.count === 0) {
      const aluno = new Aluno({
        nome: 'Marina',
        plano: 'Mensal',
        objetivo: 'Hipertrofia',
        imc: 22.5,
        freqSemanal: 4,
        vencimento: '2025-12-05',
        ativo: true,
      });

      db.prepare(`
        INSERT INTO alunos (id, nome, plano, objetivo, imc, freqSemanal, vencimento, ativo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(aluno.id, aluno.nome, aluno.plano, aluno.objetivo, aluno.imc, aluno.freqSemanal, aluno.vencimento, aluno.ativo ? 1 : 0);
    }
  }

  getAll(filters = {}, ordenacao = null) {
    let query = 'SELECT * FROM alunos WHERE 1=1';
    const params = [];

    // Aplicar filtros
    if (filters.plano) {
      query += ' AND LOWER(plano) = LOWER(?)';
      params.push(filters.plano);
    }

    if (filters.ativo !== undefined) {
      const ativoFilter = filters.ativo === 'true' || filters.ativo === true;
      query += ' AND ativo = ?';
      params.push(ativoFilter ? 1 : 0);
    }

    // Aplicar ordenação
    if (ordenacao === 'vencimento_asc') {
      query += ' ORDER BY vencimento ASC';
    }

    const rows = db.prepare(query).all(...params);

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

  getById(id) {
    const row = db.prepare('SELECT * FROM alunos WHERE id = ?').get(id);

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

  create(data) {
    const aluno = new Aluno(data);
    const validation = aluno.validate();

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    db.prepare(`
      INSERT INTO alunos (id, nome, plano, objetivo, imc, freqSemanal, vencimento, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(aluno.id, aluno.nome, aluno.plano, aluno.objetivo, aluno.imc, aluno.freqSemanal, aluno.vencimento, aluno.ativo ? 1 : 0);

    return {
      success: true,
      data: aluno.toJSON(),
    };
  }

  update(id, data) {
    const exists = db.prepare('SELECT id FROM alunos WHERE id = ?').get(id);

    if (!exists) {
      return {
        success: false,
        error: 'Aluno não encontrado',
      };
    }

    const updatedData = { ...data, id };
    const aluno = new Aluno(updatedData);
    const validation = aluno.validate();

    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
      };
    }

    db.prepare(`
      UPDATE alunos
      SET nome = ?, plano = ?, objetivo = ?, imc = ?, freqSemanal = ?, vencimento = ?, ativo = ?
      WHERE id = ?
    `).run(aluno.nome, aluno.plano, aluno.objetivo, aluno.imc, aluno.freqSemanal, aluno.vencimento, aluno.ativo ? 1 : 0, id);

    return {
      success: true,
      data: aluno.toJSON(),
    };
  }

  delete(id) {
    const result = db.prepare('DELETE FROM alunos WHERE id = ?').run(id);

    if (result.changes === 0) {
      return {
        success: false,
        error: 'Aluno não encontrado',
      };
    }

    return {
      success: true,
      message: 'Aluno removido com sucesso',
    };
  }
}

const alunoService = new AlunoService();

module.exports = alunoService;
