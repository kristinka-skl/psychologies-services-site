'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import getAuthErrorMessage from '@/app/lib/getAuthErrorMessage';
import {
  authLoginSchema,
  authRegisterSchema,
  AuthLoginValues,
  AuthRegisterValues,
} from '@/app/lib/validation';
import Modal from '@/app/components/Modal/Modal';
import { useAuthStore } from '@/app/store/authStore';
import { useUiStore } from '@/app/store/uiStore';
import css from '@/app/components/AuthModal/AuthModal.module.css';

export default function AuthModal() {
  const authModalMode = useUiStore((state) => state.authModalMode);
  const isAuthModalOpen = useUiStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useUiStore((state) => state.closeAuthModal);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);

  const isRegister = authModalMode === 'register';

  const loginForm = useForm<AuthLoginValues>({
    resolver: yupResolver(authLoginSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<AuthRegisterValues>({
    resolver: yupResolver(authRegisterSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  const loginErrors = loginForm.formState.errors;
  const registerErrors = registerForm.formState.errors;

  const hasLoginEmailError = Boolean(loginErrors.email?.message);
  const hasLoginPasswordError = Boolean(loginErrors.password?.message);

  const hasRegisterNameError = Boolean(registerErrors.name?.message);
  const hasRegisterEmailError = Boolean(registerErrors.email?.message);
  const hasRegisterPasswordError = Boolean(registerErrors.password?.message);

  const onLoginSubmit = async (values: AuthLoginValues) => {
    try {
      await signIn(values.email, values.password);
      toast.success('You are logged in');
      loginForm.reset();
      closeAuthModal();
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Login failed'));
    }
  };

  const onRegisterSubmit = async (values: AuthRegisterValues) => {
    try {
      await signUp(values.name, values.email, values.password);
      toast.success('Registration successful');
      registerForm.reset();
      closeAuthModal();
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Registration failed'));
    }
  };

  const onInvalidLoginSubmit = (
    errors: Partial<Record<keyof AuthLoginValues, { message?: string }>>
  ) => {
    const firstError =
      errors.email?.message ??
      errors.password?.message ??
      'Please check highlighted fields.';
    toast.error(firstError);
  };

  const onInvalidRegisterSubmit = (
    errors: Partial<Record<keyof AuthRegisterValues, { message?: string }>>
  ) => {
    const firstError =
      errors.name?.message ??
      errors.email?.message ??
      errors.password?.message ??
      'Please check highlighted fields.';
    toast.error(firstError);
  };

  useEffect(() => {
    if (!isAuthModalOpen) {
      return;
    }

    if (isRegister) {
      loginForm.clearErrors();
    } else {
      registerForm.clearErrors();
    }
  }, [isAuthModalOpen, isRegister, loginForm, registerForm]);

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isRegister ? 'Create account' : 'Log in'}
    >
      {isRegister ? (
        <form
          key='register-form'
          className={css.form}
          noValidate
          onSubmit={registerForm.handleSubmit(
            onRegisterSubmit,
            onInvalidRegisterSubmit
          )}
        >
          <label className={css.field}>
            Name
            <input
              className={`${css.input} ${hasRegisterNameError ? css.inputError : ''}`}
              aria-invalid={hasRegisterNameError}
              aria-describedby='register-name-error'
              type='text'
              placeholder='Enter your name'
              {...registerForm.register('name')}
            />
            <span id='register-name-error' className={css.error} role='alert'>
              {registerErrors.name?.message}
            </span>
          </label>

          <label className={css.field}>
            Email
            <input
              className={`${css.input} ${hasRegisterEmailError ? css.inputError : ''}`}
              aria-invalid={hasRegisterEmailError}
              aria-describedby='register-email-error'
              type='email'
              placeholder='Enter your email'
              {...registerForm.register('email')}
            />
            <span id='register-email-error' className={css.error} role='alert'>
              {registerErrors.email?.message}
            </span>
          </label>

          <label className={css.field}>
            Password
            <input
              className={`${css.input} ${hasRegisterPasswordError ? css.inputError : ''}`}
              aria-invalid={hasRegisterPasswordError}
              aria-describedby='register-password-error'
              type='password'
              placeholder='Enter your password'
              {...registerForm.register('password')}
            />
            <span id='register-password-error' className={css.error} role='alert'>
              {registerErrors.password?.message}
            </span>
          </label>

          <button className={css.submitButton} type='submit'>
            Register
          </button>
        </form>
      ) : (
        <form
          key='login-form'
          className={css.form}
          noValidate
          onSubmit={loginForm.handleSubmit(onLoginSubmit, onInvalidLoginSubmit)}
        >
          <label className={css.field}>
            Email
            <input
              className={`${css.input} ${hasLoginEmailError ? css.inputError : ''}`}
              aria-invalid={hasLoginEmailError}
              aria-describedby='login-email-error'
              type='email'
              placeholder='Enter your email'
              {...loginForm.register('email')}
            />
            <span id='login-email-error' className={css.error} role='alert'>
              {loginErrors.email?.message}
            </span>
          </label>

          <label className={css.field}>
            Password
            <input
              className={`${css.input} ${hasLoginPasswordError ? css.inputError : ''}`}
              aria-invalid={hasLoginPasswordError}
              aria-describedby='login-password-error'
              type='password'
              placeholder='Enter your password'
              {...loginForm.register('password')}
            />
            <span id='login-password-error' className={css.error} role='alert'>
              {loginErrors.password?.message}
            </span>
          </label>

          <button className={css.submitButton} type='submit'>
            Log in
          </button>
        </form>
      )}

      <button
        className={css.switchMode}
        type='button'
        onClick={() => openAuthModal(isRegister ? 'login' : 'register')}
      >
        {isRegister ? 'Already have an account? Log in' : 'Need an account? Register'}
      </button>
    </Modal>
  );
}
