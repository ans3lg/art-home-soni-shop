
const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');

// Получить все мастер-классы
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получить мастер-класс по ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Создать новый мастер-класс
router.post('/', async (req, res) => {
  const workshop = new Workshop(req.body);
  try {
    const newWorkshop = await workshop.save();
    res.status(201).json(newWorkshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Обновить мастер-класс
router.patch('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    res.json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Удалить мастер-класс
router.delete('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Мастер-класс не найден' });
    }
    res.json({ message: 'Мастер-класс удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
