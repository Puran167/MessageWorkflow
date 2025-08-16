import React, { useState } from 'react';
import axios from 'axios';

export default function ApproveRejectForward({ messageId, reload }) {
  const [action, setAction] = useState('Approve');
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const token = localStorage.getItem('token');

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (action === 'Reject' && !comment.trim()) {
      setMsg('Please provide a comment when rejecting a message.');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    
    try {
      await axios.post(`/api/messages/${messageId}/action`, { action, comment }, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMsg(`Message ${action.toLowerCase()}ed successfully!`);
      setComment('');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMsg(''), 3000);
      
      // Reload the parent component
      if (reload) reload();
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to process action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getActionConfig = (actionType) => {
    switch(actionType) {
      case 'Approve':
        return {
          color: 'green',
          bgClass: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          textClass: 'text-green-800 dark:text-green-200',
          buttonClass: 'bg-green-600 hover:bg-green-700',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'Reject':
        return {
          color: 'red',
          bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          textClass: 'text-red-800 dark:text-red-200',
          buttonClass: 'bg-red-600 hover:bg-red-700',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'Forward':
        return {
          color: 'yellow',
          bgClass: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          textClass: 'text-yellow-800 dark:text-yellow-200',
          buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
          icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )
        };
      default:
        return {
          color: 'blue',
          bgClass: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          textClass: 'text-blue-800 dark:text-blue-200',
          buttonClass: 'bg-blue-600 hover:bg-blue-700',
          icon: null
        };
    }
  };

  const config = getActionConfig(action);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Take Action on Message
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`}>
            Action Required
          </div>
        </div>

        {/* Status Message */}
        {msg && (
          <div className={`mb-4 rounded-lg p-4 border ${
            msg.includes('success') 
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {msg.includes('success') ? (
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  msg.includes('success') 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {msg}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Action
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Approve', 'Reject', 'Forward'].map((actionOption) => {
                const optionConfig = getActionConfig(actionOption);
                return (
                  <div key={actionOption}>
                    <input
                      type="radio"
                      id={actionOption}
                      name="action"
                      value={actionOption}
                      checked={action === actionOption}
                      onChange={(e) => setAction(e.target.value)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={actionOption}
                      className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        action === actionOption
                          ? `${optionConfig.bgClass} border-${optionConfig.color}-300 dark:border-${optionConfig.color}-600`
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className={`flex items-center ${
                        action === actionOption 
                          ? optionConfig.textClass 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {optionConfig.icon}
                        <span className="ml-2 font-medium">{actionOption}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comment Section */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment {action === 'Reject' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out resize-none"
              placeholder={
                action === 'Reject' 
                  ? 'Please provide a reason for rejection...' 
                  : 'Add a comment (optional)...'
              }
              required={action === 'Reject'}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {action === 'Reject' 
                  ? 'A comment is required when rejecting a message' 
                  : 'Your comment will be added to the message history'}
              </p>
              <span className="text-xs text-gray-400">
                {comment.length}/500
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone
            </div>
            <button
              type="submit"
              disabled={loading || (action === 'Reject' && !comment.trim())}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white ${config.buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 ease-in-out hover:scale-105 disabled:hover:scale-100 shadow-lg`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  {config.icon}
                  <span className="ml-2">{action} Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className={`px-6 py-4 ${config.bgClass} border-b border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${config.textClass}`}>
                  {config.icon}
                </div>
                <div className="ml-3">
                  <h3 className={`text-lg font-medium ${config.textClass}`}>
                    Confirm {action}
                  </h3>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Are you sure you want to {action.toLowerCase()} this message? 
                {action === 'Reject' && ' This will stop the workflow process.'}
                {action === 'Forward' && ' This will move the message to the next stage.'}
                {action === 'Approve' && ' This will advance the message in the workflow.'}
              </p>
              
              {comment && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Your comment:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{comment}"</p>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white ${config.buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${config.color}-500 transition-colors`}
              >
                {config.icon}
                <span className="ml-2">Confirm {action}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
