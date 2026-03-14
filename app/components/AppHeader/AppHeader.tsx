'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notifyError } from '@/app/lib/notifications';
import { useAuthStore } from '@/app/store/authStore';
import { useUiStore } from '@/app/store/uiStore';
import css from '@/app/components/AppHeader/AppHeader.module.css';

export default function AppHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const signOut = useAuthStore((state) => state.signOut);
  const openAuthModal = useUiStore((state) => state.openAuthModal);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const drawerId = 'mobile-navigation-drawer';

  const closeDrawer = () => setIsDrawerOpen(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error: unknown) {
      notifyError(error, 'authLogout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen]);

  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link className={css.logo} href='/'>
          <span className={css.logoAccent}>psychologists</span>.services
        </Link>

        <nav className={css.desktopNav} aria-label='Primary navigation'>
          <Link className={pathname === '/' ? css.active : ''} href='/'>
            Home
          </Link>
          <Link
            className={pathname === '/psychologists' ? css.active : ''}
            href='/psychologists'
          >
            Psychologists
          </Link>
          {user ? (
            <Link
              className={pathname === '/favorites' ? css.active : ''}
              href='/favorites'
            >
              Favorites
            </Link>
          ) : null}
        </nav>

        <div
          className={`${css.desktopActions} ${user ? css.desktopActionsAuthorized : ''}`}
        >
          {loading ? null : user ? (
            <>
              <div className={css.userInfo}>
                <span className={css.avatar} aria-hidden='true'>
                  <svg width='16' height='16'>
                    <use href='/sprite.svg#icon-user' />
                  </svg>
                </span>
                <p className={css.userName}>{user.name}</p>
              </div>
              <button
                className={css.secondaryButton}
                type='button'
                disabled={isLoggingOut}
                onClick={handleSignOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </button>
            </>
          ) : (
            <>
              <button
                className={css.secondaryButton}
                type='button'
                onClick={() => openAuthModal('login')}
              >
                Log In
              </button>
              <button
                className={css.primaryButton}
                type='button'
                onClick={() => openAuthModal('register')}
              >
                Registration
              </button>
            </>
          )}
        </div>

        <button
          className={css.burgerButton}
          type='button'
          aria-label='Open menu'
          aria-expanded={isDrawerOpen}
          aria-controls={drawerId}
          onClick={() => setIsDrawerOpen(true)}
        >
          <svg width='20' height='20' aria-hidden='true'>
            <use href='/sprite.svg#icon-menu' />
          </svg>
        </button>
      </div>

      {isDrawerOpen ? (
        <div className={css.drawerBackdrop} onClick={closeDrawer} role='presentation'>
          <aside
            id={drawerId}
            className={css.drawer}
            onClick={(event) => event.stopPropagation()}
            aria-label='Mobile menu'
          >
            <button
              className={css.drawerClose}
              type='button'
              onClick={closeDrawer}
              aria-label='Close menu'
            >
              <svg
                className={css.drawerCloseIcon}
                width='20'
                height='20'
                aria-hidden='true'
              >
                <use href='/sprite.svg#icon-close' />
              </svg>
            </button>
            <nav className={css.drawerNav} aria-label='Mobile navigation'>
              <Link href='/' onClick={closeDrawer}>
                Home
              </Link>
              <Link href='/psychologists' onClick={closeDrawer}>
                Psychologists
              </Link>
              {user ? (
                <Link href='/favorites' onClick={closeDrawer}>
                  Favorites
                </Link>
              ) : null}
            </nav>
            <div className={css.drawerActions}>
              {loading ? null : user ? (
                <>
                  <div className={css.userInfo}>
                    <span className={css.avatar} aria-hidden='true'>
                      <svg width='16' height='16'>
                        <use href='/sprite.svg#icon-user' />
                      </svg>
                    </span>
                    <p className={css.userName}>{user.name}</p>
                  </div>
                  <button
                    className={css.secondaryButton}
                    type='button'
                    disabled={isLoggingOut}
                    onClick={async () => {
                      await handleSignOut();
                      closeDrawer();
                    }}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Log out'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={css.secondaryButton}
                    type='button'
                    onClick={() => {
                      openAuthModal('login');
                      closeDrawer();
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className={css.primaryButton}
                    type='button'
                    onClick={() => {
                      openAuthModal('register');
                      closeDrawer();
                    }}
                  >
                    Registration
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
