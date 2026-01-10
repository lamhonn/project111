import { useQuery } from '@apollo/client/react';
import { GET_ACTIVE_CAMPAIGN_PRODUCTS, GET_CAMPAIGN_PRODUCT_BY_ID } from '../queries/campaignProduct.queries';
import type { CampaignProduct } from '../types';

interface GetActiveCampaignProductsData {
  activeCampaignProducts: CampaignProduct[];
}

interface GetActiveCampaignProductsVars {
  menuId: string;
}

interface GetCampaignProductByIdData {
  campaignProduct: CampaignProduct;
}

interface GetCampaignProductByIdVars {
  id: string;
}

/**
 * Hook to fetch active campaign products for display in Campaigns category
 * Used for: Showing special offers/discounts at the top of the menu
 */
export const useGetActiveCampaignProducts = (menuId: string) => {
  return useQuery<GetActiveCampaignProductsData, GetActiveCampaignProductsVars>(
    GET_ACTIVE_CAMPAIGN_PRODUCTS,
    {
      variables: { menuId },
      skip: !menuId,
    }
  );
};

/**
 * Hook to fetch a specific campaign product by ID
 * Used for: Campaign product detail view
 */
export const useGetCampaignProductById = (id: string) => {
  return useQuery<GetCampaignProductByIdData, GetCampaignProductByIdVars>(
    GET_CAMPAIGN_PRODUCT_BY_ID,
    {
      variables: { id },
      skip: !id,
    }
  );
};
