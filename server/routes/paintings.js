
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Painting = require('../models/Painting');
const { auth, admin } = require('../middleware/auth');

// Настройка хранилища для загрузки изображений
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
    // Убеждаемся, что директория существует
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Получить все картины
router.get('/', async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить картину по ID
router.get('/:id', async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) {
      return res.status(404).json({ message: 'Картина не найдена' });
    }
    res.json(painting);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новую картину
router.post('/', auth, admin, upload.single('image'), async (req, res) => {
  try {
    console.log('Received data:', req.body);
    console.log('Received file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'Изображение обязательно' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const paintingData = {
      ...req.body,
      image: imageUrl,
      price: Number(req.body.price)
    };
    
    const painting = new Painting(paintingData);
    const newPainting = await painting.save();
    
    res.status(201).json(newPainting);
  } catch (error) {
    console.error('Error creating painting:', error);
    res.status(400).json({ message: error.message });
  }
});

// Обновить картину
router.put('/:id', auth, admin, upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Если загружено новое изображение
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      
      // Удаляем старое изображение
      const oldPainting = await Painting.findById(req.params.id);
      if (oldPainting && oldPainting.image && !oldPainting.image.includes('http')) {
        const oldImagePath = path.join(__dirname, '..', oldPainting.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    // Преобразуем price в число
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    
    const painting = await Painting.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!painting) {
      return res.status(404).json({ message: 'Картина не найдена' });
    }
    
    res.json(painting);
  } catch (error) {
    console.error('Error updating painting:', error);
    res.status(400).json({ message: error.message });
  }
});

// Удалить картину
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    
    if (!painting) {
      return res.status(404).json({ message: 'Картина не найдена' });
    }
    
    // Удаляем изображение, если оно не является внешней ссылкой
    if (painting.image && !painting.image.includes('http')) {
      const imagePath = path.join(__dirname, '..', painting.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Painting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Картина удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
