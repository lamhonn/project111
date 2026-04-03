import { useQuery } from '@apollo/client/react';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { GET_TABLE_BY_NUMBER, GET_TABLE_BY_ID, GET_TABLE_LOCKED_STATUS } from '../queries/table.queries';
import type { Tablet } from '../types';
import { tableLockedAtom } from '../../context/orderStore';

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
  const result = useQuery<{ tablet: Pick<Tablet, 'userId'> }, { id: string }>(
    GET_TABLE_LOCKED_STATUS,
    {
      variables: { id: tableId },
      skip: !tableId,
      pollInterval: 5000,
    }
  );

  useEffect(() => {
    if (result.data?.tablet) {
      // Current model has no explicit Locked flag; assigned tablet implies occupied/locked.
      setTableLocked(Boolean(result.data.tablet.userId));
    }
  }, [result.data, setTableLocked]);

  return result;
};
