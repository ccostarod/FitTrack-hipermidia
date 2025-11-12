class Aluno {
  constructor(data) {
    this.nome = data.nome;
    this.plano = data.plano;
    this.objetivo = data.objetivo;
    this.imc = data.imc;
    this.freqSemanal = data.freqSemanal;
    this.vencimento = data.vencimento;
    this.ativo = data.ativo !== undefined ? data.ativo : true;
    this.id = data.id || Date.now().toString();
  }

  validate() {
    const errors = [];

    // Validação do nome (required)
    if (!this.nome || this.nome.trim() === '') {
      errors.push('O campo "nome" é obrigatório');
    }

    // Validação do IMC (>=10)
    if (this.imc !== undefined && this.imc !== null) {
      if (typeof this.imc !== 'number' || this.imc < 10) {
        errors.push('O campo "imc" deve ser um número maior ou igual a 10');
      }
    }

    // Validação da frequência semanal (0-7)
    if (this.freqSemanal !== undefined && this.freqSemanal !== null) {
      if (
        typeof this.freqSemanal !== 'number' ||
        this.freqSemanal < 0 ||
        this.freqSemanal > 7
      ) {
        errors.push('O campo "freqSemanal" deve ser um número entre 0 e 7');
      }
    }

    // Validação da data de vencimento
    if (this.vencimento) {
      const date = new Date(this.vencimento);
      if (isNaN(date.getTime())) {
        errors.push('O campo "vencimento" deve ser uma data válida');
      }
    }

    // Validação do campo ativo (boolean)
    if (this.ativo !== undefined && typeof this.ativo !== 'boolean') {
      errors.push('O campo "ativo" deve ser um valor booleano');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

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
