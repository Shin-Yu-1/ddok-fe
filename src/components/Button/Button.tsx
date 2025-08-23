import { forwardRef } from 'react';

import clsx from 'clsx';

import styles from './Button.module.scss';

export type ButtonVariant = 'none' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonRadius = 'none' | 'xxsm' | 'xsm' | 'sm' | 'md' | 'full'; // 0, 5px, 10px, 15px, 20px, 45px
export type ButtonFontSize = 'xxxsmall' | 'xxsmall' | 'xsmall' | 'small' | 'medium' | 'large'; // 12px, 14px, 16px, 20px, 24px, 28px
export type ButtonFontWeight = 'regular' | 'medium' | 'semibold' | 'bold'; // 400, 500, 600, 700

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  fontWeight?: number | string;
  padding?: number | string;
  gap?: number | string;
  backgroundColor?: string;
  textColor?: string;
  border?: string;

  // 새로 추가한 props (색, 크기, 곡률, 폰트 크기 및 두께, 전체 너비 여부)
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: ButtonRadius;
  fontSizePreset?: ButtonFontSize;
  fontWeightPreset?: ButtonFontWeight;
  fullWidth?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;

  className?: string;
}

const toCssSize = (value?: number | string) => (typeof value === 'number' ? `${value}px` : value);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,

      width,
      height,
      fontSize,
      fontWeight,
      padding,
      gap,
      backgroundColor,
      textColor,
      border,

      variant = 'none',
      size = 'md',
      radius = 'md',
      fontSizePreset,
      fontWeightPreset,
      fullWidth = false,

      leftIcon,
      rightIcon,
      isLoading = false,

      className,

      disabled,
      ...rest
    },
    ref
  ) => {
    const buttonClasses = clsx(
      styles.defaultButton,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`radius-${radius}`],
      fontSizePreset && styles[`fontSize-${fontSizePreset}`],
      fontWeightPreset && styles[`fontWeight-${fontWeightPreset}`],
      {
        [styles.fullWidth]: fullWidth,
        [styles.disabled]: disabled,
        [styles.loading]: isLoading,
      },
      className
    );

    const inlineStyle: React.CSSProperties = {
      ...(width ? { width: toCssSize(width) } : null),
      ...(height ? { height: toCssSize(height) } : null),
      ...(fontSize && !fontSizePreset ? { fontSize: toCssSize(fontSize) } : null),
      ...(fontWeight && !fontWeightPreset ? { fontWeight: fontWeight } : null),
      ...(padding ? { padding: toCssSize(padding) } : null),
      ...(gap ? { gap: toCssSize(gap) } : null),
      ...(backgroundColor ? { backgroundColor: backgroundColor } : null),
      ...(textColor ? { color: textColor } : null),
      ...(border ? ({ '--button-border': border } as React.CSSProperties) : null),
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        style={inlineStyle}
        disabled={disabled || isLoading}
        {...rest}
      >
        {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
        <span className={styles.label}>{children}</span>
        {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
