// Button system for MoH
import { colors } from './colors';

export const buttonStyles = {
  base: {
    fontFamily: `'Inter', Arial, sans-serif`,
    fontWeight: 500,
    borderRadius: 6,
    padding: '8px 20px',
    fontSize: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  },
  primary: {
    background: colors.primary,
    color: colors.light,
    '&:hover': { background: '#00563a' },
  },
  secondary: {
    background: colors.secondary,
    color: colors.primary,
    '&:hover': { background: '#ffe066' },
  },
  disabled: {
    background: colors.disabled,
    color: colors.textSecondary,
    cursor: 'not-allowed',
  },
};
