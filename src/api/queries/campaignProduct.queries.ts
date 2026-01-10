import { gql } from '@apollo/client';

// Fetch active campaign products for a menu
export const GET_ACTIVE_CAMPAIGN_PRODUCTS = gql`
  query GetActiveCampaignProducts($menuId: ID!) {
    activeCampaignProducts(menuId: $menuId) {
      Id
      CampaignId
      ProductId
      Name
      Description
      CampaignPrice
      DiscountRate
      Enabled
    }
  }
`;

// Fetch campaign product by ID
export const GET_CAMPAIGN_PRODUCT_BY_ID = gql`
  query GetCampaignProductById($id: ID!) {
    campaignProduct(id: $id) {
      Id
      CampaignId
      ProductId
      Name
      Description
      CampaignPrice
      DiscountRate
      LimitedDuration
      StartDate
      EndDate
      Enabled
    }
  }
`;
