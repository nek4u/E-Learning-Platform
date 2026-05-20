import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { toggleAiChat } from '../../redux/slices/uiSlice';
import { NAV_LINKS, ROLE_ROUTES } from '../../constants';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const mode = useSelector((s) => s.theme.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dashboardPath = user ? ROLE_ROUTES[user.role] || '/dashboard/student' : '/login';

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 font-display text-lg font-bold text-white">
            IA
          </div>
          <span className="font-display text-xl font-bold gradient-text">InAcademy</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.path} to={link.path} className="text-sm font-medium text-slate-600 transition hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/search')} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => dispatch(toggleAiChat())} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="AI Assistant">
            <Sparkles className="h-5 w-5 text-primary-500" />
          </button>
          <button onClick={() => dispatch(toggleTheme())} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            {mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/notifications" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Bell className="h-5 w-5" />
              </Link>
              <Link to={dashboardPath} className="hidden rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 sm:block">
                Dashboard
              </Link>
              <button onClick={() => logout()} className="hidden text-sm font-medium text-slate-600 sm:block dark:text-slate-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm font-medium sm:block">Login</Link>
              <Link to="/register" className="btn-primary hidden py-2 text-sm sm:inline-flex">Get Started</Link>
            </>
          )}
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-slate-200 px-4 py-4 lg:hidden dark:border-slate-700">
            {NAV_LINKS.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className="block py-2 font-medium">
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary mt-4 w-full">Get Started</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
