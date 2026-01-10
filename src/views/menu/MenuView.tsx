import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/menu/ProductCard';
import ActionBar from '../../components/actionbar/ActionBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CategoryPill from '../../components/category/CategoryPill';
import MenuHeader from '../../components/header/MenuHeader';
import TotalOrderSummaryDialog from '../../components/order/TotalOrderSummaryDialog';
import ThankYouDialog from '../../components/order/ThankYouDialog';
import { orderStatusAtom, billRequestedAtom, resetAppStateAtom } from '../../context/orderStore';

// Categories (base categories, Campaigns is added conditionally)
const baseCategories = ['Pizzas', 'Burgers', 'Sides', 'Drinks'];

// Sample campaign product data
const sampleCampaignProducts = [
  {
    id: 'c1',
    campaignId: 'camp1',
    productId: '1',
    category: -1, // Special category index for campaigns
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    name: 'Margherita Pizza - Special Offer',
    price: 9.99,
    originalPrice: 12.99,
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil - 25% off!',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't3', name: 'Olives', price: 1.0 },
      { id: 't4', name: 'Pepperoni', price: 2.5 },
    ],
  },
  {
    id: 'c2',
    campaignId: 'camp1',
    productId: '7',
    category: -1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    name: 'Classic Burger - Happy Hour',
    price: 7.49,
    originalPrice: 9.99,
    description: 'Beef patty with lettuce, tomato, onion, and pickles - Limited time offer!',
    toppings: [
      { id: 't11', name: 'Bacon', price: 2.0 },
      { id: 't12', name: 'Extra Patty', price: 3.5 },
      { id: 't1', name: 'Cheese', price: 1.5 },
    ],
  },
];

// Sample product data
const sampleProducts = [
  // Pizzas
  {
    id: '1',
    category: 0,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    name: 'Margherita Pizza',
    price: 12.99,
    description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't3', name: 'Olives', price: 1.0 },
      { id: 't4', name: 'Pepperoni', price: 2.5 },
    ],
  },
  {
    id: '2',
    category: 0,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
    name: 'Pepperoni Pizza',
    price: 14.99,
    description: 'Pizza topped with spicy pepperoni and mozzarella cheese',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't5', name: 'Green Peppers', price: 1.0 },
    ],
  },
  {
    id: '3',
    category: 0,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    name: 'Hawaiian Pizza',
    price: 13.99,
    description: 'Pizza with ham, pineapple, and mozzarella',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't6', name: 'Extra Ham', price: 2.5 },
      { id: 't7', name: 'Extra Pineapple', price: 1.5 },
    ],
  },
  {
    id: '4',
    category: 0,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    name: 'Veggie Supreme',
    price: 13.49,
    description: 'Loaded with fresh vegetables and mozzarella',
    toppings: [
      { id: 't2', name: 'Mushrooms', price: 1.5 },
      { id: 't5', name: 'Green Peppers', price: 1.0 },
      { id: 't3', name: 'Olives', price: 1.0 },
      { id: 't8', name: 'Tomatoes', price: 1.0 },
    ],
  },
  {
    id: '5',
    category: 0,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=400',
    name: 'BBQ Chicken',
    price: 15.99,
    description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
    toppings: [
      { id: 't1', name: 'Extra Cheese', price: 2.0 },
      { id: 't9', name: 'Extra Chicken', price: 3.0 },
      { id: 't10', name: 'Bacon', price: 2.5 },
    ],
  },
  {
    id: '6',
    category: 0,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400',
    name: 'Meat Lovers',
    price: 16.99,
    description: 'Loaded with pepperoni, sausage, ham, and bacon',
    toppings: [
      { id: 't4', name: 'Pepperoni', price: 2.5 },
      { id: 't10', name: 'Bacon', price: 2.5 },
      { id: 't6', name: 'Extra Ham', price: 2.5 },
    ],
  },
  // Burgers
  {
    id: '7',
    category: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    name: 'Classic Burger',
    price: 9.99,
    description: 'Beef patty with lettuce, tomato, onion, and pickles',
    toppings: [
      { id: 't11', name: 'Bacon', price: 2.0 },
      { id: 't12', name: 'Extra Patty', price: 3.5 },
      { id: 't1', name: 'Cheese', price: 1.5 },
    ],
  },
  {
    id: '8',
    category: 1,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    name: 'Cheese Burger',
    price: 10.99,
    description: 'Double beef patty with melted cheese',
    toppings: [
      { id: 't11', name: 'Bacon', price: 2.0 },
      { id: 't12', name: 'Extra Patty', price: 3.5 },
    ],
  },
  {
    id: '9',
    category: 1,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400',
    name: 'Bacon Burger',
    price: 11.99,
    description: 'Burger with crispy bacon and BBQ sauce',
    toppings: [
      { id: 't11', name: 'Extra Bacon', price: 2.5 },
      { id: 't12', name: 'Extra Patty', price: 3.5 },
      { id: 't1', name: 'Cheese', price: 1.5 },
    ],
  },
  // Sides
  {
    id: '10',
    category: 2,
    image: 'https://images.unsplash.com/photo-1630384082554-e4e5c0e7b869?w=400',
    name: 'French Fries',
    price: 4.99,
    description: 'Crispy golden french fries',
    toppings: [],
  },
  {
    id: '11',
    category: 2,
    image: 'https://images.unsplash.com/photo-1619221882783-4f9a5e2e3ee9?w=400',
    name: 'Onion Rings',
    price: 5.49,
    description: 'Crispy breaded onion rings',
    toppings: [],
  },
  {
    id: '12',
    category: 2,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    name: 'Mozzarella Sticks',
    price: 6.99,
    description: 'Breaded mozzarella sticks with marinara sauce',
    toppings: [],
  },
  // Drinks
  {
    id: '13',
    category: 3,
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
    name: 'Coca-Cola',
    price: 2.99,
    description: 'Classic Coca-Cola',
    toppings: [],
  },
  {
    id: '14',
    category: 3,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
    name: 'Sprite',
    price: 2.99,
    description: 'Refreshing lemon-lime soda',
    toppings: [],
  },
  {
    id: '15',
    category: 3,
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=400',
    name: 'Orange Juice',
    price: 3.49,
    description: 'Fresh squeezed orange juice',
    toppings: [],
  },
];

const MenuView: React.FC = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showCategoryBar, setShowCategoryBar] = useState<boolean>(true);
  const [showTotalDialog, setShowTotalDialog] = useState<boolean>(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  
  const orderStatus = useAtomValue(orderStatusAtom);
  const billRequested = useAtomValue(billRequestedAtom);
  const resetAppState = useSetAtom(resetAppStateAtom);

  // Check if campaigns exist
  const hasCampaigns = sampleCampaignProducts.length > 0;
  
  // Build categories array with Campaigns at top if they exist
  const categories = hasCampaigns ? [t('common.campaigns'), ...baseCategories] : baseCategories;

  const handleResetSession = () => {
    resetAppState();
  };

  // Prevent scrolling when bill is requested
  useEffect(() => {
    if (billRequested) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    };
  }, [billRequested]);

  // Group products by category
  const productsByCategory = categories.map((categoryName, index) => {
    if (hasCampaigns && index === 0) {
      // First category is Campaigns if they exist
      return sampleCampaignProducts;
    }
    // Adjust category index for regular products based on whether campaigns exist
    const productCategoryIndex = hasCampaigns ? index - 1 : index;
    return sampleProducts.filter(product => product.category === productCategoryIndex);
  });

  // Scroll to category
  const handleCategoryClick = (index: number): void => {
    const element = categoryRefs.current[index];
    if (element) {
      const headerOffset = 156; // Height of header (64px) + category pills bar (92px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Track active category on scroll
  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      const scrollPosition = currentScrollY + 250; // Offset for sticky header + category bar
      const windowHeight = window.innerHeight;

      // Show/hide category bar based on scroll direction
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down
        setShowCategoryBar(false);
      } else {
        // Scrolling up
        setShowCategoryBar(true);
      }
      lastScrollY.current = currentScrollY;

      // TODO: doesn't work properly with last category
      // Check if user has scrolled to bottom
      if ((windowHeight + scrollPosition) > document.body.offsetHeight) {
        setActiveCategory(categories.length - 1);
        return;
      }

      for (let i = categoryRefs.current.length - 1; i >= 0; i--) {
        const ref = categoryRefs.current[i];
        if (ref && ref.offsetTop <= scrollPosition) {
          setActiveCategory(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box sx={{ pb: 10 }}>
      {/* Fixed Menu Header */}
      <MenuHeader
        restaurantName="Penan pizza"
        tableNumber={5}
        orderStatus={orderStatus}
        onTotalClick={() => setShowTotalDialog(true)}
      />

      {/* Sticky Category Pills */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 1000,
          backgroundColor: 'grey.50',
          py: 1.5,
          transform: showCategoryBar ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.1s ease-in-out',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 6,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.300',
                borderRadius: 3,
              },
            }}
          >
            {categories.map((category, index) => (
              <CategoryPill
                key={index}
                index={index}
                name={category}
                isActive={activeCategory === index}
                onClick={handleCategoryClick}
              />
            ))}
          </Box>
        </Container>
      </Box>

      {/* Product Categories */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        {categories.map((category, categoryIndex) => (
          <Box
            key={categoryIndex}
            ref={(el) => {
              if (el) {
                categoryRefs.current[categoryIndex] = el as HTMLDivElement;
              }
            }}
            sx={{ mb: 6 }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              {category}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {productsByCategory[categoryIndex].map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  toppings={product.toppings}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Container>

      {/* Action Bar */}
      <ActionBar />

      {/* Thank You Dialog - shown when bill is requested */}
      <ThankYouDialog isOpen={billRequested} onReset={handleResetSession} />

      {/* Total Order Summary Dialog */}
      <TotalOrderSummaryDialog
        isOpen={showTotalDialog}
        onClose={() => setShowTotalDialog(false)}
      />

      {/* Global Confirm Dialog */}
      <ConfirmDialog />
    </Box>
  );
};

export default MenuView;
