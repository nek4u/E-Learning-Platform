export const ROLES = {
  STUDENT: 'student',
  EDUCATOR: 'educator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
};

export const ROLE_ROUTES = {
  student: '/dashboard/student',
  educator: '/dashboard/educator',
  admin: '/dashboard/admin',
  super_admin: '/dashboard/admin',
  moderator: '/dashboard/admin',
};

export const EXAM_CATEGORIES = [
  { slug: 'upsc', name: 'UPSC', icon: '🏛️' },
  { slug: 'iit-jee', name: 'IIT JEE', icon: '🔬' },
  { slug: 'neet', name: 'NEET', icon: '🩺' },
  { slug: 'gate', name: 'GATE', icon: '⚙️' },
  { slug: 'ssc', name: 'SSC', icon: '📋' },
  { slug: 'banking', name: 'Banking', icon: '🏦' },
  { slug: 'cat', name: 'CAT', icon: '📊' },
  { slug: 'ca', name: 'CA', icon: '💼' },
  { slug: 'state-exams', name: 'State Exams', icon: '🗺️' },
  { slug: 'coding', name: 'Coding', icon: '💻' },
  { slug: 'web-development', name: 'Web Dev', icon: '🌐' },
  { slug: 'data-science', name: 'Data Science', icon: '📈' },
];

export const NAV_LINKS = [
  { label: 'Courses', path: '/courses' },
  { label: 'Categories', path: '/categories' },
  { label: 'Live Classes', path: '/live' },
  { label: 'Mock Tests', path: '/tests' },
  { label: 'Community', path: '/community' },
];
