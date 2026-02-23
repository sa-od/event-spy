export function validateRegister(body: Record<string, unknown>): string | null {
  const { email, password, name } = body;

  if (!email || !password || !name) {
    return 'Email, password, and name are required';
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return 'Invalid email';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return null;
}

export function validateLogin(body: Record<string, unknown>): string | null {
  const { email, password } = body;

  if (!email || !password) {
    return 'Email and password are required';
  }

  return null;
}

export function validateProject(body: Record<string, unknown>): string | null {
  const { name, domain } = body;

  if (!name || !domain) {
    return 'Project name and domain are required';
  }

  return null;
}

export function validateEvents(body: Record<string, unknown>): string | null {
  const { events } = body;

  if (!Array.isArray(events) || events.length === 0) {
    return 'Events array is required and must not be empty';
  }

  if (events.length > 100) {
    return 'Maximum 100 events per batch';
  }

  for (const event of events) {
    if (!event.eventType || !event.pageUrl) {
      return 'Each event must have eventType and pageUrl';
    }
  }

  return null;
}
