import React from 'react';
import { useAtomValue } from 'jotai';
import { isAuthorizedAtom } from '../../state/authStore';
import UnauthorizedView from '../../views/auth/UnauthorizedView';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component
 *
 * Renders children only when a tablet JWT is present in localStorage.
 * isAuthorizedAtom is derived from tabletTokenAtom in authStore.
 * When WF-02 (verifyTabletPin) is implemented and stores a token,
 * this guard will automatically pass.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const isAuthorized = useAtomValue(isAuthorizedAtom);

  // Show unauthorized view if not authorized
  if (!isAuthorized) {
    return <UnauthorizedView />;
  }

  // User is authorized - render the app
  return <>{children}</>;
};

export default AuthGuard;
