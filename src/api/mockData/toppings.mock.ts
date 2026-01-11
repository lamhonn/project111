import type { Topping } from '../types';

// Mock topping data organized by product
export const MOCK_TOPPINGS: Record<string, Topping[]> = {
  // Pizzas
  '1': [ // Margherita
    { Id: 't1', ProductId: '1', Name: 'Extra Cheese', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't2', ProductId: '1', Name: 'Mushrooms', PriceIncrement: 1.5, Created: new Date() },
    { Id: 't3', ProductId: '1', Name: 'Olives', PriceIncrement: 1.0, Created: new Date() },
    { Id: 't4', ProductId: '1', Name: 'Pepperoni', PriceIncrement: 2.5, Created: new Date() },
  ],
  '2': [ // Pepperoni Pizza
    { Id: 't1', ProductId: '2', Name: 'Extra Cheese', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't2', ProductId: '2', Name: 'Mushrooms', PriceIncrement: 1.5, Created: new Date() },
    { Id: 't5', ProductId: '2', Name: 'Green Peppers', PriceIncrement: 1.0, Created: new Date() },
  ],
  '3': [ // Hawaiian Pizza
    { Id: 't1', ProductId: '3', Name: 'Extra Cheese', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't6', ProductId: '3', Name: 'Extra Ham', PriceIncrement: 2.5, Created: new Date() },
    { Id: 't7', ProductId: '3', Name: 'Extra Pineapple', PriceIncrement: 1.5, Created: new Date() },
  ],
  '4': [ // Veggie Supreme
    { Id: 't2', ProductId: '4', Name: 'Mushrooms', PriceIncrement: 1.5, Created: new Date() },
    { Id: 't5', ProductId: '4', Name: 'Green Peppers', PriceIncrement: 1.0, Created: new Date() },
    { Id: 't3', ProductId: '4', Name: 'Olives', PriceIncrement: 1.0, Created: new Date() },
    { Id: 't8', ProductId: '4', Name: 'Tomatoes', PriceIncrement: 1.0, Created: new Date() },
  ],
  '5': [ // BBQ Chicken
    { Id: 't1', ProductId: '5', Name: 'Extra Cheese', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't9', ProductId: '5', Name: 'Extra Chicken', PriceIncrement: 3.0, Created: new Date() },
    { Id: 't10', ProductId: '5', Name: 'Bacon', PriceIncrement: 2.5, Created: new Date() },
  ],
  '6': [ // Meat Lovers
    { Id: 't4', ProductId: '6', Name: 'Pepperoni', PriceIncrement: 2.5, Created: new Date() },
    { Id: 't10', ProductId: '6', Name: 'Bacon', PriceIncrement: 2.5, Created: new Date() },
    { Id: 't6', ProductId: '6', Name: 'Extra Ham', PriceIncrement: 2.5, Created: new Date() },
  ],
  // Burgers
  '7': [ // Classic Burger
    { Id: 't11', ProductId: '7', Name: 'Bacon', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't12', ProductId: '7', Name: 'Extra Patty', PriceIncrement: 3.5, Created: new Date() },
    { Id: 't1', ProductId: '7', Name: 'Cheese', PriceIncrement: 1.5, Created: new Date() },
  ],
  '8': [ // Cheese Burger
    { Id: 't11', ProductId: '8', Name: 'Bacon', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't12', ProductId: '8', Name: 'Extra Patty', PriceIncrement: 3.5, Created: new Date() },
  ],
  '9': [ // Bacon Burger
    { Id: 't11', ProductId: '9', Name: 'Extra Bacon', PriceIncrement: 2.5, Created: new Date() },
    { Id: 't12', ProductId: '9', Name: 'Extra Patty', PriceIncrement: 3.5, Created: new Date() },
    { Id: 't1', ProductId: '9', Name: 'Cheese', PriceIncrement: 1.5, Created: new Date() },
  ],
  // Sides and Drinks have no toppings
  '10': [],
  '11': [],
  '12': [],
  '13': [],
  '14': [],
  '15': [],
};

// Campaign product toppings
export const MOCK_CAMPAIGN_TOPPINGS: Record<string, Topping[]> = {
  'c1': [ // Margherita campaign
    { Id: 't1', ProductId: '1', Name: 'Extra Cheese', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't2', ProductId: '1', Name: 'Mushrooms', PriceIncrement: 1.5, Created: new Date() },
    { Id: 't3', ProductId: '1', Name: 'Olives', PriceIncrement: 1.0, Created: new Date() },
    { Id: 't4', ProductId: '1', Name: 'Pepperoni', PriceIncrement: 2.5, Created: new Date() },
  ],
  'c2': [ // Classic burger campaign
    { Id: 't11', ProductId: '7', Name: 'Bacon', PriceIncrement: 2.0, Created: new Date() },
    { Id: 't12', ProductId: '7', Name: 'Extra Patty', PriceIncrement: 3.5, Created: new Date() },
    { Id: 't1', ProductId: '7', Name: 'Cheese', PriceIncrement: 1.5, Created: new Date() },
  ],
};
