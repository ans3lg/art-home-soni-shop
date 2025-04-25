
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-studio-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Art Home Soni</h3>
            <p className="text-gray-300 mb-4">
              Художественная студия, где искусство оживает в каждом штрихе. Мы предлагаем 
              уникальные картины и увлекательные мастер-классы для всех уровней мастерства.
            </p>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/paintings" className="text-gray-300 hover:text-white transition-colors">
                  Картины
                </Link>
              </li>
              <li>
                <Link to="/workshops" className="text-gray-300 hover:text-white transition-colors">
                  Мастер-классы
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-gray-300 hover:text-white transition-colors">
                  Отслеживание
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  О студии
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h3 className="text-xl font-display font-medium mb-4">Контакты</h3>
            <address className="text-gray-300 not-italic">
              <p className="mb-2">Адрес: ул. Художественная, 42</p>
              <p className="mb-2">Телефон: +7 (999) 123-45-67</p>
              <p className="mb-2">Email: info@arthomesoni.ru</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Art Home Soni. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
