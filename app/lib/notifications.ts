import toast, { ToastOptions } from 'react-hot-toast';
import { ErrorContext, mapErrorToUserMessage } from '@/app/lib/errors';

type SuccessNotificationKey =
  | 'authLoginSuccess'
  | 'authRegisterSuccess'
  | 'authLogoutSuccess'
  | 'appointmentRequestSent';

type InfoNotificationKey = 'favoritesRequireAuth';

const SUCCESS_MESSAGES: Record<SuccessNotificationKey, string> = {
  authLoginSuccess: 'You are logged in.',
  authRegisterSuccess: 'Registration successful.',
  authLogoutSuccess: 'You have been logged out.',
  appointmentRequestSent: 'Request sent successfully.',
};

const INFO_MESSAGES: Record<InfoNotificationKey, string> = {
  favoritesRequireAuth: 'Favorites are available only for authorized users.',
};

interface NotifySuccessOptions {
  psychologistName?: string;
  toastId?: string;
}

interface NotifyErrorOptions {
  toastId?: string;
}

export function notifySuccess(
  key: SuccessNotificationKey,
  options: NotifySuccessOptions = {}
): void {
  const message =
    key === 'appointmentRequestSent' && options.psychologistName
      ? `Request sent to ${options.psychologistName}.`
      : SUCCESS_MESSAGES[key];

  toast.success(message, { id: options.toastId });
}

export function notifyInfo(
  key: InfoNotificationKey,
  options: ToastOptions = {}
): void {
  toast(INFO_MESSAGES[key], options);
}

export function notifyError(
  error: unknown,
  context: ErrorContext,
  options: NotifyErrorOptions = {}
): void {
  const message = mapErrorToUserMessage(error, context);
  toast.error(message, { id: options.toastId });
}

export function notifyErrorMessage(
  message: string,
  options: ToastOptions = {}
): void {
  toast.error(message, options);
}
