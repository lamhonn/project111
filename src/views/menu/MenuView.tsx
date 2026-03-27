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
import LockedDialog from '../../components/order/LockedDialog';
import {
  orderStatusAtom,
  billRequestedAtom,
  resetAppStateAtom,
  tableLockedAtom,
  orderNumberAtom,
  tableNumberAtom,
} from '../../context/orderStore';
import { useGetProducts } from '../../api/hooks/product.hooks';
import { useOrderStatusChanged, useNewOrderNotification } from '../../api/hooks/order.hooks';
import { useTableLockedStatus } from '../../api/hooks/table.hooks';
import { getLocalizedCategoryName } from '../../api/utils/multilingualName.utils';
import { theme } from '../../theme';
import { OrderStatus } from '../../components/header/MenuHeader';

const BASE_CATEGORIES = [
  '{"en":"Pizzas","fi":"Pizzat","sv":"Pizzor"}',
  '{"en":"Burgers","fi":"Hampurilaiset","sv":"Hamburgare"}',
  '{"en":"Sides","fi":"Lisukkeet","sv":"Tillbeh\u00f6r"}',
  '{"en":"Drinks","fi":"Juomat","sv":"Drycker"}',
];

type RealtimeOrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

const mapRealtimeStatusToUiStatus = (status: RealtimeOrderStatus): OrderStatus => {
  switch (status) {
    case 'Pending':
      return OrderStatus.Pending;
    case 'Preparing':
      return OrderStatus.Preparing;
    case 'Ready':
      return OrderStatus.Ready;
    case 'Completed':
      return OrderStatus.Completed;
    case 'Cancelled':
      return OrderStatus.Cancelled;
    default:
      return OrderStatus.Pending;
  }
};

const MenuView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const organizationId = import.meta.env.VITE_ORGANIZATION_ID ?? '';
  const tabletId = import.meta.env.VITE_TABLET_ID ?? import.meta.env.VITE_TABLE_ID ?? '';
  
  // Fetch data from API hooks
  const { data: productsData, loading: productsLoading } = useGetProducts(organizationId);
  const { data: orderStatusData } = useOrderStatusChanged(tabletId);
  const { data: newOrderData } = useNewOrderNotification(tabletId);
  
  // Monitor table locked status
  useTableLockedStatus(tabletId);
  
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showCategoryBar, setShowCategoryBar] = useState<boolean>(true);
  const [showTotalDialog, setShowTotalDialog] = useState<boolean>(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  
  const orderStatus = useAtomValue(orderStatusAtom);
  const billRequested = useAtomValue(billRequestedAtom);
  const tableLocked = useAtomValue(tableLockedAtom);
  const resetAppState = useSetAtom(resetAppStateAtom);
  const setOrderStatus = useSetAtom(orderStatusAtom);
  const setOrderNumber = useSetAtom(orderNumberAtom);
  const setTableNumber = useSetAtom(tableNumberAtom);

  // Get products and campaigns from API
  const products = productsData?.products || [];
  
  // Build categories array
  // Localize category names based on current language
  const localizedCategories = BASE_CATEGORIES.map(cat => getLocalizedCategoryName(cat, i18n.language));
  const categories = localizedCategories;

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

  // Keep header/order atoms in sync with websocket status updates.
  useEffect(() => {
    const update = orderStatusData?.orderStatusChanged;
    if (!update) {
      return;
    }

    setOrderStatus(mapRealtimeStatusToUiStatus(update.newStatus));
    setOrderNumber(`#${update.orderId.slice(0, 6).toUpperCase()}`);
    setTableNumber(update.tableNumber);
  }, [orderStatusData, setOrderNumber, setOrderStatus, setTableNumber]);

  // Capture new order metadata for receipt/status UI context.
  useEffect(() => {
    const event = newOrderData?.newOrderNotification;
    if (!event) {
      return;
    }

    setOrderNumber(`#${event.orderId.slice(0, 6).toUpperCase()}`);
    setTableNumber(event.tableNumber);
    setOrderStatus(OrderStatus.Pending);
  }, [newOrderData, setOrderNumber, setOrderStatus, setTableNumber]);

  // Group products by category
  const productsByCategory = categories.map((categoryName, index) => {
    // Category mapping now comes from backend menu/menuProducts; until that wiring is added,
    // render all products under the first category to stay aligned with current Product type.
    return index === 0 ? products : [];
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
        restaurantName="Penan Bistro"
        orderStatus={orderStatus}
        onTotalClick={() => setShowTotalDialog(true)}
      />

      {/* Sticky Category Pills */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 1000,
          backgroundColor: theme.colors.background,
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
              {productsByCategory[categoryIndex].map((product) => {
                // Type guard to differentiate between regular and campaign products
                const isCampaign = 'campaignPrice' in (product as Record<string, unknown>);
                const price = isCampaign 
                  ? (product as any).campaignPrice || 0 
                  : (product as any).price;
                const name = product.name || '';
                const ingredients = product.ingredients || undefined;
                const ageRestricted = (product as any).ageRestricted || false;
                const dietaries = product.dietaries || undefined;
                
                return (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.imgUrl || ''}
                    name={name}
                    price={price}
                    description={product.description}
                    toppings={product.toppings}
                    ingredients={ingredients}
                    excludables={product.excludables}
                    ageRestricted={ageRestricted}
                    dietaries={dietaries}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Container>

      {/* Action Bar */}
      <ActionBar />

      {/* Thank You Dialog - shown when bill is requested */}
      <ThankYouDialog isOpen={billRequested} onReset={handleResetSession} />

      {/* Locked Dialog - shown when table is locked by staff */}
      <LockedDialog isOpen={tableLocked} />

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
