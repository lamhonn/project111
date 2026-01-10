import { useQuery } from '@apollo/client/react';
import { GET_TABLE_BY_NUMBER, GET_TABLE_BY_ID } from '../queries/table.queries';
import type { Table } from '../types';

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
