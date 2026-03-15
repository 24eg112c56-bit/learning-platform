import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

let socket;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    socket = io(API_URL);
    socket.emit('join-room', user.id);

    const add = (title, message, type = 'info') => {
      const n = { id: Date.now(), title, message, type, time: new Date(), read: false };
      setNotifications(prev => [n, ...prev].slice(0, 20));
    };

    socket.on('new-assignment', d => add('New Assignment', d.title, 'assignment'));
    socket.on('new-quiz', d => add('New Quiz', d.title, 'quiz'));
    socket.on('assignment-graded', d => add('Assignment Graded', `${d.assignmentTitle}: ${d.grade}%`, 'grade'));
    socket.on('student-enrolled', d => add('New Enrollment', `Student enrolled in ${d.courseName}`, 'enroll'));
    socket.on('assignment-submitted', d => add('Assignment Submitted', d.assignmentTitle, 'submit'));
    socket.on('new-video', d => add('New Video', `${d.videoTitle} in ${d.courseName}`, 'video'));

    return () => socket?.disconnect();
  }, [user]);

  const unread = notifications.filter(n => !n.read).length;
  const markRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));

  const typeColors = {
    assignment: 'bg-blue-100 text-blue-600',
    quiz: 'bg-purple-100 text-purple-600',
    grade: 'bg-green-100 text-green-600',
    enroll: 'bg-indigo-100 text-indigo-600',
    submit: 'bg-orange-100 text-orange-600',
    video: 'bg-pink-100 text-pink-600',
    info: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="relative">
      <button onClick={() => { setOpen(!open); if (!open) markRead(); }}
        className="relative w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <button onClick={() => setNotifications([])} className="text-xs text-gray-400 hover:text-gray-600">Clear all</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className={`badge ${typeColors[n.type]} mt-0.5`}>{n.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
