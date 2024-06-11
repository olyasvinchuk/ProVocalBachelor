import asyncHandler from '../middleware/asyncHandler.js';
import Training from '../models/trainingModel.js';
import fs from 'fs';
import path from 'path';
import User from '../models/userModel.js';

const saveBase64File = (base64Data, filePath) => {
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    const ext = matches[1].split('/')[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    const filename = `${filePath}.${ext}`;

    if (buffer.length > 70 * 1024 * 1024) { // 50 МБ
        throw new Error('File size exceeds the limit of 50 MB');
    }

    const writeStream = fs.createWriteStream(filename);
    writeStream.write(buffer);
    writeStream.end();

    writeStream.on('error', (err) => {
        console.error(`Error writing file: ${err.message}`);
        throw new Error('Failed to save the file');
    });

    return filename;
};

const createTraining = asyncHandler(async (req, res) => {
    const { title, description, content, category, file } = req.body;
    const newTraining = new Training({
        title,
        description,
        category,
        content,
    });

    if (file) {
        const filePath = `uploads/${newTraining._id}`;
        try {
            const filename = saveBase64File(file, filePath);
            newTraining.file = {
                fileName: path.basename(filename),
                filePath: filename,
                fileType: file.split(';')[0].split(':')[1],
            };
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    await newTraining.save();
    res.status(201).json({ success: true, data: newTraining });
});

const updateTraining = asyncHandler(async (req, res) => {
    const { title, description, content, category, file } = req.body;
    const training = await Training.findById(req.params.id);

    if (!training) {
        return res.status(404).json({ success: false, error: 'Training not found' });
    }

    training.title = title;
    training.description = description;
    training.category = category;
    training.content = content;

    if (file) {
        const filePath = `uploads/${training._id}`;
        try {
            const filename = saveBase64File(file, filePath);
            training.file = {
                fileName: path.basename(filename),
                filePath: filename,
                fileType: file.split(';')[0].split(':')[1],
            };
        } catch (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
    }

    await training.save();
    res.json({ success: true, data: training });
});


// Отримання всіх тренувань з бази даних
const getAllTrainings = asyncHandler(async (req, res) => {
    const allTrainings = await Training.find().populate('category');

    if (!req.user) {
        res.json({ success: true, data: allTrainings });
        return;
    }

    const user = await User.findById(req.user._id);

    let unlockedTrainings = [];
    if (user.completedTrainings.length === 0) {
        unlockedTrainings = allTrainings.slice(0, 1);
    } else {
        const nextTrainingIndex = user.completedTrainings.length;
        unlockedTrainings = allTrainings.slice(0, nextTrainingIndex + 1);
    }

    res.json({ success: true, data: unlockedTrainings });
});


// Отримання конкретного тренування за його ідентифікатором
const getTrainingById = asyncHandler(async (req, res) => {
    const training = await Training.findById(req.params.id);
    if (!training) {
        res.status(404).json({ success: false, error: 'Training not found' });
        return;
    }
    res.json({ success: true, data: training });
});


// Видалення тренування за його ідентифікатором
const deleteTraining = asyncHandler(async (req, res) => {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
        res.status(404).json({ success: false, error: 'Training not found' });
        return;
    }

    if (training.file && fs.existsSync(training.file.filePath)) {
        fs.unlinkSync(training.file.filePath);
    }

    res.json({ success: true, data: {} });
});

// Оновлення прогресу користувача при завершенні тренування
const completeTraining = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!user.completedTrainings.includes(req.params.id)) {
        user.completedTrainings.push(req.params.id);
        await user.save();
    }

    res.json({ success: true, data: user.completedTrainings });
});

export {
    getAllTrainings,
    createTraining,
    getTrainingById,
    updateTraining,
    deleteTraining,
    completeTraining
};
