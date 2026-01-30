import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AboutUs() {
  const navigate = useNavigate();

  const scrollToFooter = () => {
    const footerElement = document.getElementById('contact-footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-amber-50/30 to-primary-50/20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="section-title mb-6">About Grills & Gather</h1>
          <p className="section-subtitle mx-auto">
            Discover our story, mission, and commitment to providing exceptional dining experiences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-5">Our Story</h2>
            <p className="text-neutral-700 mb-5 leading-relaxed">
              Grills & Gather was founded with a simple vision: to create a place where friends and family 
              could come together to enjoy exceptional food in a warm, welcoming atmosphere. What started as 
              a small family venture has grown into a beloved dining destination known for our commitment 
              to quality and hospitality.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Our journey began over a decade ago when our founders recognized the need for a restaurant 
              that truly brings people together. Today, we continue to honor that vision by sourcing the 
              finest ingredients, crafting innovative dishes, and providing outstanding service.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="badge badge-primary">Quality</span>
              <span className="badge badge-secondary">Hospitality</span>
              <span className="badge badge-accent">Tradition</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-accent-50 border-2 border-dashed border-primary-200 rounded-2xl w-full h-80 sm:h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-200 rounded-full mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-neutral-600 font-medium">Restaurant Image</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">Our Mission</h3>
            <p className="text-neutral-700">
              To create memorable dining experiences that bring people together through exceptional food, 
              warm hospitality, and a welcoming atmosphere.
            </p>
          </div>
          
          <div className="card text-center hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">Our Vision</h3>
            <p className="text-neutral-700">
              To be the premier destination for those seeking quality cuisine and genuine connection, 
              fostering community one meal at a time.
            </p>
          </div>
          
          <div className="card text-center hover:shadow-elegant-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">Our Values</h3>
            <p className="text-neutral-700">
              Quality, authenticity, community, and sustainability guide everything we do, from sourcing 
              ingredients to serving our guests.
            </p>
          </div>
        </div>

    

        <div className="text-center">
          

        </div>
        
        <div className="text-center mb-12">
          <div className="card border border-primary-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-serif font-bold text-neutral-900 mb-3">Ready to Experience Excellence?</h3>
                <p className="text-neutral-700 mb-5">
                  Book your table now for an unforgettable dining experience with our exceptional cuisine and warm hospitality.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/" className="btn-primary inline-flex items-center justify-center gap-2">
                    <span>Book Your Table</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </a>
                  <a href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
                    <span>View Our Menu</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="bg-gradient-to-br from-primary-100 to-accent-100 w-24 h-24 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer id="contact-footer" className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4 text-white">Grills & Gather</h3>
              <p className="text-neutral-300 mb-4">Experience the finest dining with our delicious food and excellent service.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="/" className="text-neutral-300 hover:text-primary-400 transition-colors duration-300">Home</a></li>
                <li><a href="/about" className="text-neutral-300 hover:text-primary-400 transition-colors duration-300">About Us</a></li>
                <li><a 
                  href="#contact-footer" 
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToFooter();
                  }}
                  className="text-neutral-300 hover:text-primary-400 transition-colors duration-300"
                >
                  Contact
                </a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold mb-4 text-white">Contact Info</h3>
              <ul className="space-y-3 text-neutral-300">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9840923097
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9848675285
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  grillsandgather@gmail.com
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-primary-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Grills & Gather, Balkot</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-700">
            <h3 className="text-lg font-serif font-bold mb-4 text-white text-center">Find Us</h3>
            <div className="rounded-2xl overflow-hidden border border-neutral-700 shadow-elegant">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d403.7530625579317!2d85.3660333256802!3d27.664689598970888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1b093dec14f3%3A0x90b02fb7b0713ace!2sGrills%20and%20Gather!5e1!3m2!1sen!2snp!4v1766763639443!5m2!1sen!2snp" 
                width="100%" 
                height="300" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Grills & Gather Location Map"
              />
            </div>
          </div>
          <div className="border-t border-neutral-700 mt-8 pt-6 text-center text-neutral-400">
            <p>&copy; {new Date().getFullYear()} Grills & Gather. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}