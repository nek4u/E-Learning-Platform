import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const CoursesPage = lazy(() => import('../pages/courses/CoursesPage'));
const CourseDetailPage = lazy(() => import('../pages/courses/CourseDetailPage'));
const LearnPage = lazy(() => import('../pages/learn/LearnPage'));
const CategoryPage = lazy(() => import('../pages/category/CategoryPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const TestsPage = lazy(() => import('../pages/tests/TestsPage'));
const TestAttemptPage = lazy(() => import('../pages/tests/TestAttemptPage'));
const LiveClassesPage = lazy(() => import('../pages/live/LiveClassesPage'));
const LiveRoomPage = lazy(() => import('../pages/live/LiveRoomPage'));
const CommunityPage = lazy(() => import('../pages/community/CommunityPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const PricingPage = lazy(() => import('../pages/PricingPage'));
const StudentDashboard = lazy(() => import('../pages/dashboard/StudentDashboard'));
const EducatorDashboard = lazy(() => import('../pages/dashboard/EducatorDashboard'));
const AdminDashboard = lazy(() => import('../pages/dashboard/AdminDashboard'));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:slug" element={<CourseDetailPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="category/:slug" element={<CategoryPage />} />
          <Route path="tests" element={<TestsPage />} />
          <Route path="tests/:id" element={<TestAttemptPage />} />
          <Route path="live" element={<LiveClassesPage />} />
          <Route path="live/:id" element={<LiveRoomPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="learn/:slug/:lectureId" element={<LearnPage />} />
        </Route>

        <Route path="dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="student" element={<ProtectedRoute roles={['student', 'educator', 'admin', 'super_admin']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="educator" element={<ProtectedRoute roles={['educator', 'admin', 'super_admin']}><EducatorDashboard /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute roles={['admin', 'super_admin', 'moderator']}><AdminDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
