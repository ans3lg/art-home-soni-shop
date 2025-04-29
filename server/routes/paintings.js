
const express = require('express');
const router = express.Router();
const Painting = require('../models/Painting');

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
router.post('/', async (req, res) => {
  const painting = new Painting(req.body);
  try {
    const newPainting = await painting.save();
    res.status(201).json(newPainting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Обновить картину
router.patch('/:id', async (req, res) => {
  try {
    const painting = await Painting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!painting) {
      return res.status(404).json({ message: 'Картина не найдена' });
    }
    res.json(painting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить картину
router.delete('/:id', async (req, res) => {
  try {
    const painting = await Painting.findByIdAndDelete(req.params.id);
    if (!painting) {
      return res.status(404).json({ message: 'Картина не найдена' });
    }
    res.json({ message: 'Картина удалена' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
