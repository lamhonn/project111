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
import BillSummaryDialog from '../../components/order/BillSummaryDialog';
import ThankYouDialog from '../../components/order/ThankYouDialog';
import LockedDialog from '../../components/order/LockedDialog';
import { toasterAtom, hideToasterAtom } from '../../state/toasterStore';
import { loadingAtom, getActiveMenus, getMenuCategories, getMenuProducts, menuCategoriesAtom, menuProductsAtom } from '../../state/menuStore';
import { getTranslation } from '../../utils/multilingualNameUtils';
import { theme } from '../../theme';
import { sessionStatusAtom } from '../../state/sessionStore';
import { SessionStatus } from '../../types/enums/sessionStatus';
import { lockedAtom } from '../../state/uiStore';

const MenuView: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // TODO: create a loading overlay
  const menusLoading = useAtomValue(loadingAtom);

  // Fetch data from API hooks
  const getMenus = useSetAtom(getActiveMenus);

  const menuCategories = useAtomValue(menuCategoriesAtom);
  const getCategories = useSetAtom(getMenuCategories);

  const menuProducts = useAtomValue(menuProductsAtom);
  const getProducts = useSetAtom(getMenuProducts);

  const sessionStatus = useAtomValue(sessionStatusAtom)

  const isLocked = useAtomValue(lockedAtom)

  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [showTotalDialog, setShowTotalDialog] = useState<boolean>(false);
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryPillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const categoryBarRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef<number>(0);

  const toasterState = useAtomValue(toasterAtom);
  const hideToaster = useSetAtom(hideToasterAtom);

  const handleResetSession = () => {
    // resetAppState();
  };

  useEffect(() => {
    getMenus();
    getCategories();
    getProducts();
  }, []);

  // Prevent scrolling when bill is requested
  useEffect(() => {
    if (sessionStatus === SessionStatus.BILL_REQUESTED) {
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
  }, [sessionStatus]);

  // Group products by category
  const productsByCategory = menuCategories.map((category, index) => {
    return menuProducts.filter(product => product.MenuCategoryId === category.Id);
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

      // Check if user has scrolled to bottom
      if ((windowHeight + scrollPosition) > document.body.offsetHeight) {
        setActiveCategory(menuCategories.length - 1);
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
      <MenuHeader />

      {/* Sticky Category Pills */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 1000,
          backgroundColor: theme.colors.background,
          py: 1.5,
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
            {menuCategories.map((category, index) => (
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
                  name={getTranslation(category.Name, i18n.language)}
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
        {menuCategories.map((category, index) => (
          <Box
            key={index}
            ref={(el) => {
              if (el) {
                categoryRefs.current[index] = el as HTMLDivElement;
              }
            }}
            sx={{ mb: 6 }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              {getTranslation(category.Name, i18n.language)}
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
              {productsByCategory[index].map((product) => {                
                return (
                  <ProductCard
                    key={product.Id}
                    productId={product.Id}
                    imgUrl={product.ImgUrl}
                    name={product.Name}
                    price={product.Price}
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
      <ThankYouDialog isOpen={sessionStatus === SessionStatus.BILL_REQUESTED} onReset={handleResetSession} />

      {/* TODO */}
      {/* Locked Dialog - shown when table is locked by staff */}
      <LockedDialog isOpen={isLocked} />

      {/* Total Order Summary Dialog */}
      <BillSummaryDialog
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
