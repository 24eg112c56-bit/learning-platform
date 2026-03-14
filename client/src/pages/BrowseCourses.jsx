import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:5000/api/student/courses/${courseId}/enroll`);
      alert('Enrolled successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {courses.map(course => (
        <div key={course._id} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <p className="text-sm text-purple-600 mb-2">
            Teacher: {course.teacherId?.name}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {course.enrolledStudents?.length || 0} students enrolled
          </p>
          {user?.role === 'student' && (
            <button
              onClick={() => handleEnroll(course._id)}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Enroll Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BrowseCourses;
