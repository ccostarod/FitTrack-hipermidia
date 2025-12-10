const API_URL = window.env.API_URL || "http://localhost:3000/alunos";

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
const objectiveSelect = document.getElementById("student-objective");
const customObjectiveGroup = document.getElementById("custom-objective-group");
const customObjectiveInput = document.getElementById(
  "student-custom-objective"
);

let isEditMode = false;
let currentStudentId = null;
let allStudents = [];

function toggleCustomObjectiveField() {
  const selectedValues = Array.from(objectiveSelect.selectedOptions).map(
    (option) => option.value
  );
  if (selectedValues.includes("Outro")) {
    customObjectiveGroup.classList.remove("hidden");
  } else {
    customObjectiveGroup.classList.add("hidden");
    customObjectiveInput.value = "";
  }
}

objectiveSelect.addEventListener("change", toggleCustomObjectiveField);

function openModal() {
  isEditMode = false;
  currentStudentId = null;
  modalTitle.textContent = "Adicionar Novo Aluno";
  customObjectiveGroup.classList.add("hidden");
  modal.classList.add("active");
}

const PREDEFINED_OBJECTIVES = [
  "Hipertrofia",
  "Emagrecimento",
  "Condicionamento Físico",
  "Saúde e Bem-estar",
  "Ganho de Força",
  "Definição Muscular",
  "Flexibilidade",
  "Reabilitação",
];

function openModalForEdit(student) {
  isEditMode = true;
  currentStudentId = student.id;
  modalTitle.textContent = "Editar Aluno";

  document.getElementById("student-id").value = student.id;
  document.getElementById("student-name").value = student.nome;
  document.getElementById("student-plan").value = student.plano;
  document.getElementById("student-imc").value = student.imc || "";
  document.getElementById("student-freq").value = student.freqSemanal || "";
  document.getElementById("student-due").value = student.vencimento || "";
  document.getElementById("student-active").checked = student.ativo;

  const objectives = student.objetivo ? student.objetivo.split(", ") : [];
  const predefinedSelected = [];
  const customObjectives = [];

  objectives.forEach((obj) => {
    if (PREDEFINED_OBJECTIVES.includes(obj)) {
      predefinedSelected.push(obj);
    } else if (obj.trim()) {
      customObjectives.push(obj);
    }
  });

  Array.from(objectiveSelect.options).forEach((option) => {
    if (option.value === "Outro") {
      option.selected = customObjectives.length > 0;
    } else {
      option.selected = predefinedSelected.includes(option.value);
    }
  });

  customObjectiveInput.value = customObjectives.join(", ");
  if (customObjectives.length > 0) {
    customObjectiveGroup.classList.remove("hidden");
  } else {
    customObjectiveGroup.classList.add("hidden");
  }

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  form.reset();
  customObjectiveGroup.classList.add("hidden");
  isEditMode = false;
  currentStudentId = null;
}

btnAddStudent.addEventListener("click", () => {
  form.reset();
  openModal();
});
closeBtn.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

const studentNameInput = document.getElementById("student-name");
const studentImcInput = document.getElementById("student-imc");
const studentFreqInput = document.getElementById("student-freq");

studentNameInput.addEventListener("invalid", (e) => {
  e.target.setCustomValidity("Por favor, preencha o nome completo do aluno");
});

studentNameInput.addEventListener("input", (e) => {
  e.target.setCustomValidity("");
});

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

async function fetchStudents() {
  try {
    const plan = filterPlan.value;
    const active = filterActive.value;

    const params = new URLSearchParams();
    if (plan) params.append("plano", plan);
    if (active) params.append("ativo", active);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao buscar alunos");

    allStudents = await response.json();
    filterAndRenderStudents();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar lista de alunos");
  }
}

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

function renderStudents(students) {
  studentsList.innerHTML = "";

  if (students.length === 0) {
    studentsList.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #666;">Nenhum aluno encontrado.</p>';
    return;
  }

  students.forEach((student) => {
    const card = document.createElement("div");
    card.className = `student-card ${student.ativo ? "active" : "inactive"}`;

    const vencimento = new Date(student.vencimento).toLocaleDateString("pt-BR");

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

    const editBtn = card.querySelector(".btn-edit");
    const deleteBtn = card.querySelector(".btn-delete");

    editBtn.addEventListener("click", () => openModalForEdit(student));
    deleteBtn.addEventListener("click", () => deleteStudent(student.id));

    studentsList.appendChild(card);
  });
}

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
    fetchStudents();
    alert("Aluno cadastrado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

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
    fetchStudents();
    alert("Aluno atualizado com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
    alert(error.message);
  }
}

async function deleteStudent(id) {
  if (!confirm("Tem certeza que deseja excluir este aluno?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erro ao excluir aluno");

    fetchStudents();
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao excluir aluno");
  }
}

function getSelectedObjectives() {
  const selectedOptions = Array.from(objectiveSelect.selectedOptions)
    .map((option) => option.value)
    .filter((value) => value !== "Outro");
  const customObjective = customObjectiveInput.value.trim();

  const allObjectives = [...selectedOptions];
  if (customObjective) {
    allObjectives.push(customObjective);
  }

  return allObjectives.join(", ");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const data = {
    nome: formData.get("name"),
    plano: formData.get("plano"),
    objetivo: getSelectedObjectives(),
    imc: parseFloat(formData.get("imc")) || null,
    freqSemanal: parseInt(formData.get("freqSemanal")) || 0,
    vencimento: formData.get("vencimento"),
    ativo: formData.get("ativo") === "on",
  };

  if (isEditMode && currentStudentId) {
    updateStudent(currentStudentId, data);
  } else {
    createStudent(data);
  }
});

filterPlan.addEventListener("change", fetchStudents);
filterActive.addEventListener("change", fetchStudents);

const btnClearFilters = document.getElementById("btn-clear-filters");
btnClearFilters.addEventListener("click", () => {
  filterPlan.value = "";
  filterActive.value = "";
  searchInput.value = "";
  fetchStudents();
});

searchInput.addEventListener("input", filterAndRenderStudents);

fetchStudents();
