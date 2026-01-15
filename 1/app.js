// Инициализация Telegram Web App
let tg = window.Telegram?.WebApp || {};

// Получаем данные пользователя
let userData = tg.initDataUnsafe?.user || null;

// Для локального тестирования создаем mock данные
if (!userData) {
    userData = {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        is_bot: false
    };
    console.log('⚠️ Используются тестовые данные (нет Telegram)');
}

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

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const data = {
        order: cart,
        total: total,
        timestamp: new Date().toISOString()
    };

    // Сохраняем заказ в localStorage
    const userId = userData?.id || userData?.user_id || 'unknown';
    let ordersKey = `orders_${userId}`;
    let orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    
    orders.push({
        items: cart,
        total: total,
        date: new Date().toISOString(),
        status: 'pending'
    });
    
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    
    showNotification(`✅ Заказ принят! Сумма: ${total}₽`);
    cart = []; // Очищаем корзину
    updateTotal();
    
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
    console.log('showProfile вызвана');
    const modal = document.getElementById('profileModal');
    
    if (!modal) {
        console.error('Modal не найден!');
        return;
    }
    
    const profileInfo = document.getElementById('profileInfo');
    
    console.log('User data:', userData);
    
    if (!userData) {
        profileInfo.innerHTML = '<p style="color: white;">Данные пользователя недоступны</p>';
    } else {
        const userId = userData.id || userData.user_id;
        profileInfo.innerHTML = `
            <div class="profile-item">
                <label>ID</label>
                <span>${userId}</span>
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
                <span>${userData.username || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Статус</label>
                <span>✅ Активный пользователь</span>
            </div>
            <button class="close-btn" onclick="showOrders('${userId}')">📋 История заказов</button>
            <button class="close-btn" style="background: #0088cc;" onclick="closeProfile()">✕ Закрыть</button>
        `;
    }
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    modal.style.alignItems = 'flex-end';
    modal.style.justifyContent = 'center';
    console.log('Modal показан');
}
            <div class="profile-item">
                <label>Юзернейм</label>
                <span>${userData.username || 'N/A'}</span>
            </div>
            <div class="profile-item">
                <label>Статус</label>
                <span>✅ Активный пользователь</span>
            </div>
            <button class="close-btn" onclick="showOrders('${userId}')">📋 История заказов</button>
            <button class="close-btn" style="background: #0088cc;" onclick="closeProfile()">✕ Закрыть</button>
        `;
    }
    
    modal.classList.add('show');
}

function closeProfile() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

// Закрытие модального окна при клике вне содержимого
window.addEventListener('click', function(event) {
    const modal = document.getElementById('profileModal');
    if (event.target === modal) {
        closeProfile();
    }
});

// Показать историю заказов
function showOrders(userId) {
    const profileInfo = document.getElementById('profileInfo');
    
    // Получаем заказы из localStorage
    let ordersStr = localStorage.getItem(`orders_${userId}`);
    let orders = ordersStr ? JSON.parse(ordersStr) : [];
    
    if (orders.length === 0) {
        profileInfo.innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <p style="font-size: 40px; margin-bottom: 10px;">📭</p>
                <p>У вас пока нет заказов</p>
                <button class="close-btn" onclick="showProfile()" style="margin-top: 20px;">← Назад</button>
            </div>
        `;
    } else {
        let ordersHtml = '<div style="max-height: 400px; overflow-y: auto;">';
        
        orders.forEach((order, index) => {
            ordersHtml += `
                <div class="profile-item">
                    <label>Заказ №${index + 1}</label>
                    <div style="margin-top: 10px;">
                        ${order.items.map(item => `<p style="margin: 5px 0;">• ${item.name} - ${item.price}₽</p>`).join('')}
                    </div>
                    <p style="margin-top: 10px; color: #2cab37; font-weight: 600;">Сумма: ${order.total}₽</p>
                    <p style="margin-top: 5px; opacity: 0.7; font-size: 12px;">${new Date(order.date).toLocaleString('ru-RU')}</p>
                </div>
            `;
        });
        
        ordersHtml += '</div>';
        ordersHtml += '<button class="close-btn" onclick="showProfile()" style="margin-top: 15px;">← Назад</button>';
        
        profileInfo.innerHTML = ordersHtml;
    }
}
