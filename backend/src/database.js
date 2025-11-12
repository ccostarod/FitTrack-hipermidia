const Database = require('better-sqlite3');
const path = require('path');

// Criar/conectar ao banco
const db = new Database(path.join(__dirname, '..', 'fittrack.db'));

// Criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    plano TEXT,
    objetivo TEXT,
    imc REAL,
    freqSemanal INTEGER,
    vencimento TEXT,
    ativo INTEGER DEFAULT 1
  )
`);

module.exports = db;
