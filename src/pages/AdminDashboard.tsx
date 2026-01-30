import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../components/AdminPanel';
import Navbar from '../components/Navbar';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { isAdminLoggedIn, adminEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
    }
  }, [isAdminLoggedIn, navigate]);

  // Show session warning 1 hour before expiration (22 hours after login)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Calculate remaining time until warning should appear (22 hours after login)
    const sessionData = localStorage.getItem('adminSession');
    if (sessionData) {
      try {
        const parsedData = JSON.parse(sessionData);
        const timeElapsed = Date.now() - parsedData.timestamp;
        const timeUntilWarning = Math.max(0, (22 * 60 * 60 * 1000) - timeElapsed);
        
        const warningTimer = setTimeout(() => {
          setShowSessionWarning(true);
        }, timeUntilWarning);

        return () => {
          clearTimeout(warningTimer);
        };
      } catch (error) {
        console.error('Error calculating session warning time:', error);
      }
    }
  }, [isAdminLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!isAdminLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showSessionWarning && (
        <div className="fixed top-4 right-4 bg-white border border-amber-200 shadow-lg p-4 rounded-lg z-50 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-sm mb-1">Session Expiring Soon</p>
              <p className="text-xs text-gray-600">Your session will expire in 1 minute due to inactivity.</p>
            </div>
          </div>
        </div>
      )}

      <Navbar isAdmin={true} adminEmail={adminEmail || undefined} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                Restaurant Administration
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Manage your restaurant operations</p>
            </div>
          </div>
        </div>
        <AdminPanel />
      </main>
      
      <footer id="contact-footer" className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4 text-orange-400">
                Grill & Gathering
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience the finest dining with our delicious food and excellent service.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-serif font-semibold mb-4 text-white">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm inline-block">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm inline-block">
                    About Us
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact-footer" 
                    onClick={(e) => {
                      e.preventDefault();
                      const footerElement = document.getElementById('contact-footer');
                      if (footerElement) {
                        footerElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm inline-block"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-serif font-semibold mb-4 text-white">
                Contact Info
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-200">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>9840923097</span>
                </li>
                <li className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-200">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>9848675285</span>
                </li>
                <li className="flex items-center gap-2 hover:text-orange-400 transition-colors duration-200">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>grillsandgather@gmail.com</span>
                </li>
                <li className="flex items-start gap-2 hover:text-orange-400 transition-colors duration-200">
                  <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Grills and Gather, Balkot</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Grill & Gathering. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}