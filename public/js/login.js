document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Мок авторизация
    if (username === 'admin' && password === 'admin') {
        alert('Вход выполнен успешно');
        window.location.href = "/admin";
    } else {
        alert('Неверные учетные данные');
    }
});
