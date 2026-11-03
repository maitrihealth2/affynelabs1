import React from 'react';

export interface WordByWordTypographyProps {
  text?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delayOffset?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  isMetallic?: boolean;
}

export const WordByWordTypography: React.FC<WordByWordTypographyProps> = ({
  text,
  children,
  className = '',
  style,
  as = 'h2',
}) => {
  const content = children !== undefined ? children : text;
  const Component = as as keyof React.JSX.IntrinsicElements;

  return (
    <Component className={className} style={style}>
      {content}
    </Component>
  );
};
