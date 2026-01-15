// Получаем элементы для отображения времени
const timeLabel = document.getElementById('timeLabel');
const timeValue = document.getElementById('timeValue');

// Время открытия и закрытия
const openingTime = "11:00"; // Время открытия (московское время)
const closingTimeWeekday = "20:00"; // Время закрытия для Пн-Чт
const closingTimeWeekend = "22:00"; // Время закрытия для Пт-Сб

// Функция для вычисления разницы времени
function getTimeDifference(targetTime) {
    const now = new Date();
    const [hours, minutes] = targetTime.split(":").map(num => parseInt(num));

    // Получаем московское время (UTC+3)
    const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));

    // Устанавливаем целевое время для расчета
    const targetDate = new Date(moscowTime);
    targetDate.setHours(hours);
    targetDate.setMinutes(minutes);

    const diff = targetDate - moscowTime;
    const hoursLeft = Math.floor(diff / 1000 / 60 / 60);
    const minutesLeft = Math.floor((diff / 1000 / 60) % 60);

    return `${hoursLeft}:${minutesLeft < 10 ? "0" + minutesLeft : minutesLeft}`;
}

// Функция для обновления времени на основе дня недели и текущего времени
function updateTime() {
    const now = new Date();

    // Получаем московское время
    const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    const currentHours = moscowTime.getHours();
    const currentDay = moscowTime.getDay(); // Получаем день недели (0 - воскресенье, 1 - понедельник и т.д.)

    // Проверка, открыты ли мы сегодня
    if (currentDay >= 1 && currentDay <= 4) {
        // Понедельник - четверг (11:00 - 20:00)
        if (currentHours < 11) {
            // Время до открытия
            timeLabel.textContent = " открытия";
            timeValue.textContent = getTimeDifference(openingTime);
        } else if (currentHours >= 11 && currentHours < 20) {
            // Время до закрытия
            timeLabel.textContent = " закрытия";
            timeValue.textContent = getTimeDifference(closingTimeWeekday);
        } else {
            // Уже закрыто
            timeLabel.textContent = "закрыто";
            timeValue.textContent = "00:00";
        }
    } else if (currentDay === 5 || currentDay === 6) {
        // Пятница - суббота (11:00 - 22:00)
        if (currentHours < 11) {
            // Время до открытия
            timeLabel.textContent = " открытия";
            timeValue.textContent = getTimeDifference(openingTime);
        } else if (currentHours >= 11 && currentHours < 22) {
            // Время до закрытия
            timeLabel.textContent = " закрытия";
            timeValue.textContent = getTimeDifference(closingTimeWeekend);
        } else {
            // Уже закрыто
            timeLabel.textContent = "закрыто";
            timeValue.textContent = "00:00";
        }
    } else {
        // Воскресенье - закрыто
        timeLabel.textContent = "закрыто";
        timeValue.textContent = "00:00";
    }
}

// Обновляем время каждую минуту
setInterval(updateTime, 60000);
updateTime(); // Первоначальный вызов для установки времени сразу при загрузке
