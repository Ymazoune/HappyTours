import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HappyTours
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                Home
              </Link>
              <Link to="/tours" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                Tours
              </Link>
              {user && (
                <Link to="/my-bookings" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                  My Bookings
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-gray-700">Hello, {user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 