'use client';

import { ChangeEvent, ClipboardEvent, FocusEvent, useEffect } from 'react';
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
  const sanitizePhoneValue = (value: string) => {
    const allowedCharactersOnly = value.replace(/[^\d+\s()-]/g, '');

    if (!allowedCharactersOnly) {
      return '';
    }

    const hasLeadingPlus = allowedCharactersOnly.startsWith('+');
    const valueWithoutPluses = allowedCharactersOnly.replace(/\+/g, '');

    return hasLeadingPlus ? `+${valueWithoutPluses}` : valueWithoutPluses;
  };

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
  const phoneField = form.register('phone');
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

  const onPhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizePhoneValue(event.target.value);

    form.setValue('phone', sanitizedValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onPhonePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const input = event.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const pastedText = event.clipboardData.getData('text');
    const rawValue =
      input.value.slice(0, start) + pastedText + input.value.slice(end);
    const sanitizedValue = sanitizePhoneValue(rawValue);
    const nextCaretValue = sanitizePhoneValue(input.value.slice(0, start) + pastedText);
    const nextCaretPosition = nextCaretValue.length;

    form.setValue('phone', sanitizedValue, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    requestAnimationFrame(() => {
      input.setSelectionRange(nextCaretPosition, nextCaretPosition);
    });
  };

  const onPhoneFocus = (event: FocusEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const value = input.value;

    if (!value) {
      form.setValue('phone', '+380', {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });

      requestAnimationFrame(() => {
        input.setSelectionRange(4, 4);
      });

      return;
    }

    if (value === '+380') {
      requestAnimationFrame(() => {
        input.setSelectionRange(4, 4);
      });
    }
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

      <figure className={css.psychologistBlock}>
        <Image
          className={css.psychologistAvatar}
          src={psychologistAvatarUrl}
          alt={`${psychologistName} profile photo`}
          width={44}
          height={44}
          unoptimized
        />
        <figcaption>
          <p className={css.psychologistLabel}>Your psychologist</p>
          <p className={css.psychologistName}>{psychologistName}</p>
        </figcaption>
      </figure>

      <form className={css.form} onSubmit={form.handleSubmit(onSubmit)}>
        <label className={css.field}>
          <span className={css.visuallyHidden}>Name</span>
          <input
            className={`${css.input} ${shouldShowErrors && errors.name ? css.inputError : ''}`}
            aria-invalid={shouldShowErrors && Boolean(errors.name)}
            aria-describedby={
              shouldShowErrors && errors.name ? 'appointment-name-error' : undefined
            }
            type='text'
            placeholder='Name'
            {...form.register('name')}
          />
          <span id='appointment-name-error' className={css.error}>
            {shouldShowErrors ? errors.name?.message : ''}
          </span>
        </label>

        <label className={css.field}>
          <span className={css.visuallyHidden}>Email</span>
          <input
            className={`${css.input} ${shouldShowErrors && errors.email ? css.inputError : ''}`}
            aria-invalid={shouldShowErrors && Boolean(errors.email)}
            aria-describedby={
              shouldShowErrors && errors.email ? 'appointment-email-error' : undefined
            }
            type='email'
            placeholder='Email'
            {...form.register('email')}
          />
          <span id='appointment-email-error' className={css.error}>
            {shouldShowErrors ? errors.email?.message : ''}
          </span>
        </label>

        <div className={css.row}>
          <label className={css.field}>
            <span className={css.visuallyHidden}>Phone</span>
            <input
              className={`${css.input} ${shouldShowErrors && errors.phone ? css.inputError : ''}`}
              aria-invalid={shouldShowErrors && Boolean(errors.phone)}
              aria-describedby={
                shouldShowErrors && errors.phone ? 'appointment-phone-error' : undefined
              }
              type='tel'
              placeholder='+380'
              {...phoneField}
              onChange={onPhoneChange}
              onPaste={onPhonePaste}
              onFocus={onPhoneFocus}
            />
            <span id='appointment-phone-error' className={css.error}>
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
              buttonId='appointment-time-button'
              errorId='appointment-time-error'
              listboxId='appointment-time-listbox'
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
            aria-describedby={
              shouldShowErrors && errors.comment
                ? 'appointment-comment-error'
                : undefined
            }
            rows={4}
            placeholder='Comment'
            {...form.register('comment')}
          />
          <span id='appointment-comment-error' className={css.error}>
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
