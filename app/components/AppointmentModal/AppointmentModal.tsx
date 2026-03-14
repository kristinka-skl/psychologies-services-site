'use client';

import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import Modal from '@/app/components/Modal/Modal';
import AppointmentTimePicker from '@/app/components/AppointmentTimePicker/AppointmentTimePicker';
import { APPOINTMENT_TIME_OPTIONS } from '@/app/lib/appointmentTimeOptions';
import { notifySuccess } from '@/app/lib/notifications';
import { appointmentSchema, AppointmentValues } from '@/app/lib/validation';
import css from '@/app/components/AppointmentModal/AppointmentModal.module.css';

interface AppointmentModalProps {
  isOpen: boolean;
  psychologistName: string;
  psychologistAvatarUrl: string;
  onClose: () => void;
}

export default function AppointmentModal({
  isOpen,
  psychologistName,
  psychologistAvatarUrl,
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
      comment: '',
    },
  });

  const selectedTime = useWatch({
    control: form.control,
    name: 'time',
  });
  const errors = form.formState.errors;
  const shouldShowErrors = form.formState.submitCount > 0;

  useEffect(() => {
    if (isOpen) {
      return;
    }

    form.reset();
  }, [isOpen, form]);

  const onSubmit = () => {
    notifySuccess('appointmentRequestSent', { psychologistName });
    form.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Make an appointment with a psychologists`}
      size='appointment'
    >
      <p className={css.description}>
        You are on the verge of changing your life for the better. Fill out the
        short form below to book your personal appointment with a professional
        psychologist. We guarantee confidentiality and respect for your privacy.
      </p>

      <div className={css.psychologistBlock}>
        <Image
          className={css.psychologistAvatar}
          src={psychologistAvatarUrl}
          alt={`${psychologistName} profile photo`}
          width={44}
          height={44}
          unoptimized
        />
        <div>
          <p className={css.psychologistLabel}>Your psychologist</p>
          <p className={css.psychologistName}>{psychologistName}</p>
        </div>
      </div>

      <form className={css.form} onSubmit={form.handleSubmit(onSubmit)}>
        <label className={css.field}>
          <span className={css.visuallyHidden}>Name</span>
          <input
            className={`${css.input} ${shouldShowErrors && errors.name ? css.inputError : ''}`}
            aria-invalid={shouldShowErrors && Boolean(errors.name)}
            type='text'
            placeholder='Name'
            {...form.register('name')}
          />
          <span className={css.error}>
            {shouldShowErrors ? errors.name?.message : ''}
          </span>
        </label>

        <label className={css.field}>
          <span className={css.visuallyHidden}>Email</span>
          <input
            className={`${css.input} ${shouldShowErrors && errors.email ? css.inputError : ''}`}
            aria-invalid={shouldShowErrors && Boolean(errors.email)}
            type='email'
            placeholder='Email'
            {...form.register('email')}
          />
          <span className={css.error}>
            {shouldShowErrors ? errors.email?.message : ''}
          </span>
        </label>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.visuallyHidden}>Phone</span>
            <input
              className={`${css.input} ${shouldShowErrors && errors.phone ? css.inputError : ''}`}
              aria-invalid={shouldShowErrors && Boolean(errors.phone)}
              type='tel'
              placeholder='+380'
              {...form.register('phone')}
            />
            <span className={css.error}>
              {shouldShowErrors ? errors.phone?.message : ''}
            </span>
          </label>

          <div className={`${css.field} ${css.timeField}`}>
            <span className={css.visuallyHidden}>Meeting time</span>
            <AppointmentTimePicker
              value={selectedTime}
              options={APPOINTMENT_TIME_OPTIONS}
              error={shouldShowErrors ? errors.time?.message : ''}
              hasError={shouldShowErrors && Boolean(errors.time)}
              onSelect={(time) => {
                form.setValue('time', time, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
            />
            <input type='hidden' {...form.register('time')} />
          </div>
        </div>

        <label className={css.field}>
          <span className={css.visuallyHidden}>Comment</span>
          <textarea
            className={`${css.textarea} ${shouldShowErrors && errors.comment ? css.inputError : ''}`}
            aria-invalid={shouldShowErrors && Boolean(errors.comment)}
            rows={4}
            placeholder='Comment'
            {...form.register('comment')}
          />
          <span className={css.error}>
            {shouldShowErrors ? errors.comment?.message : ''}
          </span>
        </label>

        <button className={css.submitButton} type='submit'>
          Send
        </button>
      </form>
    </Modal>
  );
}
