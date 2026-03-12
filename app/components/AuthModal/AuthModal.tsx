'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
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
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<AuthRegisterValues>({
    resolver: yupResolver(authRegisterSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', password: '' },
  });

  const onLoginSubmit = (values: AuthLoginValues) => {
    signIn({ email: values.email, name: values.email.split('@')[0] });
    toast.success('You are logged in');
    loginForm.reset();
    closeAuthModal();
  };

  const onRegisterSubmit = (values: AuthRegisterValues) => {
    signUp({ name: values.name, email: values.email });
    toast.success('Registration successful');
    registerForm.reset();
    closeAuthModal();
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isRegister ? 'Create account' : 'Log in'}
    >
      {isRegister ? (
        <form
          className={css.form}
          onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
        >
          <label className={css.field}>
            Name
            <input
              className={css.input}
              type='text'
              {...registerForm.register('name')}
            />
            <span className={css.error}>{registerForm.formState.errors.name?.message}</span>
          </label>

          <label className={css.field}>
            Email
            <input
              className={css.input}
              type='email'
              {...registerForm.register('email')}
            />
            <span className={css.error}>{registerForm.formState.errors.email?.message}</span>
          </label>

          <label className={css.field}>
            Password
            <input
              className={css.input}
              type='password'
              {...registerForm.register('password')}
            />
            <span className={css.error}>{registerForm.formState.errors.password?.message}</span>
          </label>

          <button className={css.submitButton} type='submit'>
            Register
          </button>
        </form>
      ) : (
        <form
          className={css.form}
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
        >
          <label className={css.field}>
            Email
            <input
              className={css.input}
              type='email'
              {...loginForm.register('email')}
            />
            <span className={css.error}>{loginForm.formState.errors.email?.message}</span>
          </label>

          <label className={css.field}>
            Password
            <input
              className={css.input}
              type='password'
              {...loginForm.register('password')}
            />
            <span className={css.error}>{loginForm.formState.errors.password?.message}</span>
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
