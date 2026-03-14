import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-white text-3xl font-bold">EduLearn</h1>
        <div className="space-x-4">
          <Link to="/login" className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Login
          </Link>
          <Link to="/register" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700">
            Register
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h2 className="text-6xl font-bold mb-6">Learn Smart, Grow Fast</h2>
        <p className="text-2xl mb-12">Your journey to excellence starts here</p>
        <div className="flex justify-center space-x-6">
          <Link to="/register" className="bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100">
            Get Started
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Interactive Lessons', desc: 'Engaging video content' },
            { title: 'Live Classes', desc: 'Learn from expert teachers' },
            { title: 'Track Progress', desc: 'Monitor your growth' }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-lg p-8 shadow-lg">
              <h4 className="text-2xl font-bold text-purple-600 mb-4">{feature.title}</h4>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-white text-center mb-12">Testimonials</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: 'Student A', text: 'Amazing platform! Improved my grades.' },
            { name: 'Teacher B', text: 'Great tools for managing classes.' }
          ].map((testimonial, i) => (
            <div key={i} className="bg-white rounded-lg p-8 shadow-lg">
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <p className="font-bold text-purple-600">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing;
