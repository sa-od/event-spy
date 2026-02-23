import type { TrackingEvent } from '@/types';

interface EventTableProps {
  events: TrackingEvent[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EventTable({ events, page, totalPages, onPageChange }: EventTableProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Element</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page URL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No events found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.eventType === 'click' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                      event.eventType === 'pageview' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                      event.eventType === 'form_submit' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">
                    {event.elementTag && (
                      <>
                        <span className="font-mono text-xs">&lt;{event.elementTag}&gt;</span>
                        {event.elementText && (
                          <span className="ml-1 text-gray-400 dark:text-gray-500">{event.elementText.slice(0, 30)}</span>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[250px] truncate">
                    {event.pageUrl}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono text-xs">
                    {event.visitorId.slice(0, 12)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
