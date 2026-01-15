import logging
import json
from telegram import Update, WebAppInfo
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from telegram import KeyboardButton, ReplyKeyboardMarkup

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TOKEN = '8593742013:AAFMA1cPDBSOCz1kWNwKk-lFjP2k4EnBLYs'

# ЗАМЕНИТЕ НА ВАШІ ДАННЫЕ GITHUB:
# USERNAME - ваше имя пользователя GitHub
# REPO - название вашего репозитория
GITHUB_USERNAME = "serafim"  # ИЗМЕНИТЕ
GITHUB_REPO = "chaykhona-app"  # ИЗМЕНИТЕ
WEBAPP_URL = f"https://{GITHUB_USERNAME}.github.io/{GITHUB_REPO}"

# Для локального тестирования раскомментируйте:
# WEBAPP_URL = "http://localhost:8000"

# /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
        "👋 Привет! Нажми кнопку ниже чтобы открыть приложение",
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

# Обработчик данных из веб-приложения
async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        data = json.loads(update.message.web_app_data.data)
        
        # Формируем ответ
        order_text = "📋 Ваш заказ:\n\n"
        
        if 'order' in data:
            for item in data['order']:
                order_text += f"  • {item['name']} - {item['price']}₽\n"
        
        if 'total' in data:
            order_text += f"\n💰 Итого: {data['total']}₽"
        
        await update.message.reply_text(order_text)
        await update.message.reply_text("✅ Спасибо за заказ!\n⏱️ Он будет готов через 30 минут.")
        
    except Exception as e:
        logging.error(f"Ошибка: {e}")
        await update.message.reply_text("❌ Ошибка при обработке заказа")

def main():
    app = Application.builder().token(TOKEN).build()
    
    # Команды
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("info", info_command))
    
    # Обработчик веб-приложения
    app.add_handler(MessageHandler(filters.WEB_APP_DATA, handle_web_app_data))
    
    print("🤖 Бот запущен!")
    print(f"📱 Mini App URL: {WEBAPP_URL}")
    print(f"📚 Помощь: /help")
    app.run_polling()

if __name__ == '__main__':
    main()
