import path from 'path'; // Модуль для роботи з шляхами файлів
import { fileURLToPath } from 'url'; // Модуль для перетворення URL в шлях файлу
import express from 'express'; // Фреймворк Express для побудови веб-додатків
import dotenv from 'dotenv'; // Модуль для завантаження конфігурації з .env файлу
import cookieParser from 'cookie-parser'; // Middleware для обробки куки
import cors from 'cors'; // Middleware для обробки CORS

dotenv.config(); // Завантаження конфігурації з .env файлу
import connectDB from './config/db.js'; // Функція для підключення до бази даних
import userRoutes from './routes/userRoutes.js'; // Маршрути для користувачів
import trainingRoutes from './routes/trainingRoutes.js'; // Маршрути для тренувань
import categoriesRoutes from './routes/categoriesRoutes.js'; // Маршрути для тренувань
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; // Middleware для обробки помилок

// Отримання шляху до поточного файлу та каталогу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5070; // Встановлення порту для сервера

connectDB(); // Підключення до бази даних

const app = express(); // Створення екземпляру додатку Express

// Використання middleware для обробки CORS, обмеження розміру запитів та обробки куки
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Встановлення маршрутів для користувачів та тренувань
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/trainings', trainingRoutes);

// Обробка статичних файлів (наприклад, зображення)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Якщо додаток працює в середовищі production, використовується статична розгортка та віддача index.html
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // Якщо додаток працює в іншому середовищі, просто віддаємо повідомлення "API is running...."
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Встановлення middleware для обробки помилок 404 та інших помилок сервера
app.use(notFound);
app.use(errorHandler);

// Прослуховування заданого порту
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
