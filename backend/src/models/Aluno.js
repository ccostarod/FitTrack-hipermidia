// Classe presente no models, serve para representa um Aluno, onde organiza os dados e validamos antes de salvar.
class Aluno {
  constructor(data) {
    this.nome = data.nome;
    this.plano = data.plano;
    this.objetivo = data.objetivo;
    this.imc = data.imc;
    this.freqSemanal = data.freqSemanal;
    this.vencimento = data.vencimento;
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    // Gera um ID único usando o timestamp atual (em milissegundos)
    this.id = data.id || Date.now().toString();
  }

  // Método pra validar os dados do aluno antes de salvar no banco sqlite
  validate() {
    const errors = [];

    // Nome é o único campo obrigatório, seguindo o site.
    if (!this.nome || this.nome.trim() === "") {
      errors.push('O campo "nome" é obrigatório');
    }

    // IMC tinha que ser um número válido (maior que 10)
    if (this.imc !== undefined && this.imc !== null) {
      if (typeof this.imc !== "number" || this.imc < 10) {
        errors.push('O campo "imc" deve ser um número maior ou igual a 10');
      }
    }

    // Frequência semanal só pode ser de 0 a 7 dias
    if (this.freqSemanal !== undefined && this.freqSemanal !== null) {
      if (
        typeof this.freqSemanal !== "number" ||
        this.freqSemanal < 0 ||
        this.freqSemanal > 7
      ) {
        errors.push('O campo "freqSemanal" deve ser um número entre 0 e 7');
      }
    }

    // Valida se a data de vencimento é válida
    if (this.vencimento) {
      const date = new Date(this.vencimento);
      if (isNaN(date.getTime())) {
        errors.push('O campo "vencimento" deve ser uma data válida');
      }
    }

    // Campo ativo tem que ser booleano
    if (this.ativo !== undefined && typeof this.ativo !== "boolean") {
      errors.push('O campo "ativo" deve ser um valor booleano');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Converte o objeto pra JSON, que é pra retornar na API
  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      plano: this.plano,
      objetivo: this.objetivo,
      imc: this.imc,
      freqSemanal: this.freqSemanal,
      vencimento: this.vencimento,
      ativo: this.ativo,
    };
  }
}

module.exports = Aluno;
