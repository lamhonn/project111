import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useAtomValue, useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/menu/ProductCard';
import ActionBar from '../../components/actionbar/ActionBar';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toaster from '../../components/common/Toaster';
import CategoryPill from '../../components/category/CategoryPill';
import MenuHeader from '../../components/header/MenuHeader';
import TotalOrderSummaryDialog from '../../components/order/TotalOrderSummaryDialog';
import ThankYouDialog from '../../components/order/ThankYouDialog';
import LockedDialog from '../../components/order/LockedDialog';
import { orderStatusAtom, billRequestedAtom, resetAppStateAtom, tableLockedAtom } from '../../context/orderStore';
import { toasterAtom, hideToasterAtom } from '../../context/toasterStore';
import { getLocalizedCategoryName } from '../../utils/multilingualNameUtils';
import { theme } from '../../theme';

const MenuView: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Fetch data from API hooks
  const { data: productsData, loading: productsLoading } = useGetProducts('');
  const { data: campaignsData, loading: campaignsLoading } = useGetActiveCampaignProducts('');

  // TODO (WF-03/WF-08): supply real tabletId from tablet JWT
  useTableLockedStatus('');
  
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showCategoryBar, setShowCategoryBar] = useState<boolean>(true);
  const [showTotalDialog, setShowTotalDialog] = useState<boolean>(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef<number>(0);
  
  const orderStatus = useAtomValue(orderStatusAtom);
  const billRequested = useAtomValue(billRequestedAtom);
  const tableLocked = useAtomValue(tableLockedAtom);
  const resetAppState = useSetAtom(resetAppStateAtom);
  const toasterState = useAtomValue(toasterAtom);
  const hideToaster = useSetAtom(hideToasterAtom);

  // Get products and campaigns from API
  const products = productsData?.products || [];
  const campaignProducts = campaignsData?.activeCampaignProducts || [];
  
  // Check if campaigns exist
  const hasCampaigns = campaignProducts.length > 0;
  
  // Build categories array with Campaigns at top if they exist
  // Localize category names based on current language
  const localizedCategories = MOCK_CATEGORIES.map(cat => getLocalizedCategoryName(cat, i18n.language));
  const categories = hasCampaigns ? [t('common.campaigns'), ...localizedCategories] : localizedCategories;

  const handleResetSession = () => {
    resetAppState();
  };

  // Prevent scrolling when bill is requested
  useEffect(() => {
    // [NOT IMPLEMENTED] WF-08: tablet has no subscription to session close events.
    // When staff closes the session via admin, the tablet will not know and will
    // stay on the Active screen. Wire a sessionClosed subscription here once
    // GraphQLWsLink (WF-06) and tablet auth (WF-02) are implemented.
    console.warn('[NOT IMPLEMENTED] session close subscription not wired (WF-08)');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      return campaignProducts;
    }
    // Adjust category index for regular products based on whether campaigns exist
    const productCategoryIndex = hasCampaigns ? index - 1 : index;
    return products.filter(product => product.Category === productCategoryIndex);
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

  // Auto-scroll category bar to keep active category visible
  useEffect(() => {
    const categoryBar = categoryBarRef.current;
    const activePill = categoryPillRefs.current[activeCategory];
    
    if (categoryBar && activePill) {
      const barRect = categoryBar.getBoundingClientRect();
      const pillRect = activePill.getBoundingClientRect();
      
      // Calculate if pill is outside visible area
      const pillLeft = activePill.offsetLeft;
      const pillRight = pillLeft + pillRect.width;
      const scrollLeft = categoryBar.scrollLeft;
      const scrollRight = scrollLeft + barRect.width;
      
      // Scroll to center the active pill
      if (pillLeft < scrollLeft || pillRight > scrollRight) {
        const scrollTo = pillLeft - (barRect.width / 2) + (pillRect.width / 2);
        categoryBar.scrollTo({
          left: scrollTo,
          behavior: 'smooth',
        });
      }
    }
  }, [activeCategory]);

  return (
    <Box sx={{ pb: 10 }}>
      {/* Fixed Menu Header */}
      <MenuHeader
        restaurantName="Demo Restaurant"
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
            ref={categoryBarRef}
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': {
                display: 'none', // Chrome, Safari, Edge
              },
            }}
          >
            {categories.map((category, index) => (
              <Box
                key={index}
                ref={(el) => {
                  if (el) {
                    categoryPillRefs.current[index] = el as HTMLDivElement;
                  }
                }}
              >
                <CategoryPill
                  index={index}
                  name={category}
                  isActive={activeCategory === index}
                  onClick={handleCategoryClick}
                />
              </Box>
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
                const isCampaign = 'CampaignPrice' in product;
                const price = isCampaign 
                  ? (product as any).CampaignPrice || 0 
                  : (product as any).Price;
                const name = product.Name || '';
                const ingredients = product.Ingredients || undefined;
                const ageRestricted = (product as any).AgeRestrictied || false;
                const dietaries = product.Dietaries || undefined;
                
                return (
                  <ProductCard
                    key={product.Id}
                    id={product.Id}
                    image={product.ImgUrl || ''}
                    name={name}
                    price={price}
                    description={product.Description}
                    toppings={product.Toppings}
                    ingredients={ingredients}
                    excludables={product.Excludables}
                    ageRestricted={ageRestricted}
                    dietaries={dietaries}
                    freeToppings={product.FreeToppings}
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

      {/* Global Toaster */}
      <Toaster
        open={toasterState.open}
        onClose={hideToaster}
        message={toasterState.message}
        severity={toasterState.severity}
        duration={toasterState.duration}
      />
    </Box>
  );
};

export default MenuView;
