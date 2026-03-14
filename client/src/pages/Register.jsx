import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'', role:'student' });
  const [roleData, setRoleData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));
  const setR = (field, val) => setRoleData(p => ({ ...p, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true); setError('');
    try {
      const user = await register({ ...formData, ...roleData });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const roleFields = {
    student: [
      { label: 'Grade / Class', field: 'grade', placeholder: 'e.g. Grade 10' },
      { label: 'School Name', field: 'schoolName', placeholder: 'Your school name' },
      { label: 'Interests', field: 'interests', placeholder: 'Math, Science, Art...' },
    ],
    teacher: [
      { label: 'Subject Specialization', field: 'subjectSpecialization', placeholder: 'e.g. Mathematics' },
      { label: 'Years of Experience', field: 'yearsOfExperience', placeholder: '5', type: 'number' },
      { label: 'Qualification', field: 'qualification', placeholder: 'e.g. M.Sc Mathematics' },
    ],
    parent: [
      { label: "Child's Name", field: 'childName', placeholder: "Child's full name" },
      { label: "Child's Grade", field: 'childGrade', placeholder: 'e.g. Grade 8' },
      { label: 'Contact Number', field: 'contactNumber', placeholder: '+1 234 567 8900' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">LearnHub</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <div className="card shadow-xl border-0">
          {/* Step indicator */}
          <div className="flex items-center mb-6">
            {[1, 2].map(s => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-indigo-600' : 'bg-gray-100'}`} />}
              </React.Fragment>
            ))}
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <h3 className="font-semibold text-gray-800">Basic Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input className="input-field" placeholder="John Doe" value={formData.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" className="input-field" placeholder="you@example.com" value={formData.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" value={formData.password} onChange={e => set('password', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a...</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['student','teacher','parent'].map(r => (
                      <button key={r} type="button" onClick={() => set('role', r)}
                        className={`py-2.5 rounded-xl border-2 text-sm font-medium capitalize transition-all ${formData.role === r ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-3">Continue</button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-gray-800 capitalize">{formData.role} Details</h3>
                {roleFields[formData.role].map(({ label, field, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input type={type || 'text'} className="input-field" placeholder={placeholder}
                      onChange={e => setR(field, e.target.value)} />
                  </div>
                ))}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary py-3">Back</button>
                  <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 disabled:opacity-60">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
