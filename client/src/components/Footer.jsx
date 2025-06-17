function Footer() {
  return (
    <footer className="bg-white shadow-lg mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              HappyTours
            </h3>
            <p className="text-gray-600">
              Your trusted partner in creating unforgettable travel experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/tours" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tours
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: info@happytours.com
              </li>
              <li className="text-gray-600">
                Phone: +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} HappyTours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 