
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Layout from "./components/layout/Layout";
import Homepage from "./pages/Homepage";
import PaintingsPage from "./pages/PaintingsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import TrackingPage from "./pages/TrackingPage";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Homepage />} />
              <Route path="paintings" element={<PaintingsPage />} />
              <Route path="workshops" element={<WorkshopsPage />} />
              <Route path="tracking" element={<TrackingPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
