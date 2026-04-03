import { isTabletStatusNonFatalAuthError } from './utils/authErrorPolicy';

describe('isTabletStatusNonFatalAuthError', () => {
  it('returns true for GetTabletStatus FORBIDDEN', () => {
    expect(isTabletStatusNonFatalAuthError('GetTabletStatus', 'FORBIDDEN')).toBe(true);
  });

  it('returns false for GetTabletStatus UNAUTHENTICATED', () => {
    expect(isTabletStatusNonFatalAuthError('GetTabletStatus', 'UNAUTHENTICATED')).toBe(false);
  });

  it('returns false for other operations', () => {
    expect(isTabletStatusNonFatalAuthError('Login', 'FORBIDDEN')).toBe(false);
  });
});
