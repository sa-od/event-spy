import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Project, TrackingEvent, Pagination, AnalyticsSummary, EventsOverTime, TopElement } from '../types';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/api/projects').then((r) => r.data),
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => api.get(`/api/projects/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; domain: string }) =>
      api.post('/api/projects', data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/projects/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
}

export function useEvents(params: {
  projectId: string;
  eventType?: string;
  pageUrl?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery<{ events: TrackingEvent[]; pagination: Pagination }>({
    queryKey: ['events', params],
    queryFn: () => api.get('/api/events', { params }).then((r) => r.data),
    enabled: !!params.projectId,
  });
}

export function useSummary(projectId: string, period: string) {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', 'summary', projectId, period],
    queryFn: () => api.get('/api/analytics/summary', { params: { projectId, period } }).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useEventsOverTime(projectId: string, period: string) {
  return useQuery<EventsOverTime[]>({
    queryKey: ['analytics', 'events-over-time', projectId, period],
    queryFn: () => api.get('/api/analytics/events-over-time', { params: { projectId, period } }).then((r) => r.data),
    enabled: !!projectId,
  });
}

export function useTopElements(projectId: string, period: string) {
  return useQuery<TopElement[]>({
    queryKey: ['analytics', 'top-elements', projectId, period],
    queryFn: () => api.get('/api/analytics/top-elements', { params: { projectId, period } }).then((r) => r.data),
    enabled: !!projectId,
  });
}
