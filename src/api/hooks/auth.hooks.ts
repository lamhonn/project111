import { useSetAtom } from 'jotai';
import { authorizePinAtom } from '../../context/authStore';

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

  const authorizeWithPin = (pin: string) => {
    return authorizePin(pin);
  };

  return {
    authorizeWithPin,
  };
};
