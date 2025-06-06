import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import HomePage from './components/pages/HomePage';
import ProjectPage from './components/pages/ProjectPage';
import NotFound from './pages/NotFound';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

// Initialize ApperUI once when the app loads
  useEffect(() => {
    if (!window.ApperSDK) {
      console.error("ApperSDK not loaded");
      setIsInitialized(true);
      return;
    }

    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = null;
        
        // Safe URLSearchParams usage with fallback
        try {
          if (typeof URLSearchParams !== 'undefined') {
            redirectPath = new URLSearchParams(window.location.search).get('redirect');
          } else {
            // Fallback for environments without URLSearchParams
            const searchParams = window.location.search;
            const match = searchParams.match(/[?&]redirect=([^&]*)/);
            redirectPath = match ? decodeURIComponent(match[1]) : null;
          }
        } catch (error) {
          console.error("Error parsing URL parameters:", error);
          redirectPath = null;
        }
        
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
                '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [navigate, dispatch]);
}, [navigate, dispatch]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
        if (window.ApperSDK && window.ApperSDK.ApperUI) {
          const { ApperUI } = window.ApperSDK;
          await ApperUI.logout();
        }
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
        // Still clear user and navigate even if SDK logout fails
        dispatch(clearUser());
        navigate('/login');
      }
    }
  };
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/error" element={<ErrorPage />} />
<Route path="/" element={<HomePage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/projects" element={<ProjectPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;