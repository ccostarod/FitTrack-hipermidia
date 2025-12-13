const Database = require("better-sqlite3");
const path = require("path");

// Cria ou abre o banco de dados, cria em situação em que o banco de dados não existe.
const dbName = process.env.DB_FILENAME || "fittrack.db";
const db = new Database(path.join(__dirname, "..", dbName));

// Cria a tabela de alunos se ela não existir
// Usamos TEXT pro id pq vamos usar timestamp como identificador único de cada aluno.
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
// OBS:  Como o SQLite não tem tipo boolean, usamos INTEGER (0 = false, 1 = true)

module.exports = db;
