import logging
import json
from telegram import Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from telegram import KeyboardButton, ReplyKeyboardMarkup
from database import init_db, add_user, add_order, get_user_orders, get_stats

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Инициализируем БД
init_db()

TOKEN = '8593742013:AAFMA1cPDBSOCz1kWNwKk-lFjP2k4EnBLYs'

# ЗАМЕНИТЕ НА ВАШІ ДАННЫЕ GITHUB:
# USERNAME - ваше имя пользователя GitHub
# REPO - название вашего репозитория
GITHUB_USERNAME = "nikitacesnokov84-bot"
GITHUB_REPO = "chayhona-app"
WEBAPP_URL = f"https://{GITHUB_USERNAME}.github.io/{GITHUB_REPO}"

# Для локального тестирования раскомментируйте:
# WEBAPP_URL = "http://localhost:8000"

# /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    user_id = user.id
    user_name = user.first_name
    
    # Добавляем пользователя в БД
    add_user(user_id, user.username or 'unknown', user.first_name, user.last_name or '')
    
    # Сохраняем ID пользователя
    context.user_data['user_id'] = user_id
    context.user_data['username'] = user_name
    
    keyboard = [
        [KeyboardButton(
            text="🚀 Открыть Mini App",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )]
    ]

    reply_markup = ReplyKeyboardMarkup(
        keyboard,
        resize_keyboard=True
    )

    await update.message.reply_text(
        f"👋 Привет, {user_name}!\n\nНажми кнопку ниже чтобы открыть приложение",
        reply_markup=reply_markup
    )

# Команда /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
🤖 Команды:
/start - Главное меню
/help - Справка
/info - Информация о нас

📱 Нажми на кнопку "🚀 Открыть Mini App" чтобы сделать заказ!
    """
    await update.message.reply_text(help_text)

# Информация о ресторане
async def info_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    info_text = """
🍽️ Чайхона Самарканд

📍 Адрес: улица Вешняя, 9
⏰ Время: 10:00 - 21:00
📞 Номер: +7 XXX XXX XX XX

Самая вкусная чайхона в городе! ☕
    """
    await update.message.reply_text(info_text)

# Команда /stats
async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    stats = get_stats()
    stats_text = f"""
📊 Статистика:

👥 Пользователей: {stats['users']}
🛒 Заказов: {stats['orders']}
💰 Доход: {stats['revenue']}₽
    """
    await update.message.reply_text(stats_text)

# Обработчик данных из веб-приложения
async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Проверяем есть ли data из веб-приложения
        if not update.message.web_app_data:
            return
            
        data = json.loads(update.message.web_app_data.data)
        user_id = update.effective_user.id
        
        # Добавляем заказ в БД
        if 'order' in data and 'total' in data:
            order_id = add_order(user_id, data['order'], data['total'])
            
            # Формируем ответ
            order_text = "📋 Ваш заказ:\n\n"
            
            for item in data['order']:
                order_text += f"  • {item['name']} - {item['price']}₽\n"
            
            order_text += f"\n💰 Итого: {data['total']}₽"
            order_text += f"\n📌 Номер заказа: #{order_id}"
            
            await update.message.reply_text(order_text)
            await update.message.reply_text("✅ Спасибо за заказ!\n⏱️ Он будет готов через 30 минут.")
        
    except Exception as e:
        logging.error(f"Ошибка: {e}")

def main():
    app = Application.builder().token(TOKEN).build()
    
    # Команды
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("info", info_command))
    app.add_handler(CommandHandler("stats", stats_command))
    
    # Обработчик веб-приложения - проверяем наличие web_app_data
    app.add_handler(MessageHandler(
        filters.Regex(".*") & ~filters.COMMAND,
        handle_web_app_data
    ))
    
    print("🤖 Бот запущен!")
    print(f"📱 Mini App URL: {WEBAPP_URL}")
    print(f"📚 Помощь: /help")
    print(f"📊 Статистика: /stats")
    app.run_polling()

if __name__ == '__main__':
    main()
