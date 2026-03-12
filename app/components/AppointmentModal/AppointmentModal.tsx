'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '@/app/components/Modal/Modal';
import { appointmentSchema, AppointmentValues } from '@/app/lib/validation';
import css from '@/app/components/AppointmentModal/AppointmentModal.module.css';

interface AppointmentModalProps {
  isOpen: boolean;
  psychologistName: string;
  onClose: () => void;
}

export default function AppointmentModal({
  isOpen,
  psychologistName,
  onClose,
}: AppointmentModalProps) {
  const form = useForm<AppointmentValues>({
    resolver: yupResolver(appointmentSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      time: '',
      notes: '',
    },
  });

  const onSubmit = (values: AppointmentValues) => {
    toast.success(`Request sent to ${psychologistName}`);
    form.reset(values);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Make an appointment with ${psychologistName}`}
    >
      <form className={css.form} onSubmit={form.handleSubmit(onSubmit)}>
        <label className={css.field}>
          Name
          <input className={css.input} type='text' {...form.register('name')} />
          <span className={css.error}>{form.formState.errors.name?.message}</span>
        </label>

        <label className={css.field}>
          Phone
          <input className={css.input} type='tel' {...form.register('phone')} />
          <span className={css.error}>{form.formState.errors.phone?.message}</span>
        </label>

        <label className={css.field}>
          Email
          <input className={css.input} type='email' {...form.register('email')} />
          <span className={css.error}>{form.formState.errors.email?.message}</span>
        </label>

        <label className={css.field}>
          Preferred time
          <input className={css.input} type='text' {...form.register('time')} />
          <span className={css.error}>{form.formState.errors.time?.message}</span>
        </label>

        <label className={css.field}>
          Message
          <textarea className={css.textarea} rows={4} {...form.register('notes')} />
          <span className={css.error}>{form.formState.errors.notes?.message}</span>
        </label>

        <button className={css.submitButton} type='submit'>
          Send request
        </button>
      </form>
    </Modal>
  );
}
