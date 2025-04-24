
// lưu tổng ngân sách
function saveBudget() {
  const budgetInput = document.getElementById('budgetInput');
  const errorBudget = document.getElementById('errorBudget');
  
  if (budgetInput.value.trim() === "") {
    errorBudget.innerHTML = "Không được để trống";
  } else {
    errorBudget.innerHTML = "";
    budgetInput.value = "";
    openModal();
  }
}

function openModal() {
  document.getElementById('successModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('successModal').style.display = 'none';
}