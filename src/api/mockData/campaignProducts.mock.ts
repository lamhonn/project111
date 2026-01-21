import type { CampaignProduct } from '../types';

// Extended CampaignProduct type with additional display fields
export interface CampaignProductWithDetails extends CampaignProduct {
  OriginalPrice?: number;
  ImgUrl?: string;
  Category: number; // -1 for campaigns category
  Toppings?: string; // JSON string array of topping objects
  Ingredients?: string; // JSON string with multilingual object
  Excludables?: string; // JSON string array of multilingual excludable ingredient objects
}

// Mock campaign product data
export const MOCK_CAMPAIGN_PRODUCTS: CampaignProductWithDetails[] = [
  {
    Id: 'c1',
    CampaignId: 'camp1',
    ProductId: '1',
    Name: '{"en":"Margherita Pizza - Special Offer","fi":"Margherita Pizza - Erikoistarjous","sv":"Margherita Pizza - Specialerbjudande"}',
    Description: '{"en":"Classic pizza with tomato sauce, mozzarella, and fresh basil - 25% off!","fi":"Klassinen pizza tomaattikastikkeella, mozzarellalla ja tuoreella basilikalla - 25% alennus!","sv":"Klassisk pizza med tomatsås, mozzarella och färsk basilika - 25% rabatt!"}',
    CampaignPrice: 9.99,
    OriginalPrice: 12.99,
    DiscountRate: 0.25,
    ImgUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    Ingredients: '{"en":"flour, tomato sauce, mozzarella cheese, fresh basil, olive oil, salt","fi":"jauho, tomaattikastike, mozzarellajuusto, tuore basilika, oliiviöljy, suola","sv":"mjöl, tomatsås, mozzarellaost, färsk basilika, olivolja, salt"}',
    LimitedDuration: true,
    StartDate: new Date('2026-01-01'),
    EndDate: new Date('2026-01-31'),
    Enabled: true,
    Created: new Date(),
    Category: -1,
    Toppings: '[{"Name":"Extra Cheese","PriceIncrement":1.50},{"Name":"Mushrooms","PriceIncrement":1.00},{"Name":"Olives","PriceIncrement":0.75}]',
  },
  {
    Id: 'c2',
    CampaignId: 'camp1',
    ProductId: '7',
    Name: '{"en":"Classic Burger - Happy Hour","fi":"Klassikkoburger - Happy Hour","sv":"Klassisk burgare - Happy Hour"}',
    Description: '{"en":"Beef patty with lettuce, tomato, onion, and pickles - Limited time offer!","fi":"Naudanliha pihvi salaatilla, tomaatilla, sipulilla ja suolakurkulla - Rajoitettu aika!","sv":"Nötköttsburgare med sallad, tomat, lök och pickles - Begränsad tid!"}',
    CampaignPrice: 7.49,
    OriginalPrice: 9.99,
    DiscountRate: 0.25,
    ImgUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    Ingredients: '{"en":"wheat flour, beef, lettuce, tomato, onion, pickles, sesame seeds, salt, pepper","fi":"vehnäjauho, naudanliha, salaatti, tomaatti, sipuli, suolakurkku, seesaminsiemenet, suola, pippuri","sv":"vetemjöl, nötkött, sallad, tomat, lök, pickles, sesamfrön, salt, peppar"}',
    LimitedDuration: true,
    StartDate: new Date('2026-01-01'),
    EndDate: new Date('2026-01-31'),
    Enabled: true,
    Created: new Date(),
    Category: -1,
    Toppings: '[{"Name":"Bacon","PriceIncrement":1.50},{"Name":"Extra Cheese","PriceIncrement":1.00},{"Name":"Fried Egg","PriceIncrement":1.25},{"Name":"Avocado","PriceIncrement":2.00}]',
    Excludables: '[{"en":"Lettuce","fi":"Salaatti","sv":"Sallad"},{"en":"Tomato","fi":"Tomaatti","sv":"Tomat"},{"en":"Onion","fi":"Sipuli","sv":"Lök"},{"en":"Pickles","fi":"Suolakurkku","sv":"Pickles"}]',
  },
];
