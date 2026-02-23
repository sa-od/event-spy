export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  _id: string;
  name: string;
  domain: string;
  apiKey: string;
  userId: string;
  createdAt: string;
  eventCount?: number;
}

export interface TrackingEvent {
  _id: string;
  projectId: string;
  eventType: string;
  elementTag?: string;
  elementId?: string;
  elementClass?: string;
  elementText?: string;
  pageUrl: string;
  referrer?: string;
  visitorId: string;
  sessionId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface AnalyticsSummary {
  totalEvents: number;
  uniqueVisitors: number;
  pageViews: number;
  topPages: { pageUrl: string; count: number }[];
}

export interface EventsOverTime {
  date: string;
  count: number;
}

export interface TopElement {
  elementTag: string;
  elementId: string;
  elementText: string;
  count: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
