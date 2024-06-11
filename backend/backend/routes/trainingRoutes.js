import express from 'express'; // Імпорт фреймворку Express
const router = express.Router(); // Створення об'єкту Router

// Імпорт функцій контролерів для керування тренуваннями
import {
    getAllTrainings,
    createTraining,
    getTrainingById,
    updateTraining,
    deleteTraining,
    completeTraining
} from '../controllers/trainingController.js';

// Імпорт middleware для автентифікації
import { admin, protect } from '../middleware/authMiddleware.js';

// Встановлення маршрутів та пов'язаних з ними функцій контролерів

// Отримання списку всіх тренувань
router.route('/').get(getAllTrainings);

// Додавання нового тренування
router.route('/').post(
    // protect, admin,
    createTraining);

// Отримання конкретного тренування за його ідентифікатором
router.route('/:id').get(getTrainingById);

// Оновлення тренування за його ідентифікатором
router.route('/:id').put(
    // protect, admin,
    updateTraining);

// Видалення тренування за його ідентифікатором
router.route('/:id').delete(
    // protect, admin,
    deleteTraining);
router.route('/:id/complete').put(
    // protect,
    completeTraining);

export default router; // Експорт об'єкту Router для використання в інших частинах додатку
