import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isAdmin?: boolean;
  adminEmail?: string | null;
  onLogout?: () => void;
}

export default function Navbar({ isAdmin = false, adminEmail, onLogout }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToContact = () => {
    // Close the mobile menu if it's open
    setIsMenuOpen(false);
    
    // Wait for menu to close then scroll
    setTimeout(() => {
      const footerElement = document.getElementById('contact-footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If no footer with id found, scroll to the actual page footer
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side: Logo and Restaurant Name */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <img
                  src="/logoHD.png" 
                  alt="Grill & Gather Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-300">
                  {isAdmin ? 'Restaurant Admin' : 'Grills & Gather'}
                </h1>
                {!isAdmin && (
                  <p className="text-sm text-neutral-600 font-sans">Fine Dining Experience</p>
                )}
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {isAdmin && adminEmail && (
              <div className="text-base text-neutral-700 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                <span className="font-medium">Admin:</span> 
                <span className="font-medium text-primary-600">{adminEmail}</span>
              </div>
            )}

            {isAdmin && onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-300 shadow-elegant hover:shadow-elegant-lg font-medium text-base"
              >
                <span>Logout</span>
              </button>
            )}

            {/* Navigation links */}
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base"
                >
                  Home
                </a>
              ) : (
                <>
                  <Link to="/" className="px-4 py-2.5 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base">
                    Home
                  </Link>
                  <Link to="/about" className="px-4 py-2.5 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base">
                    About Us
                  </Link>
                  <a 
                    href="#contact" 
                    className="px-4 py-2.5 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToContact();
                    }}
                  >
                    Contact
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-neutral-700 hover:text-primary-600 focus:outline-none p-2 rounded-lg hover:bg-neutral-100 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only visible when menu is open */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-neutral-200 bg-white rounded-b-2xl shadow-elegant">
            <div className="flex flex-col gap-3 px-4">
              {isAdmin && adminEmail && (
                <div className="text-base text-neutral-700 py-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="font-medium">Admin:</span> 
                  <span className="font-medium text-primary-600">{adminEmail}</span>
                </div>
              )}

              {isAdmin ? (
                <>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  {isAdmin && onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-300 shadow-elegant hover:shadow-elegant-lg font-medium text-base"
                    >
                      Logout
                    </button>
                  )}
                </>
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/about" 
                    className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <a 
                    href="#contact" 
                    className="px-4 py-3 text-neutral-700 font-medium hover:bg-neutral-100 hover:text-primary-600 rounded-xl transition-all duration-300 text-base"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToContact();
                    }}
                  >
                    Contact
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}