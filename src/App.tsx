import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import { ToastProvider } from "./components/common/Toast";
import { FranchiseModalProvider } from "./components/common/FranchiseModal";
import { authService } from "./services/data";

import Home from "./views/Home";
import Story from "./views/Story";
import Franchise from "./views/Franchise";
import FAQ from "./views/FAQ";
import Outlets from "./views/Outlets";
import OutletDetail from "./views/OutletDetail";
import Contact from "./views/Contact";
import Blog from "./views/Blog";
import BlogDetail from "./views/BlogDetail";

import Cakes from "./views/Cakes";
import CakeDetail from "./views/CakeDetail";
import Factory from "./views/Factory";
import About from "./views/About";
import NotFound from "./views/NotFound";

import AdminLogin from "./views/admin/AdminLogin";
import AdminDashboard from "./views/admin/AdminDashboard";
import AdminFranchises from "./views/admin/AdminFranchises";
import AdminFranchiseForm from "./views/admin/AdminFranchiseForm";
import AdminEnquiries from "./views/admin/AdminEnquiries";
import AdminCakes from "./views/admin/AdminCakes";
import AdminRecipes from "./views/admin/AdminRecipes";
import AdminHeroContent from "./views/admin/AdminHeroContent";
import AdminSettings from "./views/admin/AdminSettings";
import AdminAccount from "./views/admin/AdminAccount";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
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
    <ToastProvider>
      <FranchiseModalProvider>
        <ScrollToTop />
        <Routes>
          {/* Main 7 Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/our-story" element={<PublicLayout><Story /></PublicLayout>} />
          <Route path="/story" element={<Navigate to="/our-story" replace />} />
          <Route path="/franchise" element={<PublicLayout><Franchise /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/outlets" element={<PublicLayout><Outlets /></PublicLayout>} />
          <Route path="/outlets/:id" element={<PublicLayout><OutletDetail /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:id" element={<PublicLayout><BlogDetail /></PublicLayout>} />

          {/* Legacy internal routes */}
          <Route path="/cakes" element={<PublicLayout><Cakes /></PublicLayout>} />
          <Route path="/cakes/:id" element={<PublicLayout><CakeDetail /></PublicLayout>} />
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
          <Route path="/admin/settings" element={<RequireAuth><AdminSettings /></RequireAuth>} />
          <Route path="/admin/account" element={<RequireAuth><AdminAccount /></RequireAuth>} />

          <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
        </Routes>
      </FranchiseModalProvider>
    </ToastProvider>
  );
}
