import { useQuery } from '@apollo/client/react';
import { GET_ORGANIZATION } from '../queries/organization.queries';
import type { Organization } from '../types';

interface GetOrganizationData {
  organization: Organization;
}

interface GetOrganizationVars {
  id: string;
}

/**
 * Hook to fetch organization details
 * Used for: Displaying restaurant name, address in header
 */
export const useGetOrganization = (id: string) => {
  return useQuery<GetOrganizationData, GetOrganizationVars>(GET_ORGANIZATION, {
    variables: { id },
    skip: !id,
  });
};
