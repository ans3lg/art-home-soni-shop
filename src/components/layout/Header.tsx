
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getItemCount } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-studio-600 font-semibold" : "text-gray-700 hover:text-studio-600";
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const cartItemCount = getItemCount();

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
          
          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-studio-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name}
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="w-full cursor-pointer">
                        Личный кабинет
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="w-full cursor-pointer">
                        История заказов
                      </Link>
                    </DropdownMenuItem>
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="w-full cursor-pointer flex items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Админ панель
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Войти
                </Button>
              </Link>
            )}
            
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
              
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link 
                    to="/account" 
                    className={`${isActive("/account")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Личный кабинет
                  </Link>
                  <Link 
                    to="/orders" 
                    className={`${isActive("/orders")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    История заказов
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className={`${isActive("/admin")} px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Админ панель
                    </Link>
                  )}
                  
                  <button
                    className="px-2 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-left text-red-600"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                  >
                    Выйти
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <Link 
                  to="/auth" 
                  className={`${isActive("/auth")} px-2 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-200 text-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти / Регистрация
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
