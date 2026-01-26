import React from 'react';
import { useAtomValue } from 'jotai';
import { isAuthorizedAtom } from '../../context/authStore';
import UnauthorizedView from '../../views/auth/UnauthorizedView';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component
 * 
 * Controls access to the entire application based on authorization state.
 * - If authorized (true): renders children (the app)
 * - If not authorized (false): renders UnauthorizedView
 * 
 * This prevents any API calls or components from rendering when unauthorized.
 * 
 * TODO: Add actual authentication logic later
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
