document.addEventListener('DOMContentLoaded', () => {
    const usersTableBody = document.querySelector('#users-table tbody');
    const addUserModal = document.getElementById('add-user-modal');
    const addUserForm = document.getElementById('add-user-form');
    const addUserBtn = document.getElementById('add-user-btn');
    const closeBtn = document.querySelector('.close-btn');


    let mockUsers = [
        { id: 1, username: 'user1', role: 'user' },
        { id: 2, username: 'user2', role: 'user' },
        { id: 3, username: 'user3', role: 'user' }
    ];

    function loadUsers() {
        usersTableBody.innerHTML = '';
        mockUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    <button class="delete-btn" data-id="${user.id}">Удалить</button>
                    <button class="promote-btn" data-id="${user.id}">Изменить роль</button>
                </td>
            `;
            usersTableBody.appendChild(tr);
        });
    }

    // Загрузить пользователей изначально
    loadUsers();

    // Открыть модальное окно
    addUserBtn.addEventListener('click', () => {
        addUserModal.style.display = 'block';
    });

    // Закрыть модальное окно
    closeBtn.addEventListener('click', () => {
        addUserModal.style.display = 'none';
    });

    // Добавить пользователя при отправке формы
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;
        mockUsers.push({ id: mockUsers.length + 1, username, role: 'user' });
        loadUsers();
        addUserModal.style.display = 'none';
    });

    // Обработка действий пользователя
    usersTableBody.addEventListener('click', (e) => {
        const userId = parseInt(e.target.getAttribute('data-id'), 10);
        const action = e.target.classList.contains('delete-btn') ? 'delete' : e.target.classList.contains('promote-btn') ? 'promote' : null;
        if (action) {
            const user = mockUsers.find(user => user.id === userId);
            if (user) {
                if (action === 'delete') {
                    mockUsers = mockUsers.filter(user => user.id !== userId);
                } else if (action === 'promote') {
                    user.role = user.role === 'user' ? 'organizer' : 'user';
                }
                loadUsers();
            }
        }
    });
});
