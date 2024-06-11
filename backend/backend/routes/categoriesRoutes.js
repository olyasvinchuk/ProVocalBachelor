import express from 'express'; // Імпорт фреймворку Express
const router = express.Router(); // Створення об'єкту Router

// Імпорт функцій контролерів для керування тренуваннями
import {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/categoriesController.js';

// Імпорт middleware для автентифікації
import { admin, protect } from '../middleware/authMiddleware.js';

// Встановлення маршрутів та пов'язаних з ними функцій контролерів

// Отримання списку всіх тренувань
router.route('/').get(getAllCategories);

// Додавання нового тренування
router.route('/').post(
    // protect, admin,
    createCategory);

// Отримання конкретного тренування за його ідентифікатором
router.route('/:id').get(getCategoryById);

// Оновлення тренування за його ідентифікатором
router.route('/:id').put(
    // protect, admin,
    updateCategory);

// Видалення тренування за його ідентифікатором
router.route('/:id').delete(
    // protect, admin,
    deleteCategory);

export default router; // Експорт об'єкту Router для використання в інших частинах додатку
