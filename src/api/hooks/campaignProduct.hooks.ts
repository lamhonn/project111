import { useQuery } from '@apollo/client/react';
import { GET_ACTIVE_CAMPAIGN_PRODUCTS, GET_CAMPAIGN_PRODUCT_BY_ID } from '../queries/campaignProduct.queries';
import type { CampaignProduct } from '../types';
import { MOCK_CAMPAIGN_PRODUCTS, type CampaignProductWithDetails } from '../mockData/campaignProducts.mock';

interface GetActiveCampaignProductsData {
  activeCampaignProducts: CampaignProductWithDetails[];
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
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useGetActiveCampaignProducts = (menuId: string) => {
  // Temporarily return mock data instead of making GraphQL query
  return {
    data: { activeCampaignProducts: MOCK_CAMPAIGN_PRODUCTS },
    loading: false,
    error: undefined,
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<GetActiveCampaignProductsData, GetActiveCampaignProductsVars>(
  //   GET_ACTIVE_CAMPAIGN_PRODUCTS,
  //   {
  //     variables: { menuId },
  //     skip: !menuId,
  //   }
  // );
};

/**
 * Hook to fetch a specific campaign product by ID
 * Used for: Campaign product detail view
 * 
 * TODO: Currently returns mock data. When ready to connect to real API,
 * uncomment the useQuery call and remove the mock data return.
 */
export const useGetCampaignProductById = (id: string) => {
  const campaignProduct = MOCK_CAMPAIGN_PRODUCTS.find(cp => cp.Id === id);
  
  return {
    data: campaignProduct ? { campaignProduct } : undefined,
    loading: false,
    error: campaignProduct ? undefined : new Error('Campaign product not found'),
  } as const;

  // When ready for real API, replace above with:
  // return useQuery<GetCampaignProductByIdData, GetCampaignProductByIdVars>(
  //   GET_CAMPAIGN_PRODUCT_BY_ID,
  //   {
  //     variables: { id },
  //     skip: !id,
  //   }
  // );
};
