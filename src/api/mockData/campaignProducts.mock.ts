import type { CampaignProduct } from '../types';

// Extended CampaignProduct type with additional display fields
export interface CampaignProductWithDetails extends CampaignProduct {
  OriginalPrice?: number;
  ImgUrl?: string;
  Category: number; // -1 for campaigns category
}

// Mock campaign product data
export const MOCK_CAMPAIGN_PRODUCTS: CampaignProductWithDetails[] = [
  {
    Id: 'c1',
    CampaignId: 'camp1',
    ProductId: '1',
    Name: 'Margherita Pizza - Special Offer',
    Description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil - 25% off!',
    CampaignPrice: 9.99,
    OriginalPrice: 12.99,
    DiscountRate: 0.25,
    ImgUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    LimitedDuration: true,
    StartDate: new Date('2026-01-01'),
    EndDate: new Date('2026-01-31'),
    Enabled: true,
    Created: new Date(),
    Category: -1,
  },
  {
    Id: 'c2',
    CampaignId: 'camp1',
    ProductId: '7',
    Name: 'Classic Burger - Happy Hour',
    Description: 'Beef patty with lettuce, tomato, onion, and pickles - Limited time offer!',
    CampaignPrice: 7.49,
    OriginalPrice: 9.99,
    DiscountRate: 0.25,
    ImgUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    LimitedDuration: true,
    StartDate: new Date('2026-01-01'),
    EndDate: new Date('2026-01-31'),
    Enabled: true,
    Created: new Date(),
    Category: -1,
  },
];
