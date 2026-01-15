// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

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

    console.log('Mini App инициализирован');
    console.log('User ID:', tg.initData);
});

// Переход в меню
function openMenu() {
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('menuScreen').classList.add('active');
    document.getElementById('backBtn').style.display = 'block';
    
    loadMenu();
}

// Назад в главное меню
function goBack() {
    document.getElementById('menuScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('backBtn').style.display = 'none';
}

// Загрузить меню
function loadMenu() {
    const menu = [
        { name: '🍜 Плов', price: 150 },
        { name: '🍖 Шашлык', price: 200 },
        { name: '🥗 Салат', price: 80 },
        { name: '☕ Чай', price: 30 },
        { name: '🫖 Чай с фруктами', price: 40 }
    ];

    let html = '';
    menu.forEach(item => {
        html += `
            <div class="menu-item">
                <span>${item.name}</span>
                <button onclick="addToCart('${item.name}', ${item.price})">+${item.price}₽</button>
            </div>
        `;
    });

    document.getElementById('menuItems').innerHTML = html;
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
function sendData() {
    if (cart.length === 0) {
        alert('Добавьте товары в корзину!');
        return;
    }

    const data = {
        order: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    alert('Заказ: ' + JSON.stringify(data, null, 2));
}

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
