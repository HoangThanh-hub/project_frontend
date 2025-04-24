// navbar tài khoản
function logOut() {
    const logOutButton = document.createElement('button');
    logOutButton.textContent = 'Đăng xuất';
    logOutButton.onclick = () => {
      alert('Bạn đã đăng xuất!');

    };
  
    const buttonAc = document.getElementById('buttonAc');
    buttonAc.appendChild(logOutButton);
  }