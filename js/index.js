const user = JSON.parse(localStorage.getItem("currentAcc"))
document.getElementById("userName").innerText = `Tài khoản: ${user.email}`;





function logout() {
  const flag = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (flag) {
      localStorage.removeItem("currentAcc");
      window.location.href = "/pages/login.html";
  }
}

let checkCurrentAcc= JSON.parse(localStorage.getItem("CurrentAcc")) || [];
if (checkCurrentAcc.length === 0){
    window.location.href = "/pages/login.html";
}

// tạo biến mảng lấy từ local
let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [];

// Hàm lưu ngân sách
function saveBudget() {
    const month = document.getElementById("month").value;
    const budgetInput = document.getElementById("budgetInput").value;
    const errorBudget = document.getElementById("errorBudget");
    const successModal = document.getElementById("successModal");

    if (!month) {
        errorBudget.innerText = "Vui lòng chọn tháng.";
        return;
    }

    if (!budgetInput || parseFloat(budgetInput) <= 0) {
        errorBudget.innerText = "Vui lòng nhập ngân sách hợp lệ.";
        return;
    }

    errorBudget.innerText = "";

    const newBudget = {
        email: user.email,
        month: month,
        budget: parseFloat(budgetInput)
    };

    const index = budgets.findIndex(index => index.email === user.email && index.month === month);
    if (index !== -1) {
        budgets[index].budget = newBudget.budget; 
    } else {
        budgets.push(newBudget); 
    }

    localStorage.setItem("budgets", JSON.stringify(budgets));

    successModal.style.display = "block";

    document.getElementById("sumMoney").innerText = `${newBudget.budget.toLocaleString()} VND`;
    document.getElementById("budgetInput").value = "";
}

// Hàm đóng modal
function closeModal() {
    document.getElementById("successModal").style.display = "none";
}

// hàm hiển thị tổng tiền chi tiêu
function displayBudget()  {
    const selectedMonth = document.getElementById("month").value;

    const money = budgets.find(budget => budget.email === user.email && budget.month === selectedMonth);

    if (money) {
        document.getElementById("sumMoney").innerText = `${money.budget.toLocaleString()} VND`;
    } else {
        document.getElementById("sumMoney").innerText = "0 VND";
    }
};



// Hàm hiển thị danh sách danh mục
function renderCategories() {
    const updateCategory = document.getElementById("updateCategory");
    updateCategory.innerText = ""
    let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    
    const selectedMonth = document.getElementById("month").value;
    
    let filteredBudgets = budgets.filter(index => index.email === user.email && index.month === selectedMonth);
    

    if (filteredBudgets.length > 0) {
        const categories = filteredBudgets[0].categories;

        if (Array.isArray(categories) && categories.length > 0) {
            categories.forEach((cat) => {
                const item = document.createElement("span");
                item.className = "category-item";

                item.innerHTML = `
                <span>${cat.name} - Giới hạn: ${cat.limit.toLocaleString()} VND</span>
                <span >
                    <button id="editBtn">Sửa</button>
                    <button id="deleteBtn">Xóa</button>
                </span>
                `;

                updateCategory.appendChild(item);
           
            });
        }
    }
        
}

// hàm thêm danh mục
function addCategory() {
    const categoryName = document.getElementById("category").value.trim();
    const gioiHan = document.getElementById("gioiHan").value.trim();
    const month = document.getElementById("month").value; 

    
    if (!categoryName || !gioiHan || isNaN(gioiHan) || parseFloat(gioiHan) <= 0) {
        alert("Vui lòng nhập tên danh mục và giới hạn hợp lệ!");
        return;
    }

    
    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);
   

    // Tạo danh mục
    const newCategory = {
        name: categoryName,
        limit: parseFloat(gioiHan),
        budgetSpent: 0  
    };

    if (!Array.isArray(budgets[budgetIndex].categories)) {
        budgets[budgetIndex].categories = []; // Khởi tạo categories nếu chưa có
    }

    budgets[budgetIndex].categories.push(newCategory);
    
    
    localStorage.setItem("budgets", JSON.stringify(budgets));

    document.getElementById("category").value = "";
    document.getElementById("gioiHan").value = "";

    renderCategories();
};
