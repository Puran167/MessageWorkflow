import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const roleLinks = {
  Student: [
    { 
      to: '/dashboard', 
      label: 'My Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      description: 'View your sent messages',
      category: 'Messages',
      count: 'messages'
    },
    { 
      to: '/dashboard/create', 
      label: 'Send Message', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      description: 'Create new message',
      category: 'Actions',
      isPrimary: true
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  Teacher: [
    { 
      to: '/dashboard', 
      label: 'Department Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      ),
      description: 'Review messages for approval',
      category: 'Messages',
      count: 'pending'
    },
    {
      to: '/dashboard/approved',
      label: 'Approved Messages',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Approved message history',
      category: 'History'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  HOD: [
    { 
      to: '/dashboard', 
      label: 'Department Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Manage department workflows',
      category: 'Messages',
      count: 'pending'
    },
    {
      to: '/dashboard/analytics',
      label: 'Department Analytics',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: 'View department statistics',
      category: 'Analytics'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  Principal: [
    { 
      to: '/dashboard', 
      label: 'Institutional Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Review institutional matters',
      category: 'Messages',
      count: 'pending'
    },
    {
      to: '/dashboard/reports',
      label: 'Institutional Reports',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Generate institutional reports',
      category: 'Reports'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  Director: [
    { 
      to: '/dashboard', 
      label: 'All Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Review all organizational messages',
      category: 'Messages',
      count: 'total'
    },
    {
      to: '/dashboard/oversight',
      label: 'Oversight Dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      description: 'Organization oversight',
      category: 'Management'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  CEO: [
    { 
      to: '/dashboard', 
      label: 'Executive Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Executive decision making',
      category: 'Messages',
      count: 'executive'
    },
    {
      to: '/dashboard/strategic',
      label: 'Strategic Overview',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'Strategic insights',
      category: 'Strategy'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ],
  Chairman: [
    { 
      to: '/dashboard', 
      label: 'Board Messages', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      description: 'Board level approvals',
      category: 'Messages',
      count: 'board'
    },
    {
      to: '/dashboard/governance',
      label: 'Governance',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      description: 'Corporate governance',
      category: 'Governance'
    },
    { 
      to: 'profile', 
      label: 'Profile', 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: 'Manage your profile settings',
      category: 'Account'
    }
  ]
};

export default function Sidebar({ role, user }) {
  const [messageCounts, setMessageCounts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const links = roleLinks[role] || [];
  const location = useLocation();
  const navigate = useNavigate();

  // Default user data if not provided
  const userData = user || {
    name: 'Unknown User',
    email: 'unknown@example.com',
    department: null,
    rollNumber: null,
    yearSemester: null,
    phoneNumber: null
  };

  // Mock data - in real app, this would come from API
  useEffect(() => {
    setMessageCounts({
      messages: 12,
      pending: 5,
      total: 45,
      executive: 8,
      board: 3
    });
  }, []);

  const isActiveLink = (linkPath) => {
    if (linkPath === '/dashboard' && location.pathname === '/dashboard') return true;
    if (linkPath !== '/dashboard' && location.pathname.includes(linkPath)) return true;
    return false;
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Student': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Teacher': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'HOD': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'Principal': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300';
      case 'Director': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'CEO': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Chairman': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Group links by category
  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {});

  return (
    <nav className="space-y-6">
      {/* Quick Profile Access */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm truncate">
                {userData.name}
              </h3>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleBadgeColor(role)}`}>
                  {role}
                </span>
              </div>
            </div>
            {/* Profile Link */}
            <button
              onClick={() => navigate('profile')}
              className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="View Profile"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Role Badge with User Info */}
      <div>
        {/* Quick Access Actions */}
        {role === 'Student' && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-sm">
            <h4 className="text-white font-semibold text-sm mb-3">Quick Action</h4>
            <Link
              to="/dashboard/create"
              className="inline-flex items-center w-full justify-center text-sm text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Send New Message
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links by Category */}
      <div className="space-y-6">
        {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
          <div key={category}>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-3">
              {category}
            </h3>
            <ul className="space-y-1">
              {categoryLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActiveLink(link.to)
                        ? link.isPrimary 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <div className={`flex-shrink-0 mr-3 ${
                        isActiveLink(link.to) 
                          ? link.isPrimary 
                            ? 'text-white' 
                            : 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                      }`}>
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{link.label}</div>
                        <div className={`text-xs mt-0.5 truncate ${
                          isActiveLink(link.to) 
                            ? link.isPrimary
                              ? 'text-blue-100'
                              : 'text-blue-600/80 dark:text-blue-400/80' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                        }`}>
                          {link.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Count Badge */}
                    {link.count && messageCounts[link.count] && (
                      <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                        isActiveLink(link.to)
                          ? link.isPrimary
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {messageCounts[link.count]}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
