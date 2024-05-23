document.addEventListener('DOMContentLoaded', () => {
    const createRoomBtn = document.getElementById('create-room-btn');
    const joinRoomBtn = document.getElementById('join-room-btn');
    const createRoomModal = document.getElementById('create-room-modal');
    const createRoomForm = document.getElementById('create-room-form');
    const closeBtn = document.querySelector('.close-btn');

    // Открыть модальное окно
    createRoomBtn.addEventListener('click', () => {
        createRoomModal.style.display = 'block';
    });

    // Закрыть модальное окно
    closeBtn.addEventListener('click', () => {
        createRoomModal.style.display = 'none';
    });

    // Создание комнаты при отправке формы
    createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const roomName = document.getElementById('room-name').value;
        const audioAccess = document.getElementById('audio-access').checked;
        const videoAccess = document.getElementById('video-access').checked;
        const chatAccess = document.getElementById('chat-access').checked;

        // Мок создание комнаты
        alert(`Комната "${roomName}" создана с доступом к микрофону: ${audioAccess}, доступом к камере: ${videoAccess}, доступом к чату: ${chatAccess}`);
        createRoomModal.style.display = 'none';
    });

    // Присоединиться к комнате
    joinRoomBtn.addEventListener('click', () => {
        const roomId = prompt('Введите ID комнаты:');
        if (roomId) {
            window.location.href = `/new`;
        }
    });
});
