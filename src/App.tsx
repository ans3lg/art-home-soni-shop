
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./pages/Homepage";
import PaintingsPage from "./pages/PaintingsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import TrackingPage from "./pages/TrackingPage";
import AboutPage from "./pages/AboutPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Homepage />} />
                <Route path="paintings" element={<PaintingsPage />} />
                <Route path="workshops" element={<WorkshopsPage />} />
                <Route path="tracking" element={<TrackingPage />} />
                <Route path="about" element={<AboutPage />} />
                
                {/* Auth Routes */}
                <Route element={<ProtectedRoute requiresAuth={false} />}>
                  <Route path="auth" element={<AuthPage />} />
                </Route>
                
                {/* Protected Routes (User) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="cart" element={<CartPage />} />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="orders" element={<OrderHistoryPage />} />
                </Route>
                
                {/* Admin Routes */}
                <Route element={<ProtectedRoute requiresAdmin={true} />}>
                  <Route path="admin" element={<AdminPanelPage />} />
                </Route>
                
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
