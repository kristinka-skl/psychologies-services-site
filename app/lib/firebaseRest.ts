import { AppError, AppErrorKind, normalizeError } from '@/app/lib/errors';

interface FirebaseRestRequestOptions extends RequestInit {
  authToken?: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

interface FirebaseRestErrorPayload {
  error?: {
    message?: string;
  };
}

const DEFAULT_TIMEOUT_MS = 10000;

function getErrorKindByStatus(status: number): AppErrorKind {
  if (status === 401) {
    return 'auth';
  }

  if (status === 403) {
    return 'permission';
  }

  if (status === 404) {
    return 'notFound';
  }

  return 'unknown';
}

function getDatabaseBaseUrl(): string {
  const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'Missing required environment variable: NEXT_PUBLIC_FIREBASE_DATABASE_URL'
    );
  }

  return databaseUrl.replace(/\/+$/, '');
}

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '');
}

interface BuildDatabaseUrlOptions {
  authToken?: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
}

export function buildDatabaseUrl(
  path: string,
  options: BuildDatabaseUrlOptions = {}
): string {
  const { authToken, queryParams } = options;
  const baseUrl = getDatabaseBaseUrl();
  const normalizedPath = normalizePath(path);
  const url = new URL(`${baseUrl}/${normalizedPath}.json`);

  if (authToken) {
    url.searchParams.set('auth', authToken);
  }

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function getErrorMessage(
  payload: FirebaseRestErrorPayload | null,
  response: Response
): string {
  const firebaseMessage = payload?.error?.message;

  if (firebaseMessage) {
    return firebaseMessage;
  }

  return `Firebase REST request failed with status ${response.status}`;
}

export async function requestJson<T>(
  path: string,
  options: FirebaseRestRequestOptions = {}
): Promise<T> {
  const {
    authToken,
    queryParams,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers,
    ...requestInit
  } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildDatabaseUrl(path, { authToken, queryParams }), {
      ...requestInit,
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });
    const rawBody = await response.text();
    const parsedBody = rawBody
      ? (JSON.parse(rawBody) as FirebaseRestErrorPayload | T)
      : null;

    if (!response.ok) {
      const message = getErrorMessage(
        parsedBody as FirebaseRestErrorPayload | null,
        response
      );
      throw new AppError(message, {
        kind: getErrorKindByStatus(response.status),
        status: response.status,
        code: (parsedBody as FirebaseRestErrorPayload | null)?.error?.message,
      });
    }

    return parsedBody as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('Firebase REST request timed out', {
        kind: 'timeout',
        code: 'request/timeout',
        cause: error,
      });
    }

    throw normalizeError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}
