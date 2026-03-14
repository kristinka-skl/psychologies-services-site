'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import {
  notifyError,
  notifyErrorMessage,
  notifySuccess,
} from '@/app/lib/notifications';
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
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
  const descriptionText = isRegister
    ? 'Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.'
    : 'Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.';
  const passwordInputType = isPasswordVisible ? 'text' : 'password';
  const passwordToggleLabel = isPasswordVisible
    ? 'Hide password'
    : 'Show password';
  const passwordToggleIcon = isPasswordVisible ? 'icon-eye-off' : 'icon-eye';

  const onLoginSubmit = async (values: AuthLoginValues) => {
    try {
      await signIn(values.email, values.password);
      notifySuccess('authLoginSuccess');
      loginForm.reset();
      closeAuthModal();
    } catch (error: unknown) {
      notifyError(error, 'authLogin');
    }
  };

  const onRegisterSubmit = async (values: AuthRegisterValues) => {
    try {
      await signUp(values.name, values.email, values.password);
      notifySuccess('authRegisterSuccess');
      registerForm.reset();
      closeAuthModal();
    } catch (error: unknown) {
      notifyError(error, 'authRegister');
    }
  };

  const onInvalidLoginSubmit = (
    errors: Partial<Record<keyof AuthLoginValues, { message?: string }>>
  ) => {
    const firstError =
      errors.email?.message ??
      errors.password?.message ??
      'Please check highlighted fields.';
    notifyErrorMessage(firstError);
  };

  const onInvalidRegisterSubmit = (
    errors: Partial<Record<keyof AuthRegisterValues, { message?: string }>>
  ) => {
    const firstError =
      errors.name?.message ??
      errors.email?.message ??
      errors.password?.message ??
      'Please check highlighted fields.';
    notifyErrorMessage(firstError);
  };

  useEffect(() => {
    if (!isAuthModalOpen) {
      setIsPasswordVisible(false);
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
      <p className={css.description}>{descriptionText}</p>

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
            <span className={css.visuallyHidden}>Name</span>
            <input
              className={`${css.input} ${hasRegisterNameError ? css.inputError : ''}`}
              aria-invalid={hasRegisterNameError}
              aria-describedby='register-name-error'
              type='text'
              placeholder='Name'
              {...registerForm.register('name')}
            />
            <span id='register-name-error' className={css.error} role='alert'>
              {registerErrors.name?.message}
            </span>
          </label>

          <label className={css.field}>
            <span className={css.visuallyHidden}>Email</span>
            <input
              className={`${css.input} ${hasRegisterEmailError ? css.inputError : ''}`}
              aria-invalid={hasRegisterEmailError}
              aria-describedby='register-email-error'
              type='email'
              placeholder='Email'
              {...registerForm.register('email')}
            />
            <span id='register-email-error' className={css.error} role='alert'>
              {registerErrors.email?.message}
            </span>
          </label>

          <label className={css.field}>
            <span className={css.visuallyHidden}>Password</span>
            <input
              className={`${css.input} ${css.passwordInput} ${hasRegisterPasswordError ? css.inputError : ''}`}
              aria-invalid={hasRegisterPasswordError}
              aria-describedby='register-password-error'
              type={passwordInputType}
              placeholder='Password'
              {...registerForm.register('password')}
            />
            <button
              className={css.passwordToggle}
              type='button'
              aria-label={passwordToggleLabel}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              <svg className={css.passwordToggleIcon} aria-hidden='true'>
                <use href={`/sprite.svg#${passwordToggleIcon}`} />
              </svg>
            </button>
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
            <span className={css.visuallyHidden}>Email</span>
            <input
              className={`${css.input} ${hasLoginEmailError ? css.inputError : ''}`}
              aria-invalid={hasLoginEmailError}
              aria-describedby='login-email-error'
              type='email'
              placeholder='Email'
              {...loginForm.register('email')}
            />
            <span id='login-email-error' className={css.error} role='alert'>
              {loginErrors.email?.message}
            </span>
          </label>

          <label className={css.field}>
            <span className={css.visuallyHidden}>Password</span>
            <input
              className={`${css.input} ${css.passwordInput} ${hasLoginPasswordError ? css.inputError : ''}`}
              aria-invalid={hasLoginPasswordError}
              aria-describedby='login-password-error'
              type={passwordInputType}
              placeholder='Password'
              {...loginForm.register('password')}
            />
            <button
              className={css.passwordToggle}
              type='button'
              aria-label={passwordToggleLabel}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
            >
              <svg className={css.passwordToggleIcon} aria-hidden='true'>
                <use href={`/sprite.svg#${passwordToggleIcon}`} />
              </svg>
            </button>
            <span id='login-password-error' className={css.error} role='alert'>
              {loginErrors.password?.message}
            </span>
          </label>

          <button className={css.submitButton} type='submit'>
            Log in
          </button>
        </form>
      )}
    </Modal>
  );
}
