import { classNames } from '@/utils/classNames';
import { ReactNode } from 'react';

const classes = {
  default: 'rounded-lg px-2 py-1 text-xs font-semibold shadow-sm ',
  sm: 'rounded-lg px-3 py-1 text-sm font-semibold shadow-sm ',
  md: 'rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm ',
  lg: 'rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ',
  xl: 'rounded-lg px-4 py-2 text-sm font-semibold shadow-sm ',
  xxl: 'rounded-lg px-5 py-3 text-sm font-semibold shadow-sm ',
};

const variants = {
  primary: 'bg-button-primary text-white hover:bg-button-primary/80',
  secondary: 'bg-white hover:bg-white/90 text-gray-900',
};

interface ButtonProps {
  size?: keyof typeof classes;
  variant?: keyof typeof variants;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  size,
  children,
  variant,
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        classes[size || 'default'],
        variants[variant || 'primary'],
        'disabled:cursor-not-allowed disabled:opacity-30',
        className
      )}
    >
      {children}
    </button>
  );
};
