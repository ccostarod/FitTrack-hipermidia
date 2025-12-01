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

let isEditMode = false;
let currentStudentId = null;

function openModal() {
  isEditMode = false;
  currentStudentId = null;
  modalTitle.textContent = "Adicionar Novo Aluno";
  modal.classList.add("active");
}

function openModalForEdit(student) {
  isEditMode = true;
  currentStudentId = student.id;
  modalTitle.textContent = "Editar Aluno";

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

function closeModal() {
  modal.classList.remove("active");
  form.reset();
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

async function fetchStudents() {
  try {
    const plan = filterPlan.value;
    const active = filterActive.value;

    const params = new URLSearchParams();
    if (plan) params.append("plano", plan);
    if (active) params.append("ativo", active);

    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Erro ao buscar alunos");

    const students = await response.json();
    renderStudents(students);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao carregar lista de alunos");
  }
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

    // Add event listeners
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
    fetchStudents(); // Refresh list
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
    fetchStudents(); // Refresh list
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

    fetchStudents(); // Refresh list
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao excluir aluno");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const data = {
    nome: formData.get("name"),
    plano: formData.get("plano"),
    objetivo: formData.get("objetivo"),
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

fetchStudents();
