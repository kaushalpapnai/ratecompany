import React from 'react';

const HomePage = () => {
  const topCompanies = [
    { id: 1, name: 'TechCorp', industry: 'Technology', rating: 4.8 },
    { id: 2, name: 'HealthPlus', industry: 'Healthcare', rating: 4.7 },
    { id: 3, name: 'EcoSolutions', industry: 'Environment', rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">RateCompany</h1>
        <p className="text-lg mt-4">Discover, Rate, and Review Companies Worldwide</p>
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search for companies..."
            className="p-3 rounded-md w-2/3 max-w-md text-gray-700"
          />
          <button className="ml-2 bg-white text-blue-600 px-4 py-3 rounded-md hover:bg-gray-200">
            Search
          </button>
        </div>
      </header>

      {/* Top Rated Companies */}
      <section className="py-12 px-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Top Rated Companies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{company.name}</h3>
              <p className="text-gray-600">{company.industry}</p>
              <p className="text-yellow-500 font-bold mt-2">
                ⭐ {company.rating.toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2024 RateCompany. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
