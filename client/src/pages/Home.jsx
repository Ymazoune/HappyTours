import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold mb-6 text-black">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore our curated collection of amazing tours and create unforgettable memories.
        </p>
        <Link
          to="/tours"
          className="inline-block px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          Browse Tours
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-blue-600 text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
          <p className="text-gray-600">Explore amazing places around the world with our carefully curated tours.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-blue-600 text-4xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
          <p className="text-gray-600">Learn from experienced guides who know every corner of your destination.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-blue-600 text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Best Value</h3>
          <p className="text-gray-600">Get the most out of your travel budget with our competitive prices.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl mb-8">Join thousands of happy travelers who have experienced our tours.</p>
        <Link
          to="/tours"
          className="inline-block px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
        >
          View All Tours
        </Link>
      </section>
    </div>
  );
}

export default Home; 