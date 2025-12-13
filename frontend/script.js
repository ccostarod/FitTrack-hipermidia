// Pega a URL da API do arquivo env.js (ou usa localhost caso não tenha sido definida no arquivo)
const API_URL = window.env.API_URL || "http://localhost:3000/alunos";

// Seleção de elementos do DOM
const btnAddStudent = document.querySelector(".btn-add-student");
const modal = document.getElementById("modal-add-student");
const modalTitle = document.getElementById("modal-title");
const closeBtn = document.querySelector(".btn-close-modal");
const btnCancel = document.querySelector(".btn-cancel");
const form = document.getElementById("form-add-student");
const studentsList = document.getElementById("students-list");
const filterPlan = document.getElementById("filter-plan");
const filterActive = document.getElementById("filter-active");
const searchInput = document.getElementById("search-input");

// Variáveis de controle pro modal (se tá editando ou criando)
let isEditMode = false;
let currentStudentId = null;
let allStudents = []; // Guarda todos os alunos pra fazer busca local


// Aqui começa as funções do modal, essa primeira função abre o modal pra adicionar um novo aluno
function openModal() {
  isEditMode = false;
  currentStudentId = null;
  modalTitle.textContent = "Adicionar Novo Aluno";
  modal.classList.add("active");
}

// Abre o modal pra editar - preenche os campos com os dados do aluno
function openModalForEdit(student) {
  isEditMode = true;
  currentStudentId = student.id;
  modalTitle.textContent = "Editar Aluno";

  // Preenche os campos do formulário com os dados do aluno selecionado para que o usuário possa editar.
  document.getElementById("student-id").value = student.id;
  document.getElementById("student-name").value = student.nome;
  document.getElementById("student-plan").value = student.plano;
  document.getElementById("student-objective").value = student.objetivo || "";
  document.getElementById("student-imc").value = student.imc || "";
  document.getElementById("student-freq").value = student.freqSemanal || "";
  document.getElementById("student-due").value = student.vencimento || "";
  document.getElementById("student-active").checked = student.ativo;

  modal.classList.add("active");
}

// Fecha o modal e limpa o formulário para que o usuário possa criar um novo aluno.
function closeModal() {
  modal.classList.remove("active");
  form.reset();
  isEditMode = false;
  currentStudentId = null;
}

// Event listeners do modal
btnAddStudent.addEventListener("click", () => {
  form.reset();
  openModal();
});
closeBtn.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

// Fecha o modal se clicar fora dele
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Fecha o modal com a tecla ESC também, pensando na experiência do usuário.
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// Aqui é feita a validação dos campos do formulário, adicionando mensagens.
const studentNameInput = document.getElementById("student-name");
const studentImcInput = document.getElementById("student-imc");
const studentFreqInput = document.getElementById("student-freq");

// Validação do nome
studentNameInput.addEventListener("invalid", (e) => {
  e.target.setCustomValidity("Por favor, preencha o nome completo do aluno");
});

studentNameInput.addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});

// Validação do IMC
studentImcInput.addEventListener("invalid", (e) => {
  const value = parseFloat(e.target.value);
  if (value && value < 10) {
    e.target.setCustomValidity("O IMC deve ser maior ou igual a 10");
  } else {
    e.target.setCustomValidity("");
  }
});

studentImcInput.addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});

// Validação da frequência
studentFreqInput.addEventListener("invalid", (e) => {
  const value = parseInt(e.target.value);
  if (value < 0) {
    e.target.setCustomValidity("A frequência semanal não pode ser negativa");
  } else if (value > 7) {
    e.target.setCustomValidity(
      "A frequência semanal não pode ser maior que 7 dias"
    );
  } else {
    e.target.setCustomValidity("");
  }
});

studentFreqInput.addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});

// Aqui temos as funções de comunicação com a API (CRUD).
// Busca todos os alunos da API com os filtros aplicados
async function fetchStudents() {
  try {
    const plan = filterPlan.value;
    const active = filterActive.value;

    // Monta os parâmetros da URL (query string) para que seja possível filtrar os alunos.
    const params = new URLSearchParams();
    if (plan) params.append("plano", plan);
    if (active) params.append("ativo", active);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao buscar alunos");

    allStudents = await response.json();
    filterAndRenderStudents(); // Renderiza os alunos na tela
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar lista de alunos");
  }
}

// Filtra os alunos localmente pelo nome (sem precisar chamar a API de novo)
function filterAndRenderStudents() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  let filtered = allStudents;

  if (searchTerm) {
    filtered = filtered.filter((student) =>
      student.nome.toLowerCase().includes(searchTerm)
    );
  }

  renderStudents(filtered);
}

// Renderiza os cards dos alunos na tela, possibilitando a visualização dos alunos na tela.
function renderStudents(students) {
  studentsList.innerHTML = "";

  // Se não tiver nenhum aluno, mostra mensagem para o usuário.
  if (students.length === 0) {
    studentsList.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #666;">Nenhum aluno encontrado.</p>';
    return;
  }

  // Cria um card pra cada aluno
  students.forEach((student) => {
    const card = document.createElement("div");
    // Adiciona classe active ou inactive dependendo do status do aluno
    card.className = `student-card ${student.ativo ? "active" : "inactive"}`;

    // Formata a data de vencimento pro padrão brasileiro (dd/mm/yyyy)
    const vencimento = student.vencimento
      ? new Date(student.vencimento).toLocaleDateString("pt-BR")
      : "Data não informada";

    // HTML do card do aluno
    card.innerHTML = `
            <div class="student-header">
                <div>
                    <h3 class="student-name">${student.nome}</h3>
                    <span class="student-plan">${student.plano}</span>
                </div>
            </div>
            <div class="student-details">
                <div class="detail-item">
                    <strong>Objetivo:</strong><br> ${student.objetivo || "-"}
                </div>
                <div class="detail-item">
                    <strong>IMC:</strong><br> ${student.imc || "-"}
                </div>
                <div class="detail-item">
                    <strong>Freq. Semanal:</strong><br> ${student.freqSemanal}x
                </div>
                <div class="detail-item">
                    <strong>Vencimento:</strong><br> ${vencimento}
                </div>
            </div>
            <div class="student-actions">
                <button class="btn-edit" data-student-id="${student.id}">
                    Editar
                </button>
                <button class="btn-delete" data-student-id="${student.id}">
                    Excluir
                </button>
            </div>
        `;

    // Adiciona os event listeners nos botões de editar e excluir
    const editBtn = card.querySelector(".btn-edit");
    const deleteBtn = card.querySelector(".btn-delete");

    editBtn.addEventListener("click", () => openModalForEdit(student));
    deleteBtn.addEventListener("click", () => deleteStudent(student.id));

    studentsList.appendChild(card);
  });
}

// Cria um novo aluno na API (POST)
async function createStudent(studentData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao criar aluno");
    }

    closeModal();
    fetchStudents(); // Atualiza a lista para que o usuário possa ver o aluno criado.
    alert("Aluno cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

// Atualiza um aluno existente na API (PUT)
async function updateStudent(id, studentData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao atualizar aluno");
    }

    closeModal();
    fetchStudents(); // Atualiza a lista
    alert("Aluno atualizado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

// Exclui um aluno da API (DELETE)
async function deleteStudent(id) {
  // Confirma antes de excluir para que o usuário possa ter certeza que deseja excluir o aluno mesmo.
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir aluno");

    fetchStudents(); // Atualiza a lista
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao excluir aluno");
  }
}

// Event listener do formulário, quando o usuário submete, a gente verifica se é edição ou criação.
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Previne o comportamento padrão do form
  const formData = new FormData(form);

  // Monta o objeto com os dados do formulário
  const data = {
    nome: formData.get("name"),
    plano: formData.get("plano"),
    objetivo: formData.get("objetivo"),
    imc: parseFloat(formData.get("imc")) || null,
    freqSemanal: parseInt(formData.get("freqSemanal")) || 0,
    vencimento: formData.get("vencimento"),
    ativo: formData.get("ativo") === "on", // Checkbox retorna "on" quando marcado
  };

  // Decide se vai criar ou atualizar baseado no modo
  if (isEditMode && currentStudentId) {
    updateStudent(currentStudentId, data);
  } else {
    createStudent(data);
  }
});

// Event listeners dos filtros, quando o usuário seleciona um filtro, a lista de alunos é atualizada.
filterPlan.addEventListener("change", fetchStudents);
filterActive.addEventListener("change", fetchStudents);

// Botão de limpar filtros para possibilitar olhar todos os alunps novamente 
const btnClearFilters = document.getElementById("btn-clear-filters");
btnClearFilters.addEventListener("click", () => {
  filterPlan.value = "";
  filterActive.value = "";
  searchInput.value = "";
  fetchStudents();
});

// Busca por nome, vai filtrando localmente enquanto digita para que o usuário possa ver os alunos que correspondem ao nome digitado
searchInput.addEventListener("input", filterAndRenderStudents);

// aqui inicializa carregando a lista de alunos quando a página abre
fetchStudents();
