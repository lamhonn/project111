import { useQuery } from '@apollo/client/react';
import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { GET_TABLE_BY_NUMBER, GET_TABLE_BY_ID, GET_TABLE_LOCKED_STATUS } from '../queries/table.queries';
import type { Tablet } from '../types';
import { tableLockedAtom } from '../../context/orderStore';
import { isNonRecoverableTabletStatusError } from '../utils/authErrorPolicy';

interface GetTableByNumberData {
  tablets: Tablet[];
}

interface GetTableByNumberVars {
  organizationId: string;
  tableNumber: number;
}

interface GetTableByIdData {
  tablet: Tablet;
}

interface GetTableByIdVars {
  id: string;
}

/**
 * Hook to fetch table by number
 * Used for: Initial app load, identifying customer's table from QR code
 */
export const useGetTableByNumber = (organizationId: string, tableNumber: number) => {
  const result = useQuery<GetTableByNumberData, GetTableByNumberVars>(GET_TABLE_BY_NUMBER, {
    variables: { organizationId, tableNumber },
    skip: !organizationId || tableNumber === undefined,
  });

  const tabletByNumber = result.data?.tablets.find((tablet) => tablet.tableNumber === tableNumber) ?? null;

  return {
    ...result,
    data: result.data ? { tabletByNumber } : undefined,
  };
};

/**
 * Hook to fetch table by ID
 * Used for: Getting table details when ID is known
 */
export const useGetTableById = (id: string) => {
  return useQuery<GetTableByIdData, GetTableByIdVars>(GET_TABLE_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

// TODO: use websockets instead of polling
/**
 * Hook to poll table locked status
 * Used for: Monitoring if tablet is occupied/assigned from another device
 */
export const useTableLockedStatus = (tableId: string) => {
  const setTableLocked = useSetAtom(tableLockedAtom);
  const [isPollingPaused, setIsPollingPaused] = useState(false);
  const result = useQuery<{ tablet: Pick<Tablet, 'userId'> }, { id: string }>(
    GET_TABLE_LOCKED_STATUS,
    {
      variables: { id: tableId },
      skip: !tableId || isPollingPaused,
      pollInterval: 5000,
    }
  );

  useEffect(() => {
    setIsPollingPaused(false);
  }, [tableId]);

  useEffect(() => {
    if (result.data?.tablet) {
      // Current model has no explicit Locked flag; assigned tablet implies occupied/locked.
      // TODO: we need a proper Locked status
      setTableLocked(!Boolean(result.data.tablet.userId));
    }
  }, [result.data, setTableLocked]);

  useEffect(() => {
    if (!isPollingPaused && result.error && isNonRecoverableTabletStatusError(result.error)) {
      console.warn('[Tablet status polling] Pausing polling after non-recoverable auth error.');
      setIsPollingPaused(true);
    }
  }, [result.error, isPollingPaused]);

  return result;
};
