import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

import API from '../config/api';

const ParentDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [childData, setChildData] = useState(null);
  const [linkEmail, setLinkEmail] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchProgress(); }, []);

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`${API}/api/parent/child-progress`);
      setChildData(res.data);
    } catch (e) { console.error(e); }
  };

  const linkStudent = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/parent/link-student`, { studentEmail: linkEmail });
      setShowLink(false); setLinkEmail(''); fetchProgress();
    } catch (err) {
      setError(err.response?.data?.message || 'Student not found');
    } finally { setLoading(false); }
  };

  const linked = childData?.linked;

  return (
    <Layout activeTab={tab} setActiveTab={setTab}>
      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Monitor your child's learning journey</p>
          </div>

          {!linked ? (
            <div className="card text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No Student Linked</h3>
              <p className="text-gray-500 text-sm mb-6">Link your child's account to start tracking their progress</p>
              <button onClick={() => setShowLink(true)} className="btn-primary">Link Student Account</button>
            </div>
          ) : (
            <>
              <div className="card bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    {childData.childName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{childData.childName}</h2>
                    <p className="text-white/80 text-sm">{childData.childGrade} · {childData.childEmail}</p>
                  </div>
                  <button onClick={() => setShowLink(true)} className="ml-auto text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg">Change</button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Enrolled Courses', value: childData.enrolledCourses, color: 'text-indigo-600' },
                  { label: 'Attendance', value: `${childData.attendance}%`, color: childData.attendance >= 75 ? 'text-green-600' : 'text-red-500' },
                  { label: 'Avg Grade', value: `${childData.avgGrade}%`, color: 'text-blue-600' },
                  { label: 'Quiz Score', value: `${childData.avgQuizScore}%`, color: 'text-purple-600' },
                ].map(s => (
                  <div key={s.label} className="card">
                    <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">Assignment Progress</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Submitted</span>
                    <span className="font-semibold">{childData.submittedAssignments}/{childData.totalAssignments}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full"
                      style={{ width: `${childData.totalAssignments > 0 ? (childData.submittedAssignments / childData.totalAssignments) * 100 : 0}%` }} />
                  </div>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  {childData.recentActivity?.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                      <p className="text-sm text-gray-600">{a.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {tab === 'progress' && linked && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Detailed Progress</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Courses', value: childData.enrolledCourses, color: 'text-indigo-600' },
              { label: 'Attendance', value: `${childData.attendance}%`, color: 'text-green-600' },
              { label: 'Avg Grade', value: `${childData.avgGrade}%`, color: 'text-blue-600' },
              { label: 'Quiz Avg', value: `${childData.avgQuizScore}%`, color: 'text-purple-600' },
            ].map(s => (
              <div key={s.label} className="card">
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Performance Overview</h3>
            {[
              { label: 'Assignment Completion', value: childData.totalAssignments > 0 ? Math.round((childData.submittedAssignments / childData.totalAssignments) * 100) : 0, color: 'from-blue-500 to-indigo-500' },
              { label: 'Quiz Performance', value: childData.avgQuizScore, color: 'from-purple-500 to-pink-500' },
              { label: 'Overall Grade', value: childData.avgGrade, color: 'from-orange-500 to-red-500' },
            ].map(m => (
              <div key={m.label} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-semibold text-gray-800">{m.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`bg-gradient-to-r ${m.color} h-2.5 rounded-full`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab === 'courses' && linked && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Child's Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {childData.courses?.map(c => (
              <div key={c._id} className="card">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-4">{c.title?.charAt(0)}</div>
                <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{c.description}</p>
                <p className="text-xs text-indigo-600">👨‍🏫 {c.teacherId?.name}</p>
              </div>
            ))}
            {(!childData.courses || childData.courses.length === 0) && (
              <p className="text-gray-400">No courses enrolled yet</p>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {tab === 'notifications' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <div className="card">
            {linked ? (
              <div className="space-y-3">
                {childData.recentActivity?.map((a, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-800 capitalize">{a.type}</p>
                      <p className="text-sm text-gray-500">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Link a student account to see notifications</p>
            )}
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Link Student Account</h3>
            <p className="text-sm text-gray-500 mb-4">Enter your child's registered email address</p>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
            <form onSubmit={linkStudent} className="space-y-4">
              <input type="email" className="input-field" placeholder="student@example.com"
                value={linkEmail} onChange={e => setLinkEmail(e.target.value)} required />
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-60">
                  {loading ? 'Linking...' : 'Link Account'}
                </button>
                <button type="button" onClick={() => { setShowLink(false); setError(''); }} className="flex-1 btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ParentDashboard;
