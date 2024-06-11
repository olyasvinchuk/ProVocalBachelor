import asyncHandler from '../middleware/asyncHandler.js'; // Middleware для обробки асинхронних операцій
import Category from "../models/categoryModel.js"; // Імпорт моделі Category

// Отримання всіх категорій з бази даних
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
});

// Створення нової категорії
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const newCategory = new Category({
        name: name,
    });

    await newCategory.save(); // Збереження нової категорії в базу даних
    res.status(201).json({ success: true, data: newCategory });
});

// Отримання конкретної категорії за її ідентифікатором
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
    }
    res.json({ success: true, data: category });
});

// Оновлення категорії за її ідентифікатором
const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
    }

    category.name = name;

    await category.save(); // Збереження оновленої категорії в базу даних
    res.json({ success: true, data: category });
});

// Видалення категорії за її ідентифікатором
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(404).json({ success: false, error: 'Category not found' });
        return;
    }

    res.json({ success: true, data: {} });
});

// Експорт функцій контролерів для використання в маршрутах
export {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
