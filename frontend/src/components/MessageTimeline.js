import React from 'react';

export default function MessageTimeline({ historyLog }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approved':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-green-800 dark:text-green-200',
          bgClass: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'Rejected':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-red-800 dark:text-red-200',
          bgClass: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          icon: (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      case 'Forwarded':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-800 dark:text-blue-200',
          bgClass: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          icon: (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-800 dark:text-gray-200',
          bgClass: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          icon: (
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!historyLog || historyLog.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Status Timeline
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No timeline history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6 flex items-center">
        <svg className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Status Timeline
        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          {historyLog.length} {historyLog.length === 1 ? 'entry' : 'entries'}
        </span>
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        {/* Timeline items */}
        <div className="space-y-6">
          {historyLog.map((entry, index) => {
            const config = getStatusConfig(entry.status);
            const isLast = index === historyLog.length - 1;

            return (
              <div key={index} className="relative flex items-start">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-800`}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className={`rounded-lg border p-4 ${config.bgClass} ${config.borderColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.textColor} bg-white dark:bg-gray-800 border ${config.borderColor}`}>
                          {entry.role}
                        </span>
                        <span className={`font-semibold text-sm ${config.textColor}`}>
                          {entry.status}
                        </span>
                      </div>
                      <time className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {formatDate(entry.date)}
                      </time>
                    </div>

                    {entry.comment && (
                      <div className="mt-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-md border border-white/40 dark:border-gray-700/40">
                        <div className="flex items-start">
                          <svg className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <blockquote className="text-sm text-gray-700 dark:text-gray-300 italic">
                            "{entry.comment}"
                          </blockquote>
                        </div>
                      </div>
                    )}

                    {/* Show processor info if available */}
                    {entry.processedBy && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Processed by: <span className="font-medium">{entry.processedBy}</span>
                      </div>
                    )}
                  </div>

                  {/* Connection line to next item */}
                  {!isLast && (
                    <div className="mt-2 ml-2 text-xs text-gray-400 dark:text-gray-500">
                      <svg className="h-4 w-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {historyLog.filter(h => h.status === 'Approved').length} Approved
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {historyLog.filter(h => h.status === 'Rejected').length} Rejected
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600 dark:text-gray-300">
                  {historyLog.filter(h => h.status === 'Forwarded').length} Forwarded
                </span>
              </div>
            </div>
            <span className="text-gray-500 dark:text-gray-400">
              Total: {historyLog.length} actions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
