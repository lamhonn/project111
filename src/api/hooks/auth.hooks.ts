import { useSetAtom } from 'jotai';
import { useMutation } from '@apollo/client/react';
import { authorizePinAtom, authorizeWithTokenAtom } from '../../context/authStore';
import { VERIFY_TABLET_PIN } from '../mutations/auth.mutations';
import type { Tablet } from '../types';

interface VerifyTabletPinData {
  verifyTabletPin: {
    code: string;
    success: boolean;
    message: string;
    token: string | null;
    tablet: Tablet | null;
  };
}

interface VerifyTabletPinVars {
  input: {
    tabletId: string;
    pin: string;
  };
}

/**
 * Authorization hook - does NOT require authorization to use
 * 
 * This hook is special - it can be called even when not authorized.
 * Use this to submit PIN codes to gain authorization.
 * 
 * @returns Object with authorizeWithPin function
 * 
 * @example
 * const { authorizeWithPin } = useAuthorization();
 * 
 * const handleSubmit = async (pin: string) => {
 *   const result = authorizeWithPin(pin);
 *   if (result.success) {
 *     // Authorization granted
 *   }
 * };
 */
export const useAuthorization = () => {
  const authorizePin = useSetAtom(authorizePinAtom);
  const authorizeWithToken = useSetAtom(authorizeWithTokenAtom);

  const authorizeWithPin = (pin: string) => {
    return authorizePin(pin);
  };

  const authorizeToken = (token: string) => {
    return authorizeWithToken(token);
  };

  return {
    authorizeWithPin,
    authorizeToken,
  };
};

export const useVerifyTabletPin = () => {
  return useMutation<VerifyTabletPinData, VerifyTabletPinVars>(VERIFY_TABLET_PIN);
};
