import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';

import { trackPageView } from './utils/metaPixel';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PixelPageView = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__pixelInitialPageView) {
      trackPageView();
    } else {
      window.__pixelInitialPageView = true;
    }
  }, [pathname]);
  return null;
};

import PrivateRoute from './utils/PrivateRoute';
import PublicLayout from './components/PublicLayout';
import DashboardLayout from './components/DashboardLayout';
import { Dashboard, People, MenuBook, School, LocalOffer, TrendingUp, Payment, LibraryBooks, HelpOutline } from '@mui/icons-material';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyEnrollments from './pages/MyEnrollments';
import AdminCourses from './pages/AdminCourses';
import AdminCourseClases from './pages/AdminCourseClases';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import MaestroDashboard from './pages/MaestroDashboard';
import MaestroCourseDetail from './pages/MaestroCourseDetail';
import MaestroTutorial from './pages/MaestroTutorial';
import AlumnoDashboard from './pages/AlumnoDashboard';
import AlumnoMisCursos from './pages/AlumnoMisCursos';
import AlumnoCourseDetail from './pages/AlumnoCourseDetail';
import GoogleCallback from './pages/GoogleCallback';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import PaymentPage from './pages/PaymentPage';
import PaymentResult from './pages/PaymentResult';
import MyPayments from './pages/MyPayments';
import AdminCoupons from './pages/AdminCoupons';
import AdminIngresos from './pages/AdminIngresos';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AccessibilityStatement from './pages/AccessibilityStatement';
import AccessibilityWidget from './components/AccessibilityWidget';
import ProfilePage from './pages/ProfilePage';

const adminMenuItems = [
  { textKey: 'nav.dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
  { textKey: 'nav.users', icon: <People />, path: '/admin/usuarios' },
  { textKey: 'nav.courses', icon: <MenuBook />, path: '/admin/cursos' },
  { textKey: 'nav.coupons', icon: <LocalOffer />, path: '/admin/cupones' },
  { textKey: 'nav.income', icon: <TrendingUp />, path: '/admin/ingresos' },
];

const maestroMenuItems = [
  { textKey: 'nav.dashboard', icon: <Dashboard />, path: '/maestro/dashboard' },
  { textKey: 'tutorial.menuLabel', icon: <HelpOutline />, path: '/maestro/tutorial' },
];

const alumnoMenuItems = [
  { textKey: 'nav.dashboard', icon: <Dashboard />, path: '/alumno/dashboard' },
  { textKey: 'nav.myCourses', icon: <LibraryBooks />, path: '/alumno/mis-cursos' },
  { textKey: 'nav.courses', icon: <School />, path: '/cursos' },
  { textKey: 'nav.myPayments', icon: <Payment />, path: '/alumno/mis-pagos' },
];

const App = () => {
  return (
    <LanguageProvider>
      <CssBaseline />
      <SnackbarProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PixelPageView />
        <AuthProvider>
          <Routes>
            {/* Callbacks sin layout */}
            <Route path="/auth/callback" element={<GoogleCallback />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />

            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cursos" element={<Courses />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/accessibility" element={<AccessibilityStatement />} />
              <Route
                path="/cursos/:id"
                element={
                  <PrivateRoute>
                    <CourseDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/mis-cursos"
                element={
                  <PrivateRoute roles={['alumno']}>
                    <MyEnrollments />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Admin routes */}
            <Route
              element={
                <PrivateRoute roles={['admin']}>
                  <DashboardLayout titleKey="nav.adminPanel" menuItems={adminMenuItems} />
                </PrivateRoute>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminUsers />} />
              <Route path="/admin/cursos" element={<AdminCourses />} />
              <Route path="/admin/cursos/:id/clases" element={<AdminCourseClases />} />
              <Route path="/admin/cupones" element={<AdminCoupons />} />
              <Route path="/admin/ingresos" element={<AdminIngresos />} />
              <Route path="/admin/perfil" element={<ProfilePage />} />
            </Route>

            {/* Maestro routes */}
            <Route
              element={
                <PrivateRoute roles={['maestro']}>
                  <DashboardLayout titleKey="nav.maestroPanel" menuItems={maestroMenuItems} />
                </PrivateRoute>
              }
            >
              <Route path="/maestro/dashboard" element={<MaestroDashboard />} />
              <Route path="/maestro/tutorial" element={<MaestroTutorial />} />
              <Route path="/maestro/cursos/:id" element={<MaestroCourseDetail />} />
              <Route path="/maestro/perfil" element={<ProfilePage />} />
            </Route>

            {/* Alumno routes */}
            <Route
              element={
                <PrivateRoute roles={['alumno']}>
                  <DashboardLayout titleKey="nav.myPanel" menuItems={alumnoMenuItems} />
                </PrivateRoute>
              }
            >
              <Route path="/alumno/dashboard" element={<AlumnoDashboard />} />
              <Route path="/alumno/mis-cursos" element={<AlumnoMisCursos />} />
              <Route path="/alumno/cursos/:id" element={<AlumnoCourseDetail />} />
              <Route path="/alumno/curso/:id/pagar" element={<PaymentPage />} />
              <Route path="/alumno/pago-resultado" element={<PaymentResult />} />
              <Route path="/alumno/mis-pagos" element={<MyPayments />} />
              <Route path="/alumno/perfil" element={<ProfilePage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AccessibilityWidget />
        </AuthProvider>
      </BrowserRouter>
      </SnackbarProvider>
    </LanguageProvider>
  );
};

export default App;
