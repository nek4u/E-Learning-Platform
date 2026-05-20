import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const isAuthRoute = (url = '') =>
  ['/auth/login', '/auth/register', '/auth/refresh', '/auth/forgot-password', '/auth/reset-password'].some(
    (path) => url.includes(path)
  );

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response) {
      return Promise.reject(
        Object.assign(error, { message: 'Cannot reach server. Start the backend: cd server && npm run dev' })
      );
    }
    if (error.response?.status === 401 && !original._retry && !isAuthRoute(original.url)) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, { withCredentials: true });
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        if (data.data.refreshToken) localStorage.setItem('refreshToken', data.data.refreshToken);
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const homeApi = { getHome: () => api.get('/home') };
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
};
export const courseApi = {
  getAll: (params) => api.get('/courses', { params }),
  getBySlug: (slug) => api.get(`/courses/${slug}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  updateProgress: (id, data) => api.put(`/courses/${id}/progress`, data),
  myEnrollments: () => api.get('/courses/my/enrollments'),
};
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};
export const quizApi = {
  getAll: (params) => api.get('/quizzes', { params }),
  getById: (id) => api.get(`/quizzes/${id}`),
  submit: (id, data) => api.post(`/quizzes/${id}/submit`, data),
  leaderboard: (id) => api.get(`/quizzes/${id}/leaderboard`),
};
export const searchApi = {
  search: (q) => api.get('/search', { params: { q } }),
  trending: () => api.get('/search/trending'),
};
export const studentApi = { dashboard: () => api.get('/student/dashboard') };
export const educatorApi = {
  dashboard: () => api.get('/educator/dashboard'),
  featured: () => api.get('/educator/featured'),
};
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: (params) => api.get('/admin/users', { params }),
  moderateCourse: (id, status) => api.put(`/admin/courses/${id}/moderate`, { status }),
};
export const aiApi = {
  chat: (message, context) => api.post('/ai/chat', { message, context }),
  studyPlanner: (goals, subjects) => api.post('/ai/study-planner', { goals, subjects }),
};
export const liveApi = {
  getAll: (params) => api.get('/live', { params }),
  join: (id) => api.post(`/live/${id}/join`),
};
export const communityApi = {
  getPosts: (params) => api.get('/community', { params }),
  createPost: (data) => api.post('/community', data),
};
export const wishlistApi = {
  get: () => api.get('/wishlist'),
  toggle: (courseId) => api.post(`/wishlist/${courseId}`),
};
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  markRead: (ids) => api.put('/notifications/read', { ids }),
};
export const paymentApi = {
  createOrder: (data) => api.post('/payments/order', data),
  verify: (data) => api.post('/payments/verify', data),
};
