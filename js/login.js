function login() {
const name = document.getElementById("name").value.trim();
const password = document.getElementById("password").value.trim();

const errorName = document.getElementById("errorName");
const errorPassword = document.getElementById("errorPassword");

errorName.innerText = "";
errorPassword.innerText = "";

if (name === "") {
    errorName.innerText = "Vui lòng nhập tên đăng nhập hoặc Email";
    return;
}

if (password === "") {
    errorPassword.innerText = "Vui lòng nhập mật khẩu";
    return;
}


const users = JSON.parse(localStorage.getItem("users")) || [];

let success = false;

users.forEach(user => {
    if ((user.name === name || user.email === name) && user.password === password) {
        localStorage.setItem("currentAcc", JSON.stringify(user));
        success = true;
    }
});

if (success) {
    alert('Đăng nhập thành công')
    window.location.href = "../index.html";

} else {
    errorPassword.innerText = "Tên đăng nhập hoặc mật khẩu không đúng";
}
};