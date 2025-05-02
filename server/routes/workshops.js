
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Workshop = require('../models/Workshop');
const { auth, admin, artist, owner } = require('../middleware/auth');

// Настройка хранилища для загрузки изображений
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadsDir = path.join(__dirname, '../uploads');
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

// Получить все мастер-классы
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().populate('author', 'name');
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить мастер-класс по ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate('author', 'name');
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новый мастер-класс
router.post('/', auth, artist, upload.single('image'), async (req, res) => {
  try {
    console.log('Received workshop data:', req.body);
    console.log('Received workshop file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ message: 'Изображение обязательно' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    const workshopData = {
      ...req.body,
      image: imageUrl,
      price: Number(req.body.price),
      availableSpots: Number(req.body.availableSpots),
      author: req.user.id,
      authorName: req.body.authorName || req.user.name
    };
    
    const workshop = new Workshop(workshopData);
    const newWorkshop = await workshop.save();
    
    res.status(201).json(newWorkshop);
  } catch (error) {
    console.error('Error creating workshop:', error);
    res.status(400).json({ message: error.message });
  }
});

// Обновить мастер-класс
router.put('/:id', auth, owner(Workshop), upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
      
      const oldWorkshop = await Workshop.findById(req.params.id);
      if (oldWorkshop && oldWorkshop.image && !oldWorkshop.image.includes('http')) {
        const oldImagePath = path.join(__dirname, '..', oldWorkshop.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }
    
    if (updateData.price) {
      updateData.price = Number(updateData.price);
    }
    
    if (updateData.availableSpots) {
      updateData.availableSpots = Number(updateData.availableSpots);
    }
    
    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );
    
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    
    res.json(workshop);
  } catch (error) {
    console.error('Error updating workshop:', error);
    res.status(400).json({ message: error.message });
  }
});

// Удалить мастер-класс
router.delete('/:id', auth, owner(Workshop), async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    
    if (workshop.image && !workshop.image.includes('http')) {
      const imagePath = path.join(__dirname, '..', workshop.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Мастер-класс удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Записаться на мастер-класс
router.post('/:id/book', auth, async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    
    if (workshop.availableSpots <= 0) {
      return res.status(400).json({ message: 'Нет свободных мест' });
    }
    
    // Проверяем, не записан ли пользователь уже
    const alreadyRegistered = workshop.registeredParticipants.some(
      participant => participant.userId && participant.userId.toString() === req.user.id
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Вы уже записаны на этот мастер-класс' });
    }
    
    // Записываем на мастер-класс
    workshop.registeredParticipants.push({
      userId: req.user.id,
      name: req.body.name || req.user.name,
      email: req.body.email,
      phone: req.body.phone
    });
    
    // Уменьшаем количество доступных мест
    workshop.availableSpots -= 1;
    
    await workshop.save();
    
    res.status(200).json({ message: 'Вы успешно записаны на мастер-класс' });
  } catch (error) {
    console.error('Error booking workshop:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
