# FitTrack - Sistema de Gerenciamento de Academia

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)

Sistema completo para gerenciamento de alunos de academia, desenvolvido com foco em hipermídia e boas práticas de desenvolvimento web.

## 📋 Sobre o Projeto

FitTrack é uma aplicação web para controle de alunos de academia, permitindo gerenciar informações como:

- Dados pessoais dos alunos
- Planos de assinatura (Mensal, Trimestral, Semestral, Anual)
- Objetivos e IMC
- Frequência semanal
- Datas de vencimento
- Status ativo/inativo

## 🚀 Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Better-SQLite3** - Banco de dados SQLite
- **CORS** - Cross-Origin Resource Sharing

### Frontend

- **HTML5** - Estrutura
- **CSS3** - Estilização (Vanilla CSS)
- **JavaScript** - Lógica (Vanilla JS)

## 📁 Estrutura do Projeto

```
FitTrack-hipermidia/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── database.js
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── fittrack.db
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── env.example.js
│   └── .gitignore
│
└── README.md
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- **Node.js** versão 20 ou superior
- **npm** (geralmente vem com Node.js)
- Navegador web moderno (Chrome, Firefox, Edge, etc.)

### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd FitTrack-hipermidia
```

### 2. Configuração do Backend

#### 2.1. Instale as Dependências

```bash
cd backend
npm install
```

#### 2.2. Configure as Variáveis de Ambiente

Crie um arquivo `.env` a partir do `.env.example`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
URL=http://localhost:3000
DB_FILENAME=fittrack.db
```

#### 2.3. Inicie o Servidor Backend

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

O backend estará rodando em `http://localhost:3000`

### 3. Configuração do Frontend

#### 3.1. Configure as Variáveis de Ambiente

Navegue até a pasta frontend e crie um arquivo `env.js` a partir do `env.example.js`:

```bash
cd ../frontend

# Windows (PowerShell)
Copy-Item env.example.js env.js

# Linux/Mac
cp env.example.js env.js
```

Edite o arquivo `env.js` se necessário:

```javascript
window.env = {
  API_URL: "http://localhost:3000/alunos",
};
```

#### 3.2. Abra o Frontend

Simplesmente abra o arquivo `index.html` no seu navegador:

```bash
# Windows
start index.html

# Linux
xdg-open index.html

# Mac
open index.html
```

Ou arraste o arquivo `index.html` para o navegador.

## 📖 Uso da Aplicação

### Backend - API REST

A API possui os seguintes endpoints:

| Método | Endpoint                          | Descrição                 |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/alunos`                         | Lista todos os alunos     |
| GET    | `/alunos?plano=Mensal&ativo=true` | Lista alunos com filtros  |
| GET    | `/alunos/:id`                     | Busca um aluno específico |
| POST   | `/alunos`                         | Cria um novo aluno        |
| PUT    | `/alunos/:id`                     | Atualiza um aluno         |
| DELETE | `/alunos/:id`                     | Remove um aluno           |

#### Exemplo de Requisição (POST /alunos)

```json
{
  "nome": "João Silva",
  "plano": "Mensal",
  "objetivo": "Emagrecimento",
  "imc": 25.5,
  "freqSemanal": 4,
  "vencimento": "2025-12-01",
  "ativo": true
}
```

#### Campos e Regras de Validação

| Campo       | Tipo    | Regras          |
| ----------- | ------- | --------------- |
| nome        | string  | Obrigatório     |
| plano       | string  | Opcional        |
| objetivo    | string  | Opcional        |
| imc         | number  | Opcional, >= 10 |
| freqSemanal | number  | Opcional, 0-7   |
| vencimento  | date    | Opcional        |
| ativo       | boolean | Opcional        |

### Frontend - Interface Web

1. **Visualizar Alunos**: A lista é carregada automaticamente
2. **Filtrar**: Use os filtros de plano e status no topo
3. **Adicionar Aluno**: Clique em "Adicionar Aluno"
4. **Editar Aluno**: Clique em "Editar" no card do aluno
5. **Excluir Aluno**: Clique em "Excluir" no card do aluno

## 🎨 Características Visuais

- Design moderno e responsivo
- Cards com indicadores visuais de status (verde para ativo, vermelho para inativo)
- Animações suaves e micro-interações
- Modal com efeitos de fade e slide
- Botões com hover effects
- Custom select dropdown
- Formulário validado

## 🔐 Segurança

- Variáveis de ambiente separadas (`.env` no backend, `env.js` no frontend)
- Arquivos sensíveis no `.gitignore`
- Validação de dados no backend
- CORS configurado
- Proteção contra SQL Injection (usando prepared statements)

## 🛠️ Scripts Disponíveis

### Backend

```bash
npm run dev   # Inicia em modo desenvolvimento com hot-reload
npm start     # Inicia em modo produção
```

## 📝 Desenvolvimento

### Boas Práticas Implementadas

1. **Separação de Responsabilidades**: Controllers, Services, Models
2. **Código Limpo**: Nomenclatura clara e consistente
3. **Versionamento**: Git com .gitignore apropriado
4. **Segurança**: Variáveis de ambiente
5. **UX**: Feedback visual para todas as ações
6. **Responsividade**: Layout adaptável

### Estrutura Backend (MVC)

- **Controllers**: Gerenciam requisições HTTP
- **Services**: Lógica de negócio
- **Models**: Interação com banco de dados
- **Routes**: Definição de rotas da API

## 🐛 Solução de Problemas

### Backend não inicia

- Verifique se o Node.js está instalado: `node --version`
- Verifique se as dependências estão instaladas: `npm install`
- Verifique se o arquivo `.env` existe e está configurado

### Frontend não conecta ao Backend

- Verifique se o backend está rodando em `http://localhost:3000`
- Verifique o arquivo `env.js` no frontend
- Verifique o console do navegador (F12) para erros

### Erro de CORS

- Certifique-se de que o backend está configurado com CORS habilitado
- O backend já vem configurado por padrão

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais na disciplina de Hipermídia.

## 👥 Autor

Desenvolvido como projeto acadêmico.

## 🙏 Agradecimentos

- Disciplina de Hipermídia
- Comunidade Node.js
- Documentação do MDN Web Docs

---

**Nota**: Este é um projeto educacional e não deve ser usado em produção sem as devidas melhorias de segurança e testes.
