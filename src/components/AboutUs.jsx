import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          About Us
        </h1>

        {/* Mission Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At <span className="text-blue-600 font-semibold">RateCompany</span>, 
            our mission is to empower users to make informed decisions about companies. 
            We aim to create a transparent platform where employees, customers, 
            and stakeholders can share their experiences and insights to help 
            others understand the culture, services, and ethics of companies worldwide.
          </p>
        </section>

        {/* Vision Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            We envision a world where companies are held accountable through honest feedback.
            By fostering trust and transparency, we hope to improve workplaces, enhance 
            customer satisfaction, and encourage ethical practices across industries.
          </p>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Team</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our team is passionate about providing a reliable platform for users. 
            With expertise in technology, user experience, and data analytics, 
            we work tirelessly to ensure that <span className="text-blue-600 font-semibold">RateCompany</span> 
            remains an unbiased and easy-to-use platform.
          </p>
          <ul className="list-disc pl-5 text-gray-600">
            <li>Kaushal - Founder and Developer</li>
            <li>Jane Doe - Product Manager</li>
            <li>John Smith - Backend Developer</li>
            <li>Emily Clark - UI/UX Designer</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} RateCompany. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AboutUs;
