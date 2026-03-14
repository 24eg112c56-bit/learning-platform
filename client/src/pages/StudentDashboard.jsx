import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const StatCard = ({ label, value, sub, color }) => (
  <div className="card">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [submitText, setSubmitText] = useState('');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [c, a, q, p, all] = await Promise.all([
        axios.get(`${API}/api/student/courses`),
        axios.get(`${API}/api/student/assignments`),
        axios.get(`${API}/api/student/quizzes`),
        axios.get(`${API}/api/student/progress`),
        axios.get(`${API}/api/courses`),
      ]);
      setCourses(c.data); setAssignments(a.data);
      setQuizzes(q.data); setProgress(p.data); setAllCourses(all.data);
    } catch (e) { console.error(e); }
  };

  const enroll = async (id) => {
    try { await axios.post(`${API}/api/student/courses/${id}/enroll`); fetchAll(); }
    catch (e) { alert(e.response?.data?.message || 'Error enrolling'); }
  };

  const submitAssignment = async (id) => {
    if (!submitText.trim()) return;
    try {
      await axios.post(`${API}/api/student/assignments/${id}/submit`, { content: submitText });
      setSubmitting(null); setSubmitText(''); fetchAll();
    } catch (e) { alert('Error submitting'); }
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post(`${API}/api/student/quizzes/${activeQuiz._id}/submit`, { answers: quizAnswers });
      setQuizResult(res.data.score);
    } catch (e) { alert('Error submitting quiz'); }
  };

  const enrolledIds = courses.map(c => c._id);

  return (
    <Layout activeTab={tab} setActiveTab={setTab}>
      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Here's your learning summary</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Enrolled Courses" value={progress?.enrolledCourses || 0} color="text-indigo-600" />
            <StatCard label="Assignments" value={`${progress?.submittedAssignments || 0}/${progress?.totalAssignments || 0}`} sub="submitted" color="text-blue-600" />
            <StatCard label="Quizzes Done" value={`${progress?.completedQuizzes || 0}/${progress?.totalQuizzes || 0}`} color="text-purple-600" />
            <StatCard label="Avg Quiz Score" value={`${progress?.avgQuizScore || 0}%`} color="text-green-600" />
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Overall Progress</h3>
              <span className="text-indigo-600 font-bold">{progress?.progressPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${progress?.progressPercentage || 0}%` }} />
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Assignments</h3>
              {assignments.slice(0, 3).map(a => (
                <div key={a._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-sm text-gray-800">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.courseId?.title}</p>
                  </div>
                  <span className={`badge ${a.submissions?.some(s => s.studentId === user?.id) ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {a.submissions?.some(s => s.studentId === user?.id) ? 'Submitted' : 'Pending'}
                  </span>
                </div>
              ))}
              {assignments.length === 0 && <p className="text-sm text-gray-400">No assignments yet</p>}
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">My Courses</h3>
              {courses.slice(0, 3).map(c => (
                <div key={c._id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {c.title?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{c.title}</p>
                    <p className="text-xs text-gray-400">{c.teacherId?.name}</p>
                  </div>
                </div>
              ))}
              {courses.length === 0 && <p className="text-sm text-gray-400">No courses enrolled yet</p>}
            </div>
          </div>
        </div>
      )}

      {/* MY COURSES */}
      {tab === 'courses' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          {courses.length === 0 ? (
            <div className="card text-center py-16">
              <p className="text-gray-400 mb-4">You haven't enrolled in any courses yet</p>
              <button onClick={() => setTab('browse')} className="btn-primary">Browse Courses</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(c => (
                <div key={c._id} className="card hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {c.title?.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{c.description}</p>
                  <p className="text-xs text-indigo-600 font-medium">👨‍🏫 {c.teacherId?.name}</p>
                  {c.videos?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Videos ({c.videos.length})</p>
                      {c.videos.map((v, i) => (
                        <a key={i} href={v.url} target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-indigo-600 hover:underline py-1">
                          ▶ {v.title} {v.duration && <span className="text-gray-400">({v.duration})</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BROWSE */}
      {tab === 'browse' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.map(c => {
              const enrolled = enrolledIds.includes(c._id);
              return (
                <div key={c._id} className="card hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {c.title?.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{c.description}</p>
                  <p className="text-xs text-gray-400 mb-4">👨‍🏫 {c.teacherId?.name} · {c.enrolledStudents?.length || 0} students</p>
                  <button onClick={() => !enrolled && enroll(c._id)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${enrolled ? 'bg-green-50 text-green-600 cursor-default' : 'btn-primary'}`}>
                    {enrolled ? '✓ Enrolled' : 'Enroll Now'}
                  </button>
                </div>
              );
            })}
            {allCourses.length === 0 && <p className="text-gray-400 col-span-3">No courses available yet</p>}
          </div>
        </div>
      )}

      {/* ASSIGNMENTS */}
      {tab === 'assignments' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
          {assignments.length === 0 ? (
            <div className="card text-center py-16"><p className="text-gray-400">No assignments yet</p></div>
          ) : (
            <div className="space-y-4">
              {assignments.map(a => {
                const submitted = a.submissions?.some(s => s.studentId === user?.id);
                const mySubmission = a.submissions?.find(s => s.studentId === user?.id);
                return (
                  <div key={a._id} className="card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{a.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{a.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs text-indigo-600 font-medium">📚 {a.courseId?.title}</span>
                          {a.dueDate && <span className="text-xs text-gray-400">Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                          {mySubmission?.grade !== undefined && (
                            <span className="badge bg-green-100 text-green-600">Grade: {mySubmission.grade}%</span>
                          )}
                        </div>
                      </div>
                      <span className={`badge shrink-0 ${submitted ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        {submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                    {!submitted && (
                      submitting === a._id ? (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <textarea className="input-field mb-3" rows={4} placeholder="Write your answer here..."
                            value={submitText} onChange={e => setSubmitText(e.target.value)} />
                          <div className="flex gap-3">
                            <button onClick={() => submitAssignment(a._id)} className="btn-primary">Submit</button>
                            <button onClick={() => setSubmitting(null)} className="btn-secondary">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setSubmitting(a._id)} className="mt-4 btn-primary text-sm py-2">
                          Submit Assignment
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* QUIZZES */}
      {tab === 'quizzes' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Quizzes</h2>
          {activeQuiz ? (
            <div className="card max-w-2xl">
              <h3 className="text-xl font-bold mb-6">{activeQuiz.title}</h3>
              {quizResult !== null ? (
                <div className="text-center py-8">
                  <div className={`text-6xl font-bold mb-4 ${quizResult >= 70 ? 'text-green-600' : 'text-orange-600'}`}>{quizResult}%</div>
                  <p className="text-gray-600 mb-6">{quizResult >= 70 ? 'Great job! 🎉' : 'Keep practicing! 💪'}</p>
                  <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswers({}); fetchAll(); }} className="btn-primary">
                    Back to Quizzes
                  </button>
                </div>
              ) : (
                <>
                  {activeQuiz.questions?.map((q, qi) => (
                    <div key={qi} className="mb-6">
                      <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options?.map((opt, oi) => (
                          <label key={oi} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${quizAnswers[qi] === oi ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                            <input type="radio" name={`q${qi}`} className="hidden" onChange={() => setQuizAnswers(p => ({ ...p, [qi]: oi }))} />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${quizAnswers[qi] === oi ? 'border-indigo-500' : 'border-gray-300'}`}>
                              {quizAnswers[qi] === oi && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                            </div>
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-3">
                    <button onClick={submitQuiz} className="btn-primary">Submit Quiz</button>
                    <button onClick={() => { setActiveQuiz(null); setQuizAnswers({}); }} className="btn-secondary">Cancel</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map(q => {
                const attempted = q.attempts?.some(a => a.studentId === user?.id);
                const myAttempt = q.attempts?.find(a => a.studentId === user?.id);
                return (
                  <div key={q._id} className="card">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg mb-4">Q</div>
                    <h3 className="font-bold text-gray-900 mb-1">{q.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">📚 {q.courseId?.title}</p>
                    <p className="text-xs text-gray-400 mb-4">{q.questions?.length} questions</p>
                    {attempted ? (
                      <div className="flex items-center justify-between">
                        <span className="badge bg-green-100 text-green-600">Score: {myAttempt?.score}%</span>
                        <button onClick={() => { setActiveQuiz(q); setQuizAnswers({}); setQuizResult(null); }} className="text-sm text-indigo-600 hover:underline">Retry</button>
                      </div>
                    ) : (
                      <button onClick={() => { setActiveQuiz(q); setQuizAnswers({}); setQuizResult(null); }} className="w-full btn-primary text-sm py-2">
                        Start Quiz
                      </button>
                    )}
                  </div>
                );
              })}
              {quizzes.length === 0 && <p className="text-gray-400">No quizzes available yet</p>}
            </div>
          )}
        </div>
      )}

      {/* PROGRESS */}
      {tab === 'progress' && progress && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Courses" value={progress.enrolledCourses} color="text-indigo-600" />
            <StatCard label="Assignments Done" value={`${progress.submittedAssignments}/${progress.totalAssignments}`} color="text-blue-600" />
            <StatCard label="Quizzes Done" value={`${progress.completedQuizzes}/${progress.totalQuizzes}`} color="text-purple-600" />
            <StatCard label="Avg Score" value={`${progress.avgQuizScore}%`} color="text-green-600" />
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Assignment Completion</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full"
                  style={{ width: `${progress.progressPercentage}%` }} />
              </div>
              <span className="font-bold text-indigo-600 w-12 text-right">{progress.progressPercentage}%</span>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Quiz Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-100 rounded-full h-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                  style={{ width: `${progress.avgQuizScore}%` }} />
              </div>
              <span className="font-bold text-purple-600 w-12 text-right">{progress.avgQuizScore}%</span>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default StudentDashboard;
