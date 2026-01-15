// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Получаем данные пользователя
let userData = tg.initDataUnsafe.user;

// При загрузке приложения
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем Telegram Web App
    tg.expand();
    tg.MainButton.text = 'Отправить';
    tg.MainButton.textColor = '#FFFFFF';
    tg.MainButton.color = '#2cab37';

    // Показываем кнопку Telegram
    tg.MainButton.show();

    // При клике на основную кнопку Telegram
    tg.MainButton.onClick(sendToBot);

    // Отправляем данные авторизации на сервер
    if (userData) {
        sendAuthData(userData);
    }

    console.log('Mini App инициализирован');
    console.log('User ID:', userData?.id);
});

// Отправка данных авторизации
function sendAuthData(user) {
    const authData = {
        user_id: user.id,
        username: user.username || 'Unknown',
        first_name: user.first_name,
        last_name: user.last_name,
        is_bot: user.is_bot,
        timestamp: new Date().toISOString()
    };
    
    console.log('Отправляю данные авторизации:', authData);
    // Данные сохраняются в localStorage для использования в приложении
    localStorage.setItem('user_data', JSON.stringify(authData));
}

// Переход в меню
function openMenu() {
    // Используем openLink для работы с Telegram Mini App
    const menuUrl = window.location.href.replace('index.html', '') + '2/menu.html';
    tg.openLink(menuUrl);
}

// Переход назад
function goBack() {
    window.history.back();
}

let cart = [];

// Добавить в корзину
function addToCart(name, price) {
    cart.push({ name, price });
    tg.HapticFeedback.impactOccurred('light');
    showNotification(`${name} добавлен в корзину`);
    updateTotal();
}

// Обновить сумму
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    tg.MainButton.text = `Оплатить ${total}₽`;
}

// Отправить данные боту
function sendToBot() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!');
        return;
    }

    const data = {
        order: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        timestamp: new Date().toISOString()
    };

    // Отправляем данные в бота
    tg.sendData(JSON.stringify(data));
}

// Альтернативная функция для отправки
function sendData() 

// Уведомление
function showNotification(text) {
    const notification = document.createElement('div');
    notification.textContent = text;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #2cab37;
        color: white;
        padding: 12px;
        border-radius: 8px;
        text-align: center;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Анимация
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .screen {
        display: none;
    }
    
    .screen.active {
        display: block;
    }
    
    .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .menu-item button {
        background: #2cab37;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
    }
    
    .navbar {
        padding: 15px;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .back-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
    }
    
    .navbar-title {
        margin: 0;
        flex: 1;
        text-align: center;
        font-size: 18px;
    }
    
    .secondary {
        background: #0088cc !important;
        margin-top: 10px;
    }
`;
document.head.appendChild(style);

// ФУНКЦИИ ПРОФИЛЯ
function showProfile() {
    const modal = document.getElementById('profileModal');
    const profileInfo = document.getElementById('profileInfo');
    
    // Получаем данные из localStorage или из Telegram
    let userDataStr = localStorage.getItem('user_data');
    let userData = userDataStr ? JSON.parse(userDataStr) : userData;
    
    if (!userData) {
        userData = tg.initDataUnsafe.user;
    }
    
    if (!userData) {
        profileInfo.innerHTML = '<p>Данные пользователя недоступны</p>';
    } else {
        profileInfo.innerHTML = `
            <div class="profile-item">
                <label>ID</label>
                <span>${userData.id || userData.user_id}</span>
            </div>
            <div class="profile-item">
                <label>Имя</label>
                <span>${userData.first_name || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Фамилия</label>
                <span>${userData.last_name || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Юзернейм</label>
                <span>${userData.username || userData.username || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Статус</label>
                <span>✅ Активный пользователь</span>
            </div>
        `;
    }
    
    modal.classList.add('show');
}

function closeProfile() {
    const modal = document.getElementById('profileModal');
    modal.classList.remove('show');
}

// Закрытие модального окна при клике вне содержимого
window.addEventListener('click', function(event) {
    const modal = document.getElementById('profileModal');
    if (event.target === modal) {
        closeProfile();
    }
});
