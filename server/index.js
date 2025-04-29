
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');

// Загрузка переменных окружения
dotenv.config();

// Инициализация Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Подключение к базе данных MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB подключена'))
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));

// Настройка статических файлов
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/paintings', require('./routes/paintings'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/promocodes', require('./routes/promocodes'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/reports', require('./routes/reports'));

// Базовый маршрут для проверки API
app.get('/api', (req, res) => {
  res.json({ message: 'Art Home Soni API работает' });
});

// Порт для сервера
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
