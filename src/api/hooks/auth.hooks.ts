// [NOT IMPLEMENTED] Tablet PIN pairing — WF-02
//
// useTabletAuth is the integration point for verifyTabletPin.
// When implemented:
//   1. Call the verifyTabletPin GraphQL mutation with the entered PIN.
//   2. On success, store the returned JWT via tabletTokenAtom.
//   3. isAuthorizedAtom (derived from tabletTokenAtom) will become true,
//      and AuthGuard will render the app.

export const useTabletAuth = () => {
  const submitPin = (pin: string): { success: false; error: string } => {
    console.warn('[NOT IMPLEMENTED] verifyTabletPin — pin submitted, no backend call made');
    // Suppress unused variable warning while keeping the param name readable.
    void pin;
    return { success: false, error: 'Tablet pairing is not yet implemented.' };
  };

  return { submitPin };
};
