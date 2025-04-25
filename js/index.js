const user = JSON.parse(localStorage.getItem("currentAcc"))
document.getElementById("userName").innerText = `Tài khoản: ${user.email}`;



function logout() {
  const flag = confirm("Bạn có chắc chắn muốn đăng xuất không?");
  if (flag) {
      localStorage.removeItem("currentAcc");
      window.location.href = "/pages/login.html";
  }
}


