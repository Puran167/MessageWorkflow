import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateMessage() {
  const [form, setForm] = useState({ title: '', content: '', attachments: [] });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem('token');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Enter to submit
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!loading && form.title.trim() && form.content.trim() && form.title.length <= 100 && charCount <= 1000) {
          document.querySelector('form').requestSubmit();
        }
      }
      // Escape to clear form
      if (event.key === 'Escape') {
        clearForm();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [form.title, form.content, loading, charCount]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'content') {
      setCharCount(value.length);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];

    files.forEach(file => {
      if (file.size > maxSize) {
        setMsg(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        setMsg(`File type "${file.type}" is not supported. Please upload PDF, DOC, DOCX, JPG, PNG, or GIF files.`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      setMsg(''); // Clear any error messages
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!form.title.trim() || !form.content.trim()) {
      setMsg('Please fill in all required fields.');
      return;
    }

    if (form.title.length > 100) {
      setMsg('Title must be less than 100 characters.');
      return;
    }

    if (form.content.length > 1000) {
      setMsg('Message content must be less than 1000 characters.');
      return;
    }

    if (!token) {
      setMsg('You must be logged in to send a message.');
      return;
    }

    setLoading(true);
    setMsg(''); // Clear any previous messages
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('content', form.content.trim());
      
      // Append files
      selectedFiles.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
      
      const response = await axios.post('/api/messages', formData, { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        } 
      });
      
      setMsg('Message sent successfully! It will be forwarded to your department teacher for review.');
      setForm({ title: '', content: '', attachments: [] });
      setSelectedFiles([]);
      setCharCount(0);
      
      // Clear file input
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setMsg(''), 5000);
      
    } catch (err) {
      console.error('Error sending message:', err);
      
      if (!err.response) {
        setMsg('Network error. Please check your connection and try again.');
        return;
      }
      
      const errorMessage = err.response?.data?.error || 'Failed to send message. Please try again.';
      
      // Provide helpful guidance for common errors
      if (errorMessage.includes('No teacher found')) {
        setMsg('Unable to send message: No teacher is assigned to your department. Please contact the administration for assistance.');
      } else if (errorMessage.includes('Only students can send messages')) {
        setMsg('Only students can create new messages. Please contact your administrator if you need to send a message.');
      } else if (err.response.status === 401) {
        setMsg('Your session has expired. Please log in again.');
      } else if (err.response.status === 403) {
        setMsg('You do not have permission to perform this action.');
      } else {
        setMsg(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    // Ask for confirmation if there's content
    if (form.title.trim() || form.content.trim() || selectedFiles.length > 0) {
      if (!window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
        return;
      }
    }
    
    setForm({ title: '', content: '', attachments: [] });
    setSelectedFiles([]);
    setCharCount(0);
    setMsg('');
    // Clear file input if it exists
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Send New Message</h1>
                <p className="text-blue-100 text-sm">Create and send a message through the workflow system</p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearForm}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              title="Clear form"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Status Message */}
          {msg && (
            <div className={`mb-6 rounded-lg p-4 border ${
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  autoFocus
                  maxLength={100}
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out pl-10 pr-16 ${
                    form.title.length > 100 ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Enter a clear and descriptive title"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className={`text-xs ${
                    form.title.length > 100 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {form.title.length}/100
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Choose a title that clearly describes the purpose of your message
              </p>
            </div>

            {/* Message Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Content <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="content"
                  id="content"
                  required
                  rows={6}
                  maxLength={1000}
                  value={form.content}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition duration-200 ease-in-out resize-none ${
                    charCount > 1000 ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Write your message content here. Be clear and concise about your request or information."
                />
                <div className="absolute right-3 bottom-3">
                  <span className={`text-xs ${
                    charCount > 1000 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {charCount}/1000
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Provide detailed information about your request. This will help reviewers understand and process your message efficiently.
              </p>
            </div>

            {/* Attachments Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments (Optional)
                {selectedFiles.length > 0 && (
                  <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                    ({selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected)
                  </span>
                )}
              </label>
              
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('fileInput').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-blue-400');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-400');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-blue-400');
                  const files = Array.from(e.dataTransfer.files);
                  const event = { target: { files } };
                  handleFileChange(event);
                }}
              >
                <div className="flex flex-col items-center">
                  <svg className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF, DOC, DOCX, JPG, PNG, GIF up to 10MB each
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              {/* File list */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Files:</h4>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center flex-1 min-w-0">
                        {/* File type icon */}
                        <div className="flex-shrink-0 mr-3">
                          {file.type.startsWith('image/') ? (
                            <svg className="h-6 w-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="h-6 w-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        
                        {/* File info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                          </p>
                        </div>
                        
                        {/* Preview for images */}
                        {file.type.startsWith('image/') && (
                          <div className="flex-shrink-0 ml-3">
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Preview"
                              className="h-10 w-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        title="Remove file"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Workflow Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Message Workflow Information
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">1</span>
                  </div>
                  <p>Your message will first be sent to your <strong>Department Teacher</strong> for initial review</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">2</span>
                  </div>
                  <p>If approved, it will be forwarded through: <strong>Teacher → HOD → Principal → Director → CEO → Chairman</strong></p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">3</span>
                  </div>
                  <p>You'll receive <strong>real-time notifications</strong> at each stage of the approval process</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300">4</span>
                  </div>
                  <p>Track your message status anytime from the <strong>Dashboard</strong></p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Form
                </button>
                
                <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Esc</kbd>
                  <span className="ml-1">to clear</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Ctrl</kbd>
                  <span className="mx-1">+</span>
                  <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Enter</kbd>
                  <span className="ml-1">to send</span>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !form.title.trim() || !form.content.trim() || form.title.length > 100 || charCount > 1000}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition duration-200 ease-in-out hover:scale-105 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
