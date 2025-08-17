import { forwardRef } from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  fontWeight?: number | string;
  radius?: number | string;
  padding?: number | string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
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
      radius,
      padding,
      backgroundColor,
      textColor,
      borderColor,

      leftIcon,
      rightIcon,
      isLoading = false,

      disabled,
      ...rest
    },
    ref
  ) => {
    const inlineStyle: React.CSSProperties = {
      ...(width ? { width: toCssSize(width) } : null),
      ...(height ? { height: toCssSize(height) } : null),
      ...(fontSize ? { fontSize: toCssSize(fontSize) } : null),
      ...(fontWeight ? { fontWeight: toCssSize(fontWeight) } : null),
      ...(radius ? { borderRadius: toCssSize(radius) } : null),
      ...(padding ? { padding: toCssSize(padding) } : null),
      ...(backgroundColor ? { backgroundColor: backgroundColor } : null),
      ...(textColor ? { color: textColor } : null),
      ...(borderColor ? { borderColor } : null),
    };

    return (
      <button
        ref={ref}
        style={inlineStyle}
        disabled={disabled || isLoading}
        {...rest}
        className={styles.defaultButton}
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
