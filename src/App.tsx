import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Donate from "./pages/Donate";
import Stories from "./pages/Stories";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostForm from "./pages/admin/AdminPostForm";
import AdminUpdates from "./pages/admin/AdminUpdates";
import AdminUpdateForm from "./pages/admin/AdminUpdateForm";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscribers from "./pages/admin/AdminSubscribers";
import AdminShop from "./pages/admin/AdminShop";
import AdminShopItemForm from "./pages/admin/AdminShopItemForm";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/events" element={<Events />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/new" element={<AdminEventForm />} />
              <Route path="events/:id" element={<AdminEventForm />} />
              <Route path="updates" element={<AdminUpdates />} />
              <Route path="updates/new" element={<AdminUpdateForm />} />
              <Route path="updates/:id" element={<AdminUpdateForm />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="posts/new" element={<AdminPostForm />} />
              <Route path="posts/:id" element={<AdminPostForm />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="shop" element={<AdminShop />} />
              <Route path="shop/new" element={<AdminShopItemForm />} />
              <Route path="shop/:id" element={<AdminShopItemForm />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
