
const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const { auth, admin } = require('../middleware/auth');

// Get all promo codes (admin only)
router.get('/', auth, admin, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.json(promoCodes);
  } catch (error) {
    console.error('Get promo codes error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Create promo code (admin only)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { code, discountPercent, maxUses, expiresAt } = req.body;

    // Check if promo code already exists
    let promoCode = await PromoCode.findOne({ code });
    if (promoCode) {
      return res.status(400).json({ message: 'Промокод с таким названием уже существует' });
    }

    promoCode = new PromoCode({
      code,
      discountPercent,
      maxUses,
      expiresAt: expiresAt || null
    });

    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    console.error('Create promo code error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Verify promo code (for users)
router.post('/verify', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    const promoCode = await PromoCode.findOne({ 
      code, 
      active: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    if (!promoCode) {
      return res.status(404).json({ message: 'Промокод не найден или истек срок действия' });
    }

    if (promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ message: 'Промокод больше не действителен' });
    }

    res.json({
      code: promoCode.code,
      discountPercent: promoCode.discountPercent
    });
  } catch (error) {
    console.error('Verify promo code error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Use promo code (apply when order is placed)
router.post('/use', auth, async (req, res) => {
  try {
    const { code } = req.body;
    
    const promoCode = await PromoCode.findOne({ code, active: true });
    if (!promoCode) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }

    if (promoCode.usedCount >= promoCode.maxUses) {
      return res.status(400).json({ message: 'Промокод больше не действителен' });
    }

    // Increment usage count
    promoCode.usedCount += 1;
    
    // Deactivate if max uses reached
    if (promoCode.usedCount >= promoCode.maxUses) {
      promoCode.active = false;
    }

    await promoCode.save();
    res.json({ message: 'Промокод применен успешно' });
  } catch (error) {
    console.error('Use promo code error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Update promo code (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { discountPercent, maxUses, active, expiresAt } = req.body;
    
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }

    if (discountPercent) promoCode.discountPercent = discountPercent;
    if (maxUses) promoCode.maxUses = maxUses;
    if (active !== undefined) promoCode.active = active;
    if (expiresAt) promoCode.expiresAt = expiresAt;

    await promoCode.save();
    res.json(promoCode);
  } catch (error) {
    console.error('Update promo code error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Delete promo code (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }

    await promoCode.remove();
    res.json({ message: 'Промокод удален' });
  } catch (error) {
    console.error('Delete promo code error:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;
