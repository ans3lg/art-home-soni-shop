
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getItemCount } = useCart();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-studio-600 font-semibold" : "text-gray-700 hover:text-studio-600";
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-display font-bold text-studio-800 italic">Art Home Soni</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link to="/" className={`${isActive("/")} transition-colors duration-200`}>
              Главная
            </Link>
            <Link to="/paintings" className={`${isActive("/paintings")} transition-colors duration-200`}>
              Картины
            </Link>
            <Link to="/workshops" className={`${isActive("/workshops")} transition-colors duration-200`}>
              Мастер-классы
            </Link>
            <Link to="/tracking" className={`${isActive("/tracking")} transition-colors duration-200`}>
              Отслеживание
            </Link>
            <Link to="/about" className={`${isActive("/about")} transition-colors duration-200`}>
              О студии
            </Link>
          </nav>
          
          {/* Shopping Cart */}
          <div className="flex items-center">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-studio-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              </Button>
            </Link>
            
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <nav className="flex flex-col py-4 space-y-4">
              <Link 
                to="/" 
                className={`${isActive("/")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                to="/paintings" 
                className={`${isActive("/paintings")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Картины
              </Link>
              <Link 
                to="/workshops" 
                className={`${isActive("/workshops")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Мастер-классы
              </Link>
              <Link 
                to="/tracking" 
                className={`${isActive("/tracking")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                Отслеживание
              </Link>
              <Link 
                to="/about" 
                className={`${isActive("/about")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                О студии
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
