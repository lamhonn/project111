import { useAtom } from 'jotai';
import { tokensAtom, isAuthorizedAtom } from '../authStore'; 

/**
 * TODO: Add JWT token handling when implementing actual authentication
 */
export const useAuthContext = () => {
  const [tokens, setTokens] = useAtom(tokensAtom);
  const isAuthorized = !!tokens.accessToken;

  const login = (newTokens: { accessToken: string; refreshToken: string }) => {
    setTokens(newTokens);
  };

  const logout = () => {
    setTokens({ accessToken: null, refreshToken: null });
  };

  return {
    isAuthorized,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    login,
    logout,
  };
};