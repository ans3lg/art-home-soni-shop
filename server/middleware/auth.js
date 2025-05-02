
const jwt = require('jsonwebtoken');

// Authentication middleware
exports.auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Доступ запрещен. Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Недействительный токен' });
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
  }
  next();
};

// Artist middleware
exports.artist = (req, res, next) => {
  if (req.user.role !== 'artist' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Требуются права художника или администратора' });
  }
  next();
};

// Owner middleware - checks if user owns the resource or is admin
exports.owner = (model) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await model.findById(resourceId);
    
    if (!resource) {
      return res.status(404).json({ message: 'Ресурс не найден' });
    }
    
    // Admin can edit anything
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Check if current user is the owner
    if (resource.author && resource.author.toString() === req.user.id) {
      return next();
    }
    
    return res.status(403).json({ message: 'Доступ запрещен. Вы не являетесь автором этого ресурса' });
  } catch (error) {
    console.error('Owner middleware error:', error);
    res.status(500).json({ message: error.message });
  }
};
