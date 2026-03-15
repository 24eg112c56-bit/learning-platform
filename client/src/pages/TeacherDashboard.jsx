import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

import API from '../config/api';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [quizQuestions, setQuizQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [c, a, q] = await Promise.all([
        axios.get(`${API}/api/teacher/courses`),
        axios.get(`${API}/api/teacher/assignments`),
        axios.get(`${API}/api/teacher/quizzes`),
      ]);
      setCourses(c.data); setAssignments(a.data); setQuizzes(q.data);
    } catch (e) { console.error(e); }
  };

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const createCourse = async (e) => {
    e.preventDefault();
    try { await axios.post(`${API}/api/teacher/courses`, form); setModal(null); setForm({}); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const addVideo = async (e) => {
    e.preventDefault();
    try { await axios.post(`${API}/api/teacher/courses/${selectedCourse._id}/videos`, form); setModal(null); setForm({}); fetchAll(); }
    catch (e) { alert('Error adding video'); }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    try { await axios.post(`${API}/api/teacher/assignments`, form); setModal(null); setForm({}); fetchAll(); }
    catch (e) { alert('Error creating assignment'); }
  };

  const gradeSubmission = async (assignmentId, submissionId, grade) => {
    try { await axios.post(`${API}/api/teacher/assignments/${assignmentId}/grade/${submissionId}`, { grade: parseInt(grade) }); fetchAll(); }
    catch (e) { alert('Error grading'); }
  };

  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/teacher/quizzes`, { ...form, questions: quizQuestions });
      setModal(null); setForm({}); setQuizQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]); fetchAll();
    } catch (e) { alert('Error creating quiz'); }
  };

  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0);
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.submissions?.length || 0), 0);

  return (
    <Layout activeTab={tab} setActiveTab={setTab}>
      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Manage your courses and students</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Courses', value: courses.length, color: 'text-emerald-600' },
              { label: 'Total Students', value: totalStudents, color: 'text-blue-600' },
              { label: 'Assignments', value: assignments.length, color: 'text-purple-600' },
              { label: 'Submissions', value: totalSubmissions, color: 'text-orange-600' },
            ].map(s => (
              <div key={s.label} className="card">
                <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Recent Courses</h3>
                <button onClick={() => setTab('courses')} className="text-sm text-indigo-600 hover:underline">View all</button>
              </div>
              {courses.slice(0, 3).map(c => (
                <div key={c._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">{c.title?.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.enrolledStudents?.length || 0} students</p>
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-400">No courses yet</p>}
            </div>
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Pending Submissions</h3>
              </div>
              {assignments.filter(a => a.submissions?.length > 0).slice(0, 3).map(a => (
                <div key={a._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.submissions?.length} submission(s)</p>
                  </div>
                  <button onClick={() => setTab('assignments')} className="text-xs text-indigo-600 hover:underline">Review</button>
                </div>
              ))}
              {assignments.filter(a => a.submissions?.length > 0).length === 0 && <p className="text-sm text-gray-400">No submissions yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* COURSES */}
      {tab === 'courses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            <button onClick={() => { setModal('course'); setForm({}); }} className="btn-primary">+ Create Course</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(c => (
              <div key={c._id} className="card hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg mb-4">{c.title?.charAt(0)}</div>
                <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{c.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>👥 {c.enrolledStudents?.length || 0} students</span>
                  <span>🎬 {c.videos?.length || 0} videos</span>
                </div>
                <button onClick={() => { setSelectedCourse(c); setModal('video'); setForm({}); }}
                  className="w-full btn-secondary text-sm py-2">+ Add Video</button>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="col-span-3 card text-center py-16">
                <p className="text-gray-400 mb-4">No courses yet. Create your first course!</p>
                <button onClick={() => { setModal('course'); setForm({}); }} className="btn-primary">Create Course</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSIGNMENTS */}
      {tab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
            <button onClick={() => { setModal('assignment'); setForm({}); }} className="btn-primary">+ Create Assignment</button>
          </div>
          {assignments.length === 0 ? (
            <div className="card text-center py-16"><p className="text-gray-400">No assignments yet</p></div>
          ) : (
            <div className="space-y-4">
              {assignments.map(a => (
                <div key={a._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900">{a.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                      <p className="text-xs text-indigo-600 mt-2">📚 {a.courseId?.title}</p>
                    </div>
                    <span className="badge bg-blue-100 text-blue-600">{a.submissions?.length || 0} submissions</span>
                  </div>
                  {a.submissions?.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      <p className="text-sm font-semibold text-gray-700">Submissions:</p>
                      {a.submissions.map(s => (
                        <div key={s._id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-800">{s.studentId?.name || 'Student'}</p>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{s.content}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(s.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {s.grade !== undefined ? (
                                <span className="badge bg-green-100 text-green-600">{s.grade}%</span>
                              ) : (
                                <input type="number" min="0" max="100" placeholder="Grade"
                                  className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  onBlur={e => e.target.value && gradeSubmission(a._id, s._id, e.target.value)} />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STUDENTS */}
      {tab === 'students' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          {courses.map(c => (
            <div key={c._id} className="card">
              <h3 className="font-bold text-gray-900 mb-4">{c.title} <span className="text-sm font-normal text-gray-400">({c.enrolledStudents?.length || 0} students)</span></h3>
              {c.enrolledStudents?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {c.enrolledStudents.map(s => (
                    <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">{s.name?.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email} · Grade {s.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No students enrolled yet</p>}
            </div>
          ))}
        </div>
      )}

      {/* QUIZZES */}
      {tab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Quizzes</h2>
            <button onClick={() => { setModal('quiz'); setForm({}); setQuizQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]); }} className="btn-primary">+ Create Quiz</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(q => (
              <div key={q._id} className="card">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-4">Q</div>
                <h3 className="font-bold text-gray-900 mb-1">{q.title}</h3>
                <p className="text-sm text-gray-500 mb-1">📚 {q.courseId?.title}</p>
                <p className="text-xs text-gray-400">{q.questions?.length} questions · {q.attempts?.length || 0} attempts</p>
              </div>
            ))}
            {quizzes.length === 0 && <p className="text-gray-400">No quizzes yet</p>}
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal === 'course' && (
        <Modal title="Create New Course" onClose={() => setModal(null)}>
          <form onSubmit={createCourse} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Course Title</label>
              <input className="input-field" placeholder="e.g. Advanced Mathematics" onChange={e => set('title', e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea className="input-field" rows={3} placeholder="Course description..." onChange={e => set('description', e.target.value)} /></div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn-primary">Create Course</button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'video' && selectedCourse && (
        <Modal title={`Add Video to "${selectedCourse.title}"`} onClose={() => setModal(null)}>
          <form onSubmit={addVideo} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Video Title</label>
              <input className="input-field" placeholder="e.g. Introduction to Limits" onChange={e => set('title', e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Video URL</label>
              <input type="url" className="input-field" placeholder="https://youtube.com/..." onChange={e => set('url', e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
              <input className="input-field" placeholder="e.g. 15:30" onChange={e => set('duration', e.target.value)} /></div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn-primary">Add Video</button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'assignment' && (
        <Modal title="Create Assignment" onClose={() => setModal(null)}>
          <form onSubmit={createAssignment} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
              <select className="input-field" onChange={e => set('courseId', e.target.value)} required>
                <option value="">Select course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input className="input-field" placeholder="Assignment title" onChange={e => set('title', e.target.value)} required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea className="input-field" rows={3} placeholder="Assignment instructions..." onChange={e => set('description', e.target.value)} /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
              <input type="date" className="input-field" onChange={e => set('dueDate', e.target.value)} required /></div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn-primary">Create</button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'quiz' && (
        <Modal title="Create Quiz" onClose={() => setModal(null)}>
          <form onSubmit={createQuiz} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Course</label>
              <select className="input-field" onChange={e => set('courseId', e.target.value)} required>
                <option value="">Select course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
              </select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Quiz Title</label>
              <input className="input-field" placeholder="Quiz title" onChange={e => set('title', e.target.value)} required /></div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Questions</p>
              {quizQuestions.map((q, qi) => (
                <div key={qi} className="bg-gray-50 rounded-xl p-4 mb-3">
                  <input className="input-field mb-3" placeholder={`Question ${qi + 1}`} value={q.question}
                    onChange={e => { const qs = [...quizQuestions]; qs[qi].question = e.target.value; setQuizQuestions(qs); }} />
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2 mb-2">
                      <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi}
                        onChange={() => { const qs = [...quizQuestions]; qs[qi].correctAnswer = oi; setQuizQuestions(qs); }} />
                      <input className="input-field py-2" placeholder={`Option ${oi + 1}`} value={opt}
                        onChange={e => { const qs = [...quizQuestions]; qs[qi].options[oi] = e.target.value; setQuizQuestions(qs); }} />
                    </div>
                  ))}
                </div>
              ))}
              <button type="button" onClick={() => setQuizQuestions([...quizQuestions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }])}
                className="text-sm text-indigo-600 hover:underline">+ Add Question</button>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn-primary">Create Quiz</button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 btn-secondary">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </Layout>
  );
};

export default TeacherDashboard;
