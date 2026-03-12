import * as yup from 'yup';

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
  name: yup.string().min(2, 'Name is too short').required('Name is required'),
  phone: yup.string().min(7, 'Phone is too short').required('Phone is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  time: yup.string().required('Preferred time is required'),
  notes: yup.string().required('Please provide a short message'),
});

export type AuthLoginValues = yup.InferType<typeof authLoginSchema>;
export type AuthRegisterValues = yup.InferType<typeof authRegisterSchema>;
export type AppointmentValues = yup.InferType<typeof appointmentSchema>;
