import { useAtomValue } from 'jotai';
import { isAuthorizedAtom } from '../../context/authStore';

/**
 * Hook to get authorization status for API calls
 * 
 * Returns the authorization status.
 * All API hooks should use this to check if user is authorized before making calls.
 * 
 * @returns Object with isAuthorized flag
 * 
 * @example
 * const { isAuthorized } = useAuthContext();
 * 
 * if (!isAuthorized) {
 *   return { data: null, loading: false, error: new Error('Not authorized') };
 * }
 * 
 * TODO: Add JWT token handling when implementing actual authentication
 */
export const useAuthContext = () => {
  const isAuthorized = useAtomValue(isAuthorizedAtom);

  return {
    isAuthorized,
  };
};

