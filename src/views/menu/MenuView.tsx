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
import { useGetProducts } from '../../api/hooks/product.hooks';
import { useGetActiveCampaignProducts } from '../../api/hooks/campaignProduct.hooks';
import { MOCK_CATEGORIES } from '../../api/mockData/products.mock';
import { getLocalizedCategoryName } from '../../api/utils/multilingualName.utils';

const MenuView: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // Fetch data from API hooks
  // TODO: Get organizationId and menuId from context/URL params
  const { data: productsData, loading: productsLoading } = useGetProducts('mock-org-1');
  const { data: campaignsData, loading: campaignsLoading } = useGetActiveCampaignProducts('mock-menu-1');
  
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showCategoryBar, setShowCategoryBar] = useState<boolean>(true);
  const [showTotalDialog, setShowTotalDialog] = useState<boolean>(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastScrollY = useRef<number>(0);
  
  const orderStatus = useAtomValue(orderStatusAtom);
  const billRequested = useAtomValue(billRequestedAtom);
  const resetAppState = useSetAtom(resetAppStateAtom);

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
