// Данные для категорий
const categoriesData = {
    coffee: [
        { name: "Американо", price: "220 ₽", img: "americano.webp" },
        { name: "Айс латте", price: "275 ₽", img: "coffee2.png" },
        { name: "Латте карамель", price: "350 ₽", img: "coffee3.png" },
        { name: "Латте", price: "260 ₽", img: "coffee4.png" },
        { name: "Мокко", price: "320 ₽", img: "coffee5.png" },
        { name: "Капучино", price: "280 ₽", img: "coffee6.png" },
        { name: "Раф", price: "300 ₽", img: "coffee7.png" },
        { name: "Эспрессо", price: "200 ₽", img: "coffee8.png" }
    ],
    tea: [
        { name: "Черный чай классический", price: "150 ₽", img: "black_tea.jpg" },
        { name: "Чай с лимоном", price: "170 ₽", img: "lemon_tea.jpg" },
        { name: "Чай с жасмином", price: "180 ₽", img: "jasmine_tea.jpg" },
        { name: "Зеленый чай", price: "200 ₽", img: "green_tea.jpg" },
        { name: "Чай с персиком", price: "190 ₽", img: "peach_tea.jpg" },
        { name: "Чай с мятой", price: "180 ₽", img: "mint_tea.jpg" },
        { name: "Чай с медом", price: "210 ₽", img: "honey_tea.jpg" },
        { name: "Чай с ягодами", price: "220 ₽", img: "berry_tea.jpg" }
    ],
    milk_tea: [
        { name: "Чай с молоком", price: "200 ₽", img: "milk_tea.jpg" },
        { name: "Чай с ванилью", price: "220 ₽", img: "vanilla_milk_tea.jpg" },
        { name: "Чай с карамелью", price: "230 ₽", img: "caramel_milk_tea.jpg" },
        { name: "Чай с шоколадом", price: "240 ₽", img: "chocolate_milk_tea.jpg" },
        { name: "Чай с клубникой", price: "250 ₽", img: "strawberry_milk_tea.jpg" },
        { name: "Чай с бананом", price: "260 ₽", img: "banana_milk_tea.jpg" },
        { name: "Чай с орехами", price: "270 ₽", img: "nut_milk_tea.jpg" },
        { name: "Чай с медом", price: "280 ₽", img: "honey_milk_tea.jpg" }
    ],
    juice: [
        { name: "Апельсиновый сок", price: "150 ₽", img: "orange_juice.jpg" },
        { name: "Яблочный сок", price: "160 ₽", img: "apple_juice.jpg" },
        { name: "Грушевый сок", price: "170 ₽", img: "pear_juice.jpg" },
        { name: "Сок гранатовый", price: "180 ₽", img: "pomegranate_juice.jpg" },
        { name: "Мандариновый сок", price: "190 ₽", img: "mandarin_juice.jpg" },
        { name: "Вишневый сок", price: "200 ₽", img: "cherry_juice.jpg" },
        { name: "Морковный сок", price: "210 ₽", img: "carrot_juice.jpg" },
        { name: "Киви сок", price: "220 ₽", img: "kiwi_juice.jpg" }
    ]
};

// Функция для отображения карточек меню
function displayMenu(category) {
    const menuGrid = document.getElementById('menu-grid');
    menuGrid.innerHTML = ""; // Очистим текущее меню

    const items = categoriesData[category];
    if (items) {
        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            
            card.innerHTML = `
                <div class="drink-icon">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <span>${item.name}</span>
                <strong>${item.price}</strong>
            `;
            
            menuGrid.appendChild(card);
        });
    }
}

// Обработчик кликов по категориям
const categoryButtons = document.querySelectorAll('.category-button');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс с других кнопок
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс к текущей кнопке
        button.classList.add('active');
        
        // Получаем выбранную категорию
        const category = button.getAttribute('data-category');
        
        // Обновляем заголовок в верхней части
        document.querySelector('.menu-title').textContent = button.textContent;
        
        // Показываем товары выбранной категории
        displayMenu(category);
    });
});

// Инициализируем с отображения категории "coffee"
displayMenu('coffee');
