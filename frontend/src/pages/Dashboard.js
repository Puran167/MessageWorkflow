
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Notification from '../components/Notification';
import MessageTimeline from '../components/MessageTimeline';
import DarkModeToggle from '../components/DarkModeToggle';
import { exportMessageToPDF } from '../utils/pdfExport';
import ApproveRejectForward from './ApproveRejectForward';
import CreateMessage from './CreateMessage';
import Profile from './Profile';
import { SocketContext } from '../context/SocketContext';

// Main Messages List Component
function MessagesList({ messages, user, handleExportPDF, handleReload }) {
  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new message.</p>
        </div>
      ) : (
        messages.map(m => (
          <div key={m._id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">{m.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {m.sender ? `From: ${m.sender.name} (${m.sender.department})` : 'Unknown sender'}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  m.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                  m.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' : 
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {m.status}
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">{m.content}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>Stage: <span className="font-medium">{m.currentRole}</span></span>
                <span>Department: <span className="font-medium">{m.department}</span></span>
                <span>Created: <span className="font-medium">{new Date(m.createdAt).toLocaleDateString()}</span></span>
              </div>
              
              <MessageTimeline historyLog={m.historyLog} />
              
              <div className="mt-4 flex flex-wrap gap-3">
                <button 
                  onClick={() => handleExportPDF(m)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
                
                {user && user.role !== 'Student' && m.status === 'Pending' && m.currentRole === user.role && (
                  <div className="flex-1">
                    <ApproveRejectForward messageId={m._id} reload={handleReload} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    axios.get('/api/messages', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setMessages(res.data);
        setMsg('');
      })
      .catch(err => {
        console.error('Error loading messages:', err);
        setMsg('Error loading messages');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate, reloadFlag]);

  useEffect(() => {
    if (!socket) return;
    
    const handleMessageUpdate = (data) => {
      console.log('Message update received:', data);
      setReloadFlag(f => !f);
    };
    
    socket.on('messageUpdate', handleMessageUpdate);
    return () => socket.off('messageUpdate', handleMessageUpdate);
  }, [socket]);

  const handleExportPDF = (message) => {
    exportMessageToPDF(message);
  };

  const handleReload = () => setReloadFlag(f => !f);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Student': return '👨‍🎓';
      case 'Teacher': return '👩‍🏫';
      default: return '👨‍💼';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Message System</h1>
                <p className="text-blue-100 text-xs">Workflow Management</p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden text-white/70 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* User Info Card */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    user?.role === 'Student' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                    user?.role === 'Teacher' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                  }`}>
                    {user?.role}
                  </span>
                  {user?.department && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.department}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <Sidebar role={user?.role} user={user} />
          </div>
          
          {/* Notifications Section */}
          <div className="px-4 pb-4">
            <Notification token={token} />
          </div>
          
          {/* System Status & Controls */}
          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600 space-y-4">
            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                System Status
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-gray-600 dark:text-gray-300">Connection</span>
                  </div>
                  <span className="text-green-500 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-300">Session</span>
                  </div>
                  <span className="text-blue-500 font-medium">Active</span>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="space-y-2">
              <DarkModeToggle />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-all duration-200 border border-red-200 dark:border-red-700 hover:border-red-500"
              >
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Page Title */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getRoleIcon(user.role)}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {user?.role} Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role === 'Student' ? 'Manage your messages' : 'Review and approve messages'}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="hidden sm:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Total: {messages.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Pending: {messages.filter(m => m.status === 'Pending').length}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Content Routes */}
            <Routes>
              <Route path="/create" element={
                user?.role === 'Student' ? <CreateMessage /> : 
                <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Only students can create messages.
                      </p>
                    </div>
                  </div>
                </div>
              } />
              
              <Route path="/" element={
                <>
                  {/* Quick Actions for Students */}
                  {user?.role === 'Student' && (
                    <div className="mb-8">
                      <button 
                        onClick={() => navigate('/dashboard/create')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition duration-200 ease-in-out hover:scale-105"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Send New Message
                      </button>
                    </div>
                  )}
                  
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-blue-100 truncate">Total Messages</dt>
                              <dd className="text-lg font-medium text-white">{messages.length}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-yellow-100 truncate">Pending</dt>
                              <dd className="text-lg font-medium text-white">{messages.filter(m => m.status === 'Pending').length}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-green-100 truncate">Approved</dt>
                              <dd className="text-lg font-medium text-white">{messages.filter(m => m.status === 'Approved').length}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-500 to-red-600 overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-red-100 truncate">Rejected</dt>
                              <dd className="text-lg font-medium text-white">{messages.filter(m => m.status === 'Rejected').length}</dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Section */}
                  <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                          {user.role === 'Student' ? 'My Messages' : 'Messages for Review'}
                        </h2>
                        <button 
                          onClick={handleReload}
                          disabled={loading}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Refresh
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Loading */}
                      {loading && (
                        <div className="flex justify-center py-8">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600 dark:text-gray-400">Loading messages...</span>
                          </div>
                        </div>
                      )}

                      {/* Error Message */}
                      {msg && (
                        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-6">
                          <div className="flex">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-800 dark:text-yellow-200">{msg}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Messages List */}
                      {!loading && (
                        <MessagesList 
                          messages={messages}
                          user={user}
                          handleExportPDF={handleExportPDF}
                          handleReload={handleReload}
                        />
                      )}
                    </div>
                  </div>
                </>
              } />
              
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
