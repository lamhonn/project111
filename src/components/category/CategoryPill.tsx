import React from 'react';
import { Chip } from '@mui/material';
import { theme } from '../../theme/theme';

interface CategoryPillProps {
  index: number;
  name: string;
  isActive?: boolean;
  onClick?: (index: number) => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  index,
  name,
  isActive = false,
  onClick,
}) => {
  const handleClick = (): void => {
    if (onClick) {
      onClick(index);
    }
  };

  return (
    <Chip
      label={name}
      onClick={handleClick}
      clickable
      sx={{
        backgroundColor: isActive ? theme.colors.primary : 'white',
        color: isActive ? 'white' : theme.colors.text,
        fontWeight: isActive ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.medium,
        fontSize: theme.typography.fontSizes.small,
        px: theme.spacing.md,
        py: 2.5,
        height: theme.height.xsmall,
        borderRadius: theme.borderRadius.medium,
        border: isActive ? 'none' : '1px solid',
        borderColor: theme.colors.border,
        transition: theme.transitions.normal,
        '&:hover': {
          backgroundColor: isActive ? theme.colors.primaryDark : theme.colors.brandGrey,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
      }}
    />
  );
};

export default CategoryPill;
