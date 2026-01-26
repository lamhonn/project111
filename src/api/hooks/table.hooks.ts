import { useQuery } from '@apollo/client/react';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { GET_TABLE_BY_NUMBER, GET_TABLE_BY_ID } from '../queries/table.queries';
import type { Table } from '../types';
import { tableLockedAtom } from '../../context/orderStore';

interface GetTableByNumberData {
  tableByNumber: Table;
}

interface GetTableByNumberVars {
  organizationId: string;
  tableNumber: number;
}

interface GetTableByIdData {
  table: Table;
}

interface GetTableByIdVars {
  id: string;
}

/**
 * Hook to fetch table by number
 * Used for: Initial app load, identifying customer's table from QR code
 */
export const useGetTableByNumber = (organizationId: string, tableNumber: number) => {
  return useQuery<GetTableByNumberData, GetTableByNumberVars>(GET_TABLE_BY_NUMBER, {
    variables: { organizationId, tableNumber },
    skip: !organizationId || tableNumber === undefined,
  });
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

/**
 * Hook to poll table locked status
 * Used for: Monitoring if staff has locked the table from another device
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useTableLockedStatus = (tableId: string) => {
  const setTableLocked = useSetAtom(tableLockedAtom);

  // TODO: Replace with actual GraphQL query when API is ready
  // For now, return mock data - table is never locked
  useEffect(() => {
    setTableLocked(false);
  }, [setTableLocked]);

  return {
    data: { locked: false },
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // const result = useQuery<{ table: { Locked: boolean } }, { id: string }>(
  //   GET_TABLE_LOCKED_STATUS,
  //   {
  //     variables: { id: tableId },
  //     skip: !tableId,
  //     pollInterval: 5000, // Poll every 5 seconds to check locked status
  //   }
  // );
  //
  // useEffect(() => {
  //   if (result.data?.table?.Locked !== undefined) {
  //     setTableLocked(result.data.table.Locked);
  //   }
  // }, [result.data, setTableLocked]);
  //
  // return result;
};
