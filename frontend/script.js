const btnAddStudent = document.querySelector('.btn-add-student');
const modal = document.getElementById('modal-add-student');
const closeBtn = document.querySelector('.btn-close-modal');
const btnCancel = document.querySelector('.btn-cancel');
const form = document.getElementById('form-add-student');

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

btnAddStudent.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone')
    };
    
    console.log('Dados do aluno:', data);
    
    form.reset();
    closeModal();
});