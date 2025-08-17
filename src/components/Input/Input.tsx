import { forwardRef } from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: number | string;
  height?: number | string;
  fontSize?: number | string;
  fontWeight?: number | string;
  radius?: number | string;
  padding?: number | string;
  gap?: number | string;
  iconSize?: number | string;
  backgroundColor?: string;
  textColor?: string;
  border?: string;
  focusBorder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

const toCssSize = (value?: number | string) => (typeof value === 'number' ? `${value}px` : value);

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      width,
      height,
      fontSize,
      fontWeight,
      radius,
      padding,
      gap,
      iconSize,
      backgroundColor,
      textColor,
      border,
      focusBorder,

      leftIcon,
      rightIcon,

      disabled,
      style,
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
      ...(gap ? { gap: toCssSize(gap) } : null),
      ...(backgroundColor ? { backgroundColor: backgroundColor } : null),
      ...(textColor ? { color: textColor } : null),
      ...(border ? ({ '--base-border': border } as React.CSSProperties) : null),
      ...(focusBorder ? ({ '--focus-border': focusBorder } as React.CSSProperties) : null),
      ...style,
    };

    const inlineIconStyle: React.CSSProperties = {
      ...(iconSize ? { width: toCssSize(iconSize), height: toCssSize(iconSize) } : null),
    };

    return (
      <div
        className={`${styles.defaultInputWrapper} ${disabled ? styles.disabled : ''}`}
        style={inlineStyle}
      >
        {leftIcon && (
          <span className={styles.icon} style={inlineIconStyle}>
            {leftIcon}
          </span>
        )}

        <input ref={ref} disabled={disabled} className={styles.defaultInput} {...rest} />

        {rightIcon && (
          <span className={styles.icon} style={inlineIconStyle}>
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
