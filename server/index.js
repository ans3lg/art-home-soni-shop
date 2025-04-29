
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

const app = express();

// Промежуточное ПО
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Подключаем маршруты API
const paintingsRoutes = require('./routes/paintings');
const workshopsRoutes = require('./routes/workshops');
const ordersRoutes = require('./routes/orders');

app.use('/api/paintings', paintingsRoutes);
app.use('/api/workshops', workshopsRoutes);
app.use('/api/orders', ordersRoutes);

// Базовый маршрут для проверки API
app.get('/api', (req, res) => {
  res.json({ message: 'Art Home Soni API работает' });
});

// Подключение к MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/art_home_soni';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Подключено к MongoDB');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
  });
