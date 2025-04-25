


function register() {
const email = document.getElementById("email").value.trim();
const name = document.getElementById("name").value.trim();
const password = document.getElementById("password").value.trim();
const checkPassword = document.getElementById("checkPassword").value.trim();

const errorEmail = document.getElementById("errorEmail");
const errorName = document.getElementById("errorName");
const errorPassword = document.getElementById("errorPassword");
const errorCheckPassword = document.getElementById("errorCheckPassword");

let isValid = true;


errorEmail.innerText = "";
errorName.innerText = "";
errorPassword.innerText = "";
errorCheckPassword.innerText = "";


if (email === "") {
    errorEmail.innerText = "Email không được để trống";
    isValid = false;
} else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errorEmail.innerText = "Email phải đúng định dạng";
    isValid = false;
}


if (name === "") {
    errorName.innerText = "Tên không được để trống";
    isValid = false;
}



if (password === "") {
    errorPassword.innerText = "Mật khẩu không được để trống";
    isValid = false;
} else if (password.length < 6) {
    errorPassword.innerText = "Mật khẩu tối thiểu 6 ký tự trở lên";
    isValid = false;
}


if (checkPassword === "") {
    errorCheckPassword.innerText = "Mật khẩu xác nhận không được để trống";
    isValid = false;
} else if (checkPassword !== password) {
    errorCheckPassword.innerText = "Mật khẩu xác nhận phải trùng khớp";
    isValid = false;
}

if (isValid) {
    const user = {
        email: email,
        name: name,
        password: password
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Đăng ký thành công!");
    window.location.href = "login.html";
}
};