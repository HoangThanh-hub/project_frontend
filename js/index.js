const checkCurrentAcc = JSON.parse(localStorage.getItem("currentAcc") );

if (checkCurrentAcc === null) {
    window.location.href = "/pages/login.html";
}

const user = JSON.parse(localStorage.getItem("currentAcc"))
document.getElementById("userName").innerText = `Tài khoản: ${user.email}`;


function logout() {
  const flag = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (flag) {
      localStorage.removeItem("currentAcc");
      window.location.href = "/pages/login.html";
  }
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
        budget: parseFloat(budgetInput),
        budgetMain:parseFloat(budgetInput)
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
    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    
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
                    <button id="editBtn" onclick="editCat('${cat.name}')">Sửa</button>
                    <button id="deleteBtn" onclick="deleteCategory('${cat.name}')">Xóa</button>
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


    const limit = parseFloat(gioiHan);
    const currentBudget = budgets[budgetIndex];

    let existingCategories = currentBudget.categories;
    if (!Array.isArray(existingCategories)) {
        existingCategories = [];
    }
    
    const totalLimits = existingCategories.reduce((sum, cat) => sum + cat.limit, 0);

    if (limit > currentBudget.budget) {
        alert("Giới hạn danh mục vượt quá tổng ngân sách tháng!");
        return;
    }

    if (totalLimits + limit > currentBudget.budget) {
        alert("Tổng giới hạn của tất cả danh mục vượt quá ngân sách!");
        return;
    }
   

    // Tạo danh mục
    const newCategory = {
        name: categoryName,
        limit: parseFloat(gioiHan),
        budgetSpent: 0  
    };

    if (!Array.isArray(budgets[budgetIndex].categories)) {
        budgets[budgetIndex].categories = []; 
    }

    budgets[budgetIndex].categories.push(newCategory);
    
    
    localStorage.setItem("budgets", JSON.stringify(budgets));

    document.getElementById("category").value = "";
    document.getElementById("gioiHan").value = "";

    renderCategories();
    loadCategoryOptions();
    renderStatistics();

};

// hàm chỉnh sửa danh mục
function editCat(catName) {
    const month = document.getElementById("month").value;
    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);
    const categoryIndex = budgets[budgetIndex].categories.findIndex(index => index.name === catName);
    

    const category = budgets[budgetIndex].categories[categoryIndex];

    
    document.getElementById("editCategoryName").value = category.name;
    document.getElementById("editCategoryLimit").value = category.limit;

    document.getElementById("saveEditBtn").onclick = function() {
        saveEditedCategory(catName);
    };

    document.getElementById("editModal").style.display = "block";
}


function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Hàm lưu danh mục đã chỉnh sửa
function saveEditedCategory(oldName) {
    const newName = document.getElementById("editCategoryName").value.trim();
    const newLimit = parseFloat(document.getElementById("editCategoryLimit").value.trim());
    const month = document.getElementById("month").value;
    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);
    const categoryIndex = budgets[budgetIndex].categories.findIndex(index => index.name === oldName);

    if (!newName || isNaN(newLimit) || newLimit <= 0) {
        alert("Vui lòng nhập thông tin hợp lệ!");
        return;
    }

    const limit = parseFloat(newLimit);
    const currentBudget = budgets[budgetIndex];

    let existingCategories = currentBudget.categories;
    if (!Array.isArray(existingCategories)) {
        existingCategories = [];
    }
    
    const totalLimits = existingCategories.reduce((sum, cat) => sum + cat.limit, 0);

    if (limit > currentBudget.budget) {
        alert("Giới hạn danh mục vượt quá tổng ngân sách tháng!");
        return;
    }

    if (totalLimits + limit > currentBudget.budget) {
        alert("Tổng giới hạn của tất cả danh mục vượt quá ngân sách!");
        return;
    }

    // Cập nhật dữ liệu
    budgets[budgetIndex].history.forEach(index =>{
        if(index.category === budgets[budgetIndex].categories[categoryIndex].name){
            index.category = newName;
        }
    });
    budgets[budgetIndex].categories[categoryIndex].name = newName;
    budgets[budgetIndex].categories[categoryIndex].limit = newLimit;
    
    

    localStorage.setItem("budgets", JSON.stringify(budgets));

    closeEditModal();
    renderCategories(); 
    loadCategoryOptions();
    renderHistory();
    checkLimit();

}


// hàm xoá danh mục
function deleteCategory(catName) {
    openDeleteModal(catName, "category");
}

// hàm xác nhận xoá danh mục
function confirmDeleteCategory(catName) {
    const month = document.getElementById("month").value;
    let budgets = JSON.parse(localStorage.getItem("budgets")) || [];

    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);
    const categoryIndex = budgets[budgetIndex].categories.findIndex(index => index.name === catName);

    // Kiểm tra xem có giao dịch nào liên quan đến danh mục này không
    const hasTransactions = budgets[budgetIndex].history.some(item => item.category === catName);

    if (hasTransactions) {
        alert("Không thể xóa danh mục vì có giao dịch liên quan!");
        document.getElementById("deleteCategoryModal").style.display = "none";
        return;
    }
    

    // Xóa danh mục
    budgets[budgetIndex].categories.splice(categoryIndex, 1);

    localStorage.setItem("budgets", JSON.stringify(budgets));

    
    document.getElementById("deleteCategoryModal").style.display = "none";
    
    renderCategories(); 
    renderStatistics();
}

// hàm mở modal xoá
function openDeleteModal(item, type = "category") {
    const deleteModal = document.getElementById("deleteCategoryModal");
    deleteModal.style.display = "block";

    document.getElementById("confirmDeleteBtn").onclick = function () {
        if (type === "category") {
            confirmDeleteCategory(item);
        } else if (type === "history") {
            confirmDeleteHistory(item);
        }
    };

    document.getElementById("cancelDeleteBtn").onclick = function () {
        deleteModal.style.display = "none";
    };
}

// hàm thêm chi tiêu
function addSpending() {
    const amount = parseFloat(document.getElementById("spendingAmount").value.trim());
    const selectedCategory = document.getElementById("selectCategory").value;
    const note = document.getElementById("spendingNote").value.trim();
    const month = document.getElementById("month").value;

    if (isNaN(amount) || amount <= 0) {
        alert("Vui lòng nhập số tiền hợp lệ.");
        return;
    }

    if (selectedCategory === "0") {
        alert("Vui lòng chọn danh mục chi tiêu.");
        return;
    }

    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);


    const categoryIndex = budgets[budgetIndex].categories.findIndex(index => index.name === selectedCategory);


    budgets[budgetIndex].categories[categoryIndex].budgetSpent += amount;


    // Lưu vào lịch sử
    if (!budgets[budgetIndex].history) {
        budgets[budgetIndex].history = [];
    }

    budgets[budgetIndex].history.push({
        category: selectedCategory,
        amount: amount,
        note: note,
    });

    budgets[budgetIndex].budget -= amount;
    
    localStorage.setItem("budgets", JSON.stringify(budgets));

    alert("Thêm chi tiêu thành công!");


    document.getElementById("spendingAmount").value = "";
    document.getElementById("spendingNote").value = "";
    document.getElementById("selectCategory").value = "0";

    displayBudget();
    renderHistory();
    renderStatistics()
    checkLimit();
}


// tải lên danh mục để chọn
function loadCategoryOptions() {
    const select = document.getElementById("selectCategory");
    const month = document.getElementById("month").value;

    select.innerHTML = '<option value="0">Chọn danh mục</option>';

    const budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentAcc"));

    const budget = budgets.find(index => index.email === currentUser.email && index.month === month);

    if (budget && Array.isArray(budget.categories)) {
        budget.categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.name;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    }
}



// hàm xoá giao dịch
function deleteHistoryItem(note) {
    openDeleteModal(note, "history");
}

// xác nhận xoá giao dịch
function confirmDeleteHistory(note) {
    const month = document.getElementById("month").value;
    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);

    const historyIndex = budgets[budgetIndex].history.findIndex(item => item.note === note);

   
    const deletedItem = budgets[budgetIndex].history[historyIndex];

    
    budgets[budgetIndex].budget += deletedItem.amount;

    
    const categoryIndex = budgets[budgetIndex].categories.findIndex(cat => cat.name === deletedItem.category);
    budgets[budgetIndex].categories[categoryIndex].budgetSpent -= deletedItem.amount;

    // Xoá giao dịch
    budgets[budgetIndex].history.splice(historyIndex, 1);
    

    localStorage.setItem("budgets", JSON.stringify(budgets));

    // Cập nhật giao diện
    displayBudget();
    renderHistory();
    checkLimit();
    renderStatistics()
    

    document.getElementById("deleteCategoryModal").style.display = "none";
}

let currentPage = 0;  // Biến theo dõi trang hiện tại
const itemsPerPage = 5;  // Số giao dịch mỗi trang

// Hàm hiển thị danh sách giao dịch với phân trang
function renderHistory() {
    const month = document.getElementById("month").value;
    const keyword = document.getElementById("searchInput")?.value?.toLowerCase() || "";
    const sortOption = document.getElementById("sortOption")?.value || "";

    const historyContainer = document.getElementById("updateHistory");
    // let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    const budget = budgets.find(b => b.email === user.email && b.month === month);

    historyContainer.innerHTML = ""; 

    if (!budget || !budget.history || budget.history.length === 0) {
        historyContainer.innerHTML = "<p>Không có giao dịch nào trong tháng này.</p>";
        historyContainer.style.textAlign = "center";
        historyContainer.style.fontSize = "16px";
        historyContainer.style.color = "red";
        historyContainer.style.padding = "20px";  
        return;
    }

    // Lọc theo từ khoá tìm kiếm
    let filteredHistory = budget.history.filter(item =>
        item.note.toLowerCase().includes(keyword)
    );

    // Sắp xếp theo giá tiền
    if (sortOption === "asc") {
        filteredHistory.sort((a, b) => a.amount - b.amount);
    } else if (sortOption === "desc") {
        filteredHistory.sort((a, b) => b.amount - a.amount);
    }

    // Phân trang
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredHistory.length);
    const pageHistory = filteredHistory.slice(startIndex, endIndex);

    // Hiển thị các giao dịch của trang hiện tại
    pageHistory.forEach((item) => {
        const row = document.createElement("span");
        row.classList.add("history-item");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.borderBottom = '1px solid gainsboro';
        row.style.padding = '1.5vw';
        row.style.color = 'black';
    
        row.innerHTML = `
            <span>${item.category} - ${item.note}: ${item.amount.toLocaleString()} VND</span>
            <span style="color: red; cursor: pointer;" onclick="deleteHistoryItem('${item.note}')">Xoá</span>
        `;
    
        historyContainer.appendChild(row);
    });

    renderPagination(Math.ceil(filteredHistory.length / itemsPerPage)); // Cập nhật phân trang theo kết quả lọc
}


// Hàm phân trang
const changePage = (page) => {
    currentPage = page;
    renderHistory();  // Hiển thị lại giao dịch của trang mới
}

// Hàm render phân trang
const renderPagination = (totalPages) => {
    const pagination = document.getElementById("pagination");
    let pageHTML = new Array(totalPages).fill(1)
        .reduce((temp, _, index) => temp + `<li class="page-item ${currentPage === index ? 'active' : ''}" onclick="changePage(${index})"><a class="page-link" href="#">${index + 1}</a></li>`, "");

    if (currentPage > 0) {
        pageHTML = ` <li class="page-item ${currentPage === 0 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">
            <a class="page-link" href="#">Previous</a>
          </li>` + pageHTML;
    }
    
    if (currentPage < totalPages - 1) {
        pageHTML += `<li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">
            <a class="page-link" href="#">Next</a>
          </li>`;
    }
    
    pagination.innerHTML = pageHTML;  // Hiển thị phân trang
};



// hàm cảnh báo chi tiêu
function checkLimit() {
    const warning = document.getElementById("warning");
    warning.innerHTML = "";
    const month = document.getElementById("month").value;
    const budgetIndex = budgets.findIndex(index => index.email === user.email && index.month === month);
    const categories = budgets[budgetIndex].categories;

    categories.forEach(category => {
        if (category.budgetSpent > category.limit) {
            const item = document.createElement("span")
            item.innerHTML=`Danh mục "${category.name}" đã vượt giới hạn: ${category.budgetSpent.toLocaleString()} / ${category.limit.toLocaleString()} VND`;
            item.style.color = "red";
            item.style.padding = '1.5vw'
            item.style.marginTop ='1.5vw'
            warning.appendChild(item)
            warning.appendChild(document.createElement("br"));
        }
    });
}



function renderStatistics() {
    const tbody = document.getElementById("statBody");
    tbody.innerHTML = "";

    const userBudgets = budgets.filter(index => index.email === user.email);

    userBudgets.forEach(budgets => {
        const totalLimit = budgets.budgetMain;
        const totalSpent = budgets.categories.reduce((sum, cat) => sum + cat.budgetSpent, 0);
        const status = totalSpent <= totalLimit ? "Đạt" : "Không đạt";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${budgets.month}</td>
                <td>${totalSpent.toLocaleString()} VND</td>
                <td>${totalLimit.toLocaleString()} VND</td>
                <td style="color: ${status === "Đạt" ? "green" : "red"}">${status}</td>
            `;
            tbody.appendChild(row);
    });
}


