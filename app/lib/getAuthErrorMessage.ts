import { AuthError } from 'firebase/auth';

const errorMessages: Record<string, string> = {
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

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as AuthError).code === 'string'
  );
}

export default function getAuthErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isAuthError(error)) {
    return errorMessages[error.code] ?? fallback;
  }

  return fallback;
}
