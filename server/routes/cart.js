
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { auth } = require('../middleware/auth');

// Получить корзину пользователя
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Если корзины нет, создаем пустую
      cart = new Cart({
        userId: req.user.id,
        items: []
      });
      await cart.save();
    }
    
    res.json(cart.items);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Добавить товар в корзину
router.post('/', auth, async (req, res) => {
  try {
    const { productId, itemType, title, price, quantity, image } = req.body;
    
    if (!productId || !itemType || !title || !price || !quantity || !image) {
      return res.status(400).json({ message: 'Все поля обязательны' });
    }
    
    let cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      // Если корзины нет, создаем новую
      cart = new Cart({
        userId: req.user.id,
        items: [{
          productId,
          itemType,
          title,
          price,
          quantity,
          image
        }]
      });
    } else {
      // Проверяем, есть ли уже такой товар в корзине
      const existingItemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId && item.itemType === itemType
      );
      
      if (existingItemIndex > -1) {
        // Если товар уже есть, увеличиваем его количество
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Если товара нет, добавляем его
        cart.items.push({
          productId,
          itemType,
          title,
          price,
          quantity,
          image
        });
      }
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.status(201).json(cart.items);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Обновить количество товара в корзине
router.put('/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Количество должно быть больше 0' });
    }
    
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    
    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json(cart.items);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Удалить товар из корзины
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }
    
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json(cart.items);
  } catch (error) {
    console.error('Delete from cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Очистить корзину
router.delete('/', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Корзина не найдена' });
    }
    
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();
    
    res.json({ message: 'Корзина очищена' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
