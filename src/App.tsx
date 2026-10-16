import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import { ToastProvider } from "./components/common/Toast";
import { FranchiseModalProvider } from "./components/common/FranchiseModal";
import { LoadingScreen } from "./components/common/Loading";
import { authService } from "./services/data";

// Core Public Views (Eager for instant First Contentful Paint)
import Home from "./views/Home";
import Story from "./views/Story";
import Franchise from "./views/Franchise";

// Lazy Public Views (Loaded on demand)
const FAQ = lazy(() => import("./views/FAQ"));
const OutletDetail = lazy(() => import("./views/OutletDetail"));
const Contact = lazy(() => import("./views/Contact"));
const Blog = lazy(() => import("./views/Blog"));
const BlogDetail = lazy(() => import("./views/BlogDetail"));

// Secondary & Feature Views
const Cakes = lazy(() => import("./views/Cakes"));
const CakeDetail = lazy(() => import("./views/CakeDetail"));
const CustomCake = lazy(() => import("./views/CustomCake"));
const Cart = lazy(() => import("./views/Cart"));
const Events = lazy(() => import("./views/Events"));
const EventDetail = lazy(() => import("./views/EventDetail"));
const Factory = lazy(() => import("./views/Factory"));
const About = lazy(() => import("./views/About"));
const NotFound = lazy(() => import("./views/NotFound"));

// Admin Routes (Lazy-loaded to keep public bundle light)
const AdminLogin = lazy(() => import("./views/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./views/admin/AdminDashboard"));
const AdminFranchises = lazy(() => import("./views/admin/AdminFranchises"));
const AdminFranchiseForm = lazy(() => import("./views/admin/AdminFranchiseForm"));
const AdminEnquiries = lazy(() => import("./views/admin/AdminEnquiries"));
const AdminCakes = lazy(() => import("./views/admin/AdminCakes"));
const AdminRecipes = lazy(() => import("./views/admin/AdminRecipes"));
const AdminHeroContent = lazy(() => import("./views/admin/AdminHeroContent"));
const AdminOrders = lazy(() => import("./views/admin/AdminOrders"));
const AdminEvents = lazy(() => import("./views/admin/AdminEvents"));
const AdminSettings = lazy(() => import("./views/admin/AdminSettings"));
const AdminAccount = lazy(() => import("./views/admin/AdminAccount"));

import { LanguageProvider } from "./context/LanguageContext";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    const hasScrollTarget = (location.state as { scrollTo?: string })?.scrollTo || location.hash;
    if (!hasScrollTarget) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location.pathname, location.state]);
  return null;
}

function RequireAuth({ children }: { children: React.ReactElement }) {
  if (!authService.isAuthed()) return <Navigate to="/admin/login" replace />;
  return children;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <FranchiseModalProvider>
          <ScrollToTop />
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
            {/* Main 7 Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/our-story" element={<PublicLayout><Story /></PublicLayout>} />
            <Route path="/story" element={<Navigate to="/our-story" replace />} />
            <Route path="/franchise" element={<PublicLayout><Franchise /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
            <Route path="/outlets" element={<Navigate to="/" state={{ scrollTo: "outlets" }} replace />} />
            <Route path="/outlets/:id" element={<PublicLayout><OutletDetail /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
            <Route path="/blog/:id" element={<PublicLayout><BlogDetail /></PublicLayout>} />

            {/* Catalog, Custom Builder & Ordering Routes */}
            <Route path="/cakes" element={<PublicLayout><Cakes /></PublicLayout>} />
            <Route path="/cakes/:id" element={<PublicLayout><CakeDetail /></PublicLayout>} />
            <Route path="/custom-cake" element={<PublicLayout><CustomCake /></PublicLayout>} />
            <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
            <Route path="/events/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
            <Route path="/factory" element={<PublicLayout><Factory /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

            {/* Admin Routes (NO Public Navigation) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/franchises" element={<RequireAuth><AdminFranchises /></RequireAuth>} />
            <Route path="/admin/franchises/add" element={<RequireAuth><AdminFranchiseForm /></RequireAuth>} />
            <Route path="/admin/franchises/edit/:id" element={<RequireAuth><AdminFranchiseForm /></RequireAuth>} />
            <Route path="/admin/enquiries" element={<RequireAuth><AdminEnquiries /></RequireAuth>} />
            <Route path="/admin/catalog" element={<RequireAuth><AdminCakes /></RequireAuth>} />
            <Route path="/admin/cakes" element={<RequireAuth><AdminCakes /></RequireAuth>} />
            <Route path="/admin/recipes" element={<RequireAuth><AdminRecipes /></RequireAuth>} />
            <Route path="/admin/hero" element={<RequireAuth><AdminHeroContent /></RequireAuth>} />
            <Route path="/admin/orders" element={<RequireAuth><AdminOrders /></RequireAuth>} />
            <Route path="/admin/events" element={<RequireAuth><AdminEvents /></RequireAuth>} />
            <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
            <Route path="/admin/account" element={<RequireAuth><AdminAccount /></RequireAuth>} />

            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </Suspense>
      </FranchiseModalProvider>
    </ToastProvider>
  </LanguageProvider>
  );
}
