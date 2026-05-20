import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const mode = useSelector((s) => s.theme.mode);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);
  return children;
}
