
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-display font-bold text-studio-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Упс! Страница не найдена</p>
      <p className="text-center text-gray-500 max-w-lg mb-8">
        Страница, которую вы ищете, не существует или была перемещена.
        Пожалуйста, вернитесь на главную страницу.
      </p>
      <Button asChild size="lg">
        <Link to="/">Вернуться на главную</Link>
      </Button>
    </div>
  );
}
