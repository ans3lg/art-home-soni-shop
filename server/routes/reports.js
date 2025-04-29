
const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const Order = require('../models/Order');
const Workshop = require('../models/Workshop');
const { auth, admin } = require('../middleware/auth');

// Получить отчет по продажам
router.get('/sales', auth, admin, async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    
    // Определяем начальную дату в зависимости от периода
    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Все время
    }
    
    // Получаем заказы за указанный период
    const orders = await Order.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    // Вычисление статистики
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    // Группировка данных по дням для графика
    const dailySales = {};
    orders.forEach(order => {
      const date = new Date(order.date).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = 0;
      }
      dailySales[date] += order.total;
    });
    
    // Преобразуем в формат для графика
    const chartData = Object.keys(dailySales).map(date => ({
      date,
      amount: dailySales[date]
    }));
    
    // Статистика по товарам
    const productStats = new Map();
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId ? item.productId.toString() : 'unknown';
        if (!productStats.has(productId)) {
          productStats.set(productId, {
            title: item.title,
            quantity: 0,
            revenue: 0
          });
        }
        
        const stat = productStats.get(productId);
        stat.quantity += item.quantity;
        stat.revenue += item.price * item.quantity;
      });
    });
    
    // Преобразуем Map в массив для ответа
    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    res.json({
      period,
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
      chartData,
      topProducts,
      recentOrders: orders.slice(-5)
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Получить отчет по мастер-классам
router.get('/workshops', auth, admin, async (req, res) => {
  try {
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    
    // Определяем начальную дату в зависимости от периода
    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Все время
    }
    
    // Получаем мастер-классы с учетом фильтра по дате
    const workshops = await Workshop.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });
    
    // Вычисление статистики
    const totalWorkshops = workshops.length;
    const totalParticipants = workshops.reduce((sum, workshop) => 
      sum + workshop.registeredParticipants.length, 0);
    const revenue = workshops.reduce((sum, workshop) => 
      sum + (workshop.registeredParticipants.length * workshop.price), 0);
    
    // Группировка данных по мастер-классам
    const workshopStats = workshops.map(workshop => ({
      id: workshop._id,
      title: workshop.title,
      date: new Date(workshop.date).toISOString().split('T')[0],
      participants: workshop.registeredParticipants.length,
      capacity: workshop.availableSpots + workshop.registeredParticipants.length,
      revenue: workshop.registeredParticipants.length * workshop.price
    }));
    
    // Группировка по дням для графика
    const dailyParticipants = {};
    workshops.forEach(workshop => {
      const date = new Date(workshop.date).toISOString().split('T')[0];
      if (!dailyParticipants[date]) {
        dailyParticipants[date] = 0;
      }
      dailyParticipants[date] += workshop.registeredParticipants.length;
    });
    
    // Преобразуем в формат для графика
    const chartData = Object.keys(dailyParticipants).map(date => ({
      date,
      participants: dailyParticipants[date]
    }));
    
    res.json({
      period,
      totalWorkshops,
      totalParticipants,
      revenue,
      averageParticipants: totalWorkshops > 0 ? totalParticipants / totalWorkshops : 0,
      workshopStats,
      chartData,
      upcomingWorkshops: workshops.filter(w => new Date(w.date) > new Date()).slice(0, 5)
    });
  } catch (error) {
    console.error('Workshops report error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Экспорт отчета в Excel
router.get('/export', auth, admin, async (req, res) => {
  try {
    const { type, period } = req.query;
    
    // Проверяем тип отчета
    if (!['sales', 'workshops'].includes(type)) {
      return res.status(400).json({ message: 'Неверный тип отчета' });
    }
    
    // Определяем период
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Все время
    }
    
    // Создаем рабочую книгу Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Art Home Soni';
    workbook.lastModifiedBy = 'Art Home Soni';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    if (type === 'sales') {
      // Экспорт отчета по продажам
      const orders = await Order.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
      
      // Создаем лист для общей информации
      const summarySheet = workbook.addWorksheet('Общая информация');
      
      // Добавляем заголовок
      summarySheet.mergeCells('A1:E1');
      summarySheet.getCell('A1').value = 'Отчет по продажам';
      summarySheet.getCell('A1').font = { size: 16, bold: true };
      summarySheet.getCell('A1').alignment = { horizontal: 'center' };
      
      // Добавляем информацию о периоде
      summarySheet.getCell('A3').value = 'Период:';
      summarySheet.getCell('B3').value = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      
      // Добавляем общую статистику
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      
      summarySheet.getCell('A5').value = 'Общая выручка:';
      summarySheet.getCell('B5').value = totalSales;
      summarySheet.getCell('B5').numFmt = '### ### ### ₽';
      
      summarySheet.getCell('A6').value = 'Количество заказов:';
      summarySheet.getCell('B6').value = totalOrders;
      
      summarySheet.getCell('A7').value = 'Средний чек:';
      summarySheet.getCell('B7').value = totalOrders > 0 ? totalSales / totalOrders : 0;
      summarySheet.getCell('B7').numFmt = '### ### ### ₽';
      
      // Создаем лист для заказов
      const ordersSheet = workbook.addWorksheet('Заказы');
      
      // Добавляем заголовки столбцов
      ordersSheet.columns = [
        { header: 'ID', key: 'id', width: 24 },
        { header: 'Дата', key: 'date', width: 15 },
        { header: 'Клиент', key: 'customer', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Сумма', key: 'total', width: 15 },
        { header: 'Статус', key: 'status', width: 15 }
      ];
      
      // Стили для заголовка
      ordersSheet.getRow(1).font = { bold: true };
      ordersSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Добавляем данные заказов
      orders.forEach(order => {
        ordersSheet.addRow({
          id: order._id.toString(),
          date: new Date(order.date).toLocaleDateString(),
          customer: order.customerName,
          email: order.customerEmail,
          total: order.total,
          status: order.status
        });
      });
      
      // Настройка форматирования
      ordersSheet.getColumn('total').numFmt = '### ### ### ₽';
      
      // Создаем лист для товаров
      const productsSheet = workbook.addWorksheet('Товары');
      
      // Добавляем заголовки столбцов
      productsSheet.columns = [
        { header: 'Название', key: 'title', width: 40 },
        { header: 'Количество продаж', key: 'quantity', width: 20 },
        { header: 'Выручка', key: 'revenue', width: 20 }
      ];
      
      // Стили для заголовка
      productsSheet.getRow(1).font = { bold: true };
      productsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Статистика по товарам
      const productStats = new Map();
      orders.forEach(order => {
        order.items.forEach(item => {
          const productId = item.productId ? item.productId.toString() : 'unknown';
          if (!productStats.has(productId)) {
            productStats.set(productId, {
              title: item.title,
              quantity: 0,
              revenue: 0
            });
          }
          
          const stat = productStats.get(productId);
          stat.quantity += item.quantity;
          stat.revenue += item.price * item.quantity;
        });
      });
      
      // Добавляем данные товаров
      Array.from(productStats.values())
        .sort((a, b) => b.revenue - a.revenue)
        .forEach(product => {
          productsSheet.addRow({
            title: product.title,
            quantity: product.quantity,
            revenue: product.revenue
          });
        });
      
      // Настройка форматирования
      productsSheet.getColumn('revenue').numFmt = '### ### ### ₽';
    } else {
      // Экспорт отчета по мастер-классам
      const workshops = await Workshop.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: 1 });
      
      // Создаем лист для общей информации
      const summarySheet = workbook.addWorksheet('Общая информация');
      
      // Добавляем заголовок
      summarySheet.mergeCells('A1:E1');
      summarySheet.getCell('A1').value = 'Отчет по мастер-классам';
      summarySheet.getCell('A1').font = { size: 16, bold: true };
      summarySheet.getCell('A1').alignment = { horizontal: 'center' };
      
      // Добавляем информацию о периоде
      summarySheet.getCell('A3').value = 'Период:';
      summarySheet.getCell('B3').value = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
      
      // Добавляем общую статистику
      const totalWorkshops = workshops.length;
      const totalParticipants = workshops.reduce((sum, workshop) => 
        sum + workshop.registeredParticipants.length, 0);
      const revenue = workshops.reduce((sum, workshop) => 
        sum + (workshop.registeredParticipants.length * workshop.price), 0);
      
      summarySheet.getCell('A5').value = 'Общая выручка:';
      summarySheet.getCell('B5').value = revenue;
      summarySheet.getCell('B5').numFmt = '### ### ### ₽';
      
      summarySheet.getCell('A6').value = 'Количество мастер-классов:';
      summarySheet.getCell('B6').value = totalWorkshops;
      
      summarySheet.getCell('A7').value = 'Всего участников:';
      summarySheet.getCell('B7').value = totalParticipants;
      
      summarySheet.getCell('A8').value = 'Среднее количество участников:';
      summarySheet.getCell('B8').value = totalWorkshops > 0 ? totalParticipants / totalWorkshops : 0;
      
      // Создаем лист для мастер-классов
      const workshopsSheet = workbook.addWorksheet('Мастер-классы');
      
      // Добавляем заголовки столбцов
      workshopsSheet.columns = [
        { header: 'Название', key: 'title', width: 40 },
        { header: 'Дата', key: 'date', width: 15 },
        { header: 'Количество участников', key: 'participants', width: 20 },
        { header: 'Вместимость', key: 'capacity', width: 15 },
        { header: 'Заполненность', key: 'fillRate', width: 15 },
        { header: 'Выручка', key: 'revenue', width: 20 }
      ];
      
      // Стили для заголовка
      workshopsSheet.getRow(1).font = { bold: true };
      workshopsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Добавляем данные мастер-классов
      workshops.forEach(workshop => {
        const participants = workshop.registeredParticipants.length;
        const capacity = workshop.availableSpots + participants;
        const fillRate = capacity > 0 ? Math.round((participants / capacity) * 100) : 0;
        
        workshopsSheet.addRow({
          title: workshop.title,
          date: new Date(workshop.date).toLocaleDateString(),
          participants,
          capacity,
          fillRate: `${fillRate}%`,
          revenue: participants * workshop.price
        });
      });
      
      // Настройка форматирования
      workshopsSheet.getColumn('revenue').numFmt = '### ### ### ₽';
      
      // Создаем лист для участников
      const participantsSheet = workbook.addWorksheet('Участники');
      
      // Добавляем заголовки столбцов
      participantsSheet.columns = [
        { header: 'Мастер-класс', key: 'workshop', width: 40 },
        { header: 'Дата', key: 'date', width: 15 },
        { header: 'Имя участника', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Телефон', key: 'phone', width: 20 },
        { header: 'Дата регистрации', key: 'registeredAt', width: 20 }
      ];
      
      // Стили для заголовка
      participantsSheet.getRow(1).font = { bold: true };
      participantsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      
      // Добавляем данные участников
      workshops.forEach(workshop => {
        workshop.registeredParticipants.forEach(participant => {
          participantsSheet.addRow({
            workshop: workshop.title,
            date: new Date(workshop.date).toLocaleDateString(),
            name: participant.name,
            email: participant.email,
            phone: participant.phone || 'Не указан',
            registeredAt: new Date(participant.registeredAt).toLocaleDateString()
          });
        });
      });
    }
    
    // Устанавливаем заголовки для файла Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-report-${period}.xlsx`);
    
    // Отправляем файл
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
