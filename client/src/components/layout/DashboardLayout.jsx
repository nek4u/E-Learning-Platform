import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';

const studentLinks = [
  { to: '/dashboard/student', label: 'Overview' },
  { to: '/dashboard/student/courses', label: 'My Courses' },
  { to: '/dashboard/student/tests', label: 'Tests' },
  { to: '/dashboard/student/certificates', label: 'Certificates' },
];

const educatorLinks = [
  { to: '/dashboard/educator', label: 'Overview' },
  { to: '/dashboard/educator/courses', label: 'Courses' },
  { to: '/dashboard/educator/live', label: 'Live Classes' },
];

const adminLinks = [
  { to: '/dashboard/admin', label: 'Overview' },
  { to: '/dashboard/admin/users', label: 'Users' },
  { to: '/dashboard/admin/courses', label: 'Moderation' },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const links = user?.role === 'educator' ? educatorLinks
    : ['admin', 'super_admin', 'moderator'].includes(user?.role) ? adminLinks
    : studentLinks;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="card sticky top-24 space-y-1 p-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block rounded-lg px-4 py-2 text-sm font-medium transition ${
                  location.pathname === link.to
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
