from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class MyHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Добавляем заголовки для CORS и кэширования
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    os.chdir('1')  # Переходим в папку с фронтенд файлами
    server = HTTPServer(('localhost', 8000), MyHTTPRequestHandler)
    print("🚀 Сервер запущен на http://localhost:8000")
    print("Для остановки нажми Ctrl+C")
    server.serve_forever()
