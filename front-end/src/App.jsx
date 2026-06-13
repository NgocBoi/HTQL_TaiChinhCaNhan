import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import AppRoutes from './routes/AppRoutes';

function ThemedToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerClassName="!top-4"
      toastOptions={{
        duration: 3500,
        className: '',
        style: {
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 500,
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f1f5f9' : '#0f172a',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          boxShadow: isDark
            ? '0 10px 25px rgba(0,0,0,0.4)'
            : '0 10px 25px rgba(0,0,0,0.08)',
        },
        success: {
          iconTheme: {
            primary: '#059669',
            secondary: isDark ? '#1e293b' : '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: isDark ? '#1e293b' : '#fff',
          },
        },
      }}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
