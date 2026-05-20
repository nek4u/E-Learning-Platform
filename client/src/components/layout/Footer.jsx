import { Link } from 'react-router-dom';
import { EXAM_CATEGORIES } from '../../constants';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 font-bold text-white">IA</div>
              <span className="font-display text-xl font-bold text-white">InAcademy</span>
            </div>
            <p className="mt-4 text-sm text-slate-400">India&apos;s premier e-learning platform. Learn from the best educators.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Exams</h4>
            <ul className="mt-4 space-y-2">
              {EXAM_CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm hover:text-primary-400">{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/courses" className="hover:text-primary-400">Courses</Link></li>
              <li><Link to="/live" className="hover:text-primary-400">Live Classes</Link></li>
              <li><Link to="/tests" className="hover:text-primary-400">Mock Tests</Link></li>
              <li><Link to="/pricing" className="hover:text-primary-400">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Newsletter</h4>
            <p className="mt-4 text-sm text-slate-400">Get study tips and offers.</p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="input-field flex-1 text-sm" />
              <button type="submit" className="btn-primary py-2 text-sm">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} InAcademy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
