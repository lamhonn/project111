import { renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@apollo/client/react';
import { useSetAtom } from 'jotai';
import { useTableLockedStatus } from './table.hooks';

jest.mock('@apollo/client/react', () => ({
  useQuery: jest.fn(),
}));

jest.mock('jotai', () => ({
  ...jest.requireActual('jotai'),
  useSetAtom: jest.fn(),
}));

describe('useTableLockedStatus', () => {
  const useQueryMock = useQuery as unknown as jest.Mock;
  const useSetAtomMock = useSetAtom as unknown as jest.Mock;
  const setTableLockedMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useSetAtomMock.mockReturnValue(setTableLockedMock);
  });

  it('updates lock state to true when tablet has userId', async () => {
    useQueryMock.mockReturnValue({
      data: { tablet: { userId: 'user-1' } },
      error: undefined,
    });

    renderHook(() => useTableLockedStatus('tablet-1'));

    await waitFor(() => {
      expect(setTableLockedMock).toHaveBeenCalledWith(true);
    });
  });

  it('updates lock state to false when tablet has no userId', async () => {
    useQueryMock.mockReturnValue({
      data: { tablet: { userId: null } },
      error: undefined,
    });

    renderHook(() => useTableLockedStatus('tablet-1'));

    await waitFor(() => {
      expect(setTableLockedMock).toHaveBeenCalledWith(false);
    });
  });

  it('skips polling when table id is empty', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: undefined,
    });

    renderHook(() => useTableLockedStatus(''));

    const options = useQueryMock.mock.calls[0]?.[1];
    expect(options?.skip).toBe(true);
  });

  it('pauses polling after non-recoverable auth error', async () => {
    useQueryMock.mockImplementation((_query, options) => {
      if (options.skip) {
        return { data: undefined, error: undefined };
      }

      return {
        data: undefined,
        error: new Error('FORBIDDEN'),
      };
    });

    renderHook(() => useTableLockedStatus('tablet-1'));

    await waitFor(() => {
      const latestCall = useQueryMock.mock.calls[useQueryMock.mock.calls.length - 1];
      const latestOptions = latestCall?.[1];
      expect(latestOptions?.skip).toBe(true);
    });
  });
});
