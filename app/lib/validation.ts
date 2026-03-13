import * as yup from 'yup';
import { APPOINTMENT_TIME_OPTIONS } from '@/app/lib/appointmentTimeOptions';

const trimString = (value: unknown) =>
  typeof value === 'string' ? value.trim() : value;
const completeEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const authLoginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const authRegisterSchema = yup.object({
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const appointmentSchema = yup.object({
  name: yup
    .string()
    .transform(trimString)
    .min(2, 'Name is too short')
    .matches(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ' -]+$/,
      'Name can contain only letters'
    )
    .required('Name is required'),
  phone: yup
    .string()
    .transform(trimString)
    .matches(/^\+?[0-9()\-\s]+$/, 'Phone contains invalid characters')
    .test(
      'phone-format',
      'Enter a complete phone number',
      (value) => {
        if (!value) {
          return false;
        }

        const digits = value.replace(/\D/g, '');

        if (digits.startsWith('380')) {
          return digits.length === 12;
        }

        if (digits.startsWith('0')) {
          return digits.length === 10;
        }

        return digits.length >= 10 && digits.length <= 15;
      }
    )
    .required('Phone is required'),
  email: yup
    .string()
    .transform(trimString)
    .email('Enter a valid email')
    .matches(completeEmailPattern, {
      message: 'Enter a complete email',
      excludeEmptyString: true,
    })
    .required('Email is required'),
  time: yup
    .string()
    .oneOf(APPOINTMENT_TIME_OPTIONS, 'Select a valid meeting time')
    .required('Meeting time is required'),
  comment: yup
    .string()
    .transform(trimString)
    .min(5, 'Comment is too short')
    .required('Comment is required'),
});

export type AuthLoginValues = yup.InferType<typeof authLoginSchema>;
export type AuthRegisterValues = yup.InferType<typeof authRegisterSchema>;
export type AppointmentValues = yup.InferType<typeof appointmentSchema>;
