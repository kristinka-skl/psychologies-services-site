export type AppErrorKind =
  | 'network'
  | 'timeout'
  | 'auth'
  | 'permission'
  | 'notFound'
  | 'unknown';

export type ErrorContext =
  | 'authLogin'
  | 'authRegister'
  | 'authLogout'
  | 'favoritesToggle'
  | 'favoritesLoad'
  | 'appointmentSubmit'
  | 'generic';

interface AppErrorOptions {
  kind?: AppErrorKind;
  code?: string;
  status?: number;
  cause?: unknown;
}

interface AuthLikeError {
  code: string;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use':
    'This email is already registered. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/too-many-requests':
    'Too many failed attempts. Please try again later.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/operation-not-allowed':
    'This sign-in method is not enabled. Contact support.',
};

const CONTEXT_FALLBACKS: Record<ErrorContext, string> = {
  authLogin: 'Unable to log in. Please try again.',
  authRegister: 'Unable to complete registration. Please try again.',
  authLogout: 'Unable to log out right now. Please try again.',
  favoritesToggle: 'Failed to update favorites. Please try again.',
  favoritesLoad: 'Could not sync favorites right now. Please try again later.',
  appointmentSubmit: 'Failed to send request. Please try again.',
  generic: 'Something went wrong. Please try again.',
};

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly code?: string;
  readonly status?: number;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.kind = options.kind ?? 'unknown';
    this.code = options.code;
    this.status = options.status;
    this.cause = options.cause;
  }
}

function isAuthLikeError(error: unknown): error is AuthLikeError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as AuthLikeError).code === 'string' &&
    (error as AuthLikeError).code.startsWith('auth/')
  );
}

export function isOffline(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return navigator.onLine === false;
}

function inferKindFromStatus(status?: number): AppErrorKind {
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

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAuthLikeError(error)) {
    const code = error.code;
    const kind = code === 'auth/network-request-failed' ? 'network' : 'auth';
    const message = AUTH_ERROR_MESSAGES[code] ?? CONTEXT_FALLBACKS.generic;

    return new AppError(message, { kind, code, cause: error });
  }

  if (isOffline()) {
    return new AppError('No internet connection.', {
      kind: 'network',
      code: 'network/offline',
      cause: error,
    });
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return new AppError('Request timed out.', {
        kind: 'timeout',
        code: 'request/timeout',
        cause: error,
      });
    }

    const messageLower = error.message.toLowerCase();

    if (
      messageLower.includes('timed out') ||
      messageLower.includes('timeout')
    ) {
      return new AppError('Request timed out.', {
        kind: 'timeout',
        code: 'request/timeout',
        cause: error,
      });
    }

    if (
      messageLower.includes('failed to fetch') ||
      messageLower.includes('network error') ||
      messageLower.includes('network request failed')
    ) {
      return new AppError('Network error. Check your connection and try again.', {
        kind: 'network',
        code: 'network/request-failed',
        cause: error,
      });
    }

    const statusMatch = error.message.match(/status\s+(\d{3})/i);
    if (statusMatch) {
      const status = Number(statusMatch[1]);
      return new AppError(error.message, {
        kind: inferKindFromStatus(status),
        status,
        cause: error,
      });
    }

    return new AppError(error.message || CONTEXT_FALLBACKS.generic, {
      cause: error,
    });
  }

  return new AppError(CONTEXT_FALLBACKS.generic, { cause: error });
}

export function mapErrorToUserMessage(
  error: unknown,
  context: ErrorContext
): string {
  const appError = normalizeError(error);

  if (appError.code && AUTH_ERROR_MESSAGES[appError.code]) {
    return AUTH_ERROR_MESSAGES[appError.code];
  }

  switch (appError.kind) {
    case 'network':
      return 'Network error. Check your connection and try again.';
    case 'timeout':
      return 'Request timed out. Please try again.';
    case 'permission':
      return 'You do not have permission to perform this action.';
    case 'notFound':
      return 'Requested data was not found.';
    case 'auth':
      return CONTEXT_FALLBACKS[context];
    case 'unknown':
    default:
      return CONTEXT_FALLBACKS[context];
  }
}

export function getContextFallbackMessage(context: ErrorContext): string {
  return CONTEXT_FALLBACKS[context];
}
