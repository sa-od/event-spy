'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import EventTable from '@/components/EventTable';
import { useTheme } from '@/context/ThemeContext';
import {
  useProject,
  useSummary,
  useEventsOverTime,
  useTopElements,
  useEvents,
} from '@/hooks/useApi';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const PERIODS = [
  { label: '24h', value: '24h' },
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

export default function Dashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);
  const router = useRouter();
  const { dark } = useTheme();
  const [period, setPeriod] = useState('7d');
  const [eventType, setEventType] = useState('');
  const [eventPage, setEventPage] = useState(1);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: summary } = useSummary(projectId, period);
  const { data: eventsOverTime } = useEventsOverTime(projectId, period);
  const { data: topElements } = useTopElements(projectId, period);
  const { data: eventsData } = useEvents({
    projectId,
    eventType: eventType || undefined,
    page: eventPage,
    limit: 20,
  });

  const snippetCode = `<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/sdk.js" data-key="${project?.apiKey || ''}" defer></script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const gridColor = dark ? '#1f2937' : '#e5e7eb';
  const textColor = dark ? '#9ca3af' : '#6b7280';

  ChartJS.defaults.color = textColor;
  ChartJS.defaults.borderColor = gridColor;

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found</p>
        </div>
      </div>
    );
  }

  const lineChartData = {
    labels: eventsOverTime?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'Events',
        data: eventsOverTime?.map((d) => d.count) || [],
        borderColor: '#818cf8',
        backgroundColor: 'rgba(129, 140, 248, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: topElements?.map((el) =>
      `${el.elementTag}${el.elementId ? '#' + el.elementId : ''}${el.elementText ? ' "' + el.elementText.slice(0, 20) + '"' : ''}`
    ) || [],
    datasets: [
      {
        label: 'Clicks',
        data: topElements?.map((el) => el.count) || [],
        backgroundColor: '#818cf8',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <button onClick={() => router.push('/projects')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mb-1">
              &larr; Back to projects
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.domain}</p>
          </div>
          <div className="flex gap-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-1">
            {PERIODS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 text-sm rounded ${
                  period === p.value
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Embed Snippet</span>
            <div className="flex gap-2">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">API Key: {project.apiKey.slice(0, 12)}...</span>
              <button
                onClick={copySnippet}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                {copiedSnippet ? 'Copied!' : 'Copy snippet'}
              </button>
            </div>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            {snippetCode}
          </pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Events" value={summary?.totalEvents?.toLocaleString() || '0'} />
          <StatCard title="Unique Visitors" value={summary?.uniqueVisitors?.toLocaleString() || '0'} />
          <StatCard title="Page Views" value={summary?.pageViews?.toLocaleString() || '0'} />
          <StatCard
            title="Top Page"
            value={summary?.topPages?.[0]?.pageUrl?.replace(/https?:\/\/[^/]+/, '') || '-'}
            subtitle={summary?.topPages?.[0] ? `${summary.topPages[0].count} views` : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <ChartCard title="Events Over Time">
            {eventsOverTime && eventsOverTime.length > 0 ? (
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: gridColor } },
                    x: { ticks: { maxTicksLimit: 10 }, grid: { color: gridColor } },
                  },
                }}
              />
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">No data for this period</p>
            )}
          </ChartCard>
          <ChartCard title="Top 10 Clicked Elements">
            {topElements && topElements.length > 0 ? (
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  indexAxis: 'y',
                  plugins: { legend: { display: false } },
                  scales: {
                    x: { beginAtZero: true, grid: { color: gridColor } },
                    y: { grid: { color: gridColor } },
                  },
                }}
              />
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-600 text-center py-8">No click data for this period</p>
            )}
          </ChartCard>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Event Log</h2>
          <select
            value={eventType}
            onChange={(e) => { setEventType(e.target.value); setEventPage(1); }}
            className="text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All types</option>
            <option value="pageview">Page Views</option>
            <option value="click">Clicks</option>
            <option value="form_submit">Form Submissions</option>
          </select>
        </div>
        <EventTable
          events={eventsData?.events || []}
          page={eventPage}
          totalPages={eventsData?.pagination?.pages || 1}
          onPageChange={setEventPage}
        />
      </div>
    </div>
  );
}
