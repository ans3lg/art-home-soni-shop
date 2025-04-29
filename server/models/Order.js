
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemType'
      },
      itemType: {
        type: String,
        enum: ['Painting', 'Workshop']
      },
      title: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['В обработке', 'Подтвержден', 'Доставлен', 'Завершен', 'Отменен'],
    default: 'В обработке'
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: String,
  address: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);
