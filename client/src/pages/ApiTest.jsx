import React, { useState } from 'react';
import API_URL from '../config/api';

const ApiTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState('');

  const log = (label, status, data) => {
    setResults(prev => [{
      id: Date.now(),
      label,
      status,
      data: JSON.stringify(data, null, 2),
      time: new Date().toLocaleTimeString()
    }, ...prev]);
  };

  const run = async (label, fn) => {
    setLoading(label);
    try {
      const result = await fn();
      log(label, 'success', result);
    } catch (err) {
      log(label, 'error', { error: err.message, response: err.response?.data });
    } finally {
      setLoading('');
    }
  };

  const testHealth = () => run('Health Check', async () => {
    const res = await fetch(`${API_URL}/`);
    return res.json();
  });

  const testRegister = () => run('Register Student', async () => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `test${Date.now()}@test.com`,
        password: 'test123',
        role: 'student',
        grade: 'Grade 10',
        schoolName: 'Test School'
      })
    });
    return res.json();
  });

  const testLogin = () => run('Login (demo student)', async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@demo.com', password: 'demo123', role: 'student' })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('test_token', data.token);
    return data;
  });

  const testCourses = () => run('Get All Courses', async () => {
    const token = localStorage.getItem('test_token');
    const res = await fetch(`${API_URL}/api/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  });

  const testStudentCourses = () => run('Get Student Enrolled Courses', async () => {
    const token = localStorage.getItem('test_token');
    const res = await fetch(`${API_URL}/api/student/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  });

  const testProgress = () => run('Get Student Progress', async () => {
    const token = localStorage.getItem('test_token');
    const res = await fetch(`${API_URL}/api/student/progress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  });

  const testTeacherLogin = () => run('Login (demo teacher)', async () => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@demo.com', password: 'demo123', role: 'teacher' })
    });
    const data = await res.json();
    if (data.token) localStorage.setItem('test_token_teacher', data.token);
    return data;
  });

  const testCreateCourse = () => run('Create Course (teacher)', async () => {
    const token = localStorage.getItem('test_token_teacher');
    const res = await fetch(`${API_URL}/api/teacher/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: `Test Course ${Date.now()}`, description: 'Auto-created test course' })
    });
    return res.json();
  });

  const testTeacherCourses = () => run('Get Teacher Courses', async () => {
    const token = localStorage.getItem('test_token_teacher');
    const res = await fetch(`${API_URL}/api/teacher/courses`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  });

  const clearResults = () => setResults([]);

  const tests = [
    { label: 'Health Check', fn: testHealth, color: 'bg-gray-100 text-gray-700', desc: 'Check if backend is alive' },
    { label: 'Login as Student', fn: testLogin, color: 'bg-blue-100 text-blue-700', desc: 'Login with demo student' },
    { label: 'Login as Teacher', fn: testTeacherLogin, color: 'bg-emerald-100 text-emerald-700', desc: 'Login with demo teacher' },
    { label: 'Register New Student', fn: testRegister, color: 'bg-purple-100 text-purple-700', desc: 'Create a new student account' },
    { label: 'Browse All Courses', fn: testCourses, color: 'bg-indigo-100 text-indigo-700', desc: 'Get all available courses' },
    { label: 'My Enrolled Courses', fn: testStudentCourses, color: 'bg-orange-100 text-orange-700', desc: 'Student enrolled courses (login first)' },
    { label: 'Student Progress', fn: testProgress, color: 'bg-pink-100 text-pink-700', desc: 'Get progress stats (login first)' },
    { label: 'Create Course', fn: testCreateCourse, color: 'bg-teal-100 text-teal-700', desc: 'Teacher creates course (teacher login first)' },
    { label: 'Teacher Courses', fn: testTeacherCourses, color: 'bg-yellow-100 text-yellow-700', desc: 'Get teacher courses (teacher login first)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">🧪 API Test Panel</h1>
            <button onClick={clearResults} className="text-sm text-gray-400 hover:text-gray-600">Clear results</button>
          </div>
          <p className="text-sm text-gray-500 mb-1">Backend: <span className="font-mono text-indigo-600">{API_URL}</span></p>
          <p className="text-xs text-gray-400">Run tests in order: Login first, then test protected routes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-6">
          {tests.map(t => (
            <button key={t.label} onClick={t.fn} disabled={loading === t.label}
              className={`${t.color} rounded-xl p-4 text-left hover:opacity-80 transition-opacity disabled:opacity-50`}>
              <p className="font-semibold text-sm">{loading === t.label ? '⏳ Running...' : t.label}</p>
              <p className="text-xs opacity-70 mt-1">{t.desc}</p>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {results.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
              Click any test button above to see results
            </div>
          )}
          {results.map(r => (
            <div key={r.id} className={`bg-white rounded-2xl border ${r.status === 'success' ? 'border-green-200' : 'border-red-200'} overflow-hidden`}>
              <div className={`flex items-center justify-between px-4 py-3 ${r.status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2">
                  <span>{r.status === 'success' ? '✅' : '❌'}</span>
                  <span className="font-semibold text-sm text-gray-800">{r.label}</span>
                </div>
                <span className="text-xs text-gray-400">{r.time}</span>
              </div>
              <pre className="p-4 text-xs text-gray-700 overflow-x-auto bg-gray-50 max-h-48 overflow-y-auto">
                {r.data}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
