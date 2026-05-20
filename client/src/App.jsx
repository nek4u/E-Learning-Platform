import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import { fetchMe } from './redux/slices/authSlice';
import ThemeProvider from './contexts/ThemeProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
});

function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);
  return children;
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <ErrorBoundary>
              <AuthInitializer>
                <AppRoutes />
              </AuthInitializer>
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </ErrorBoundary>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
}
