import { type HTMLAttributes, forwardRef } from 'react';

type BadgeVariant = 'default' | 'gold' | 'cyan' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-space-600 text-text-secondary',
  gold: 'bg-gold-500/20 text-gold-400',
  cyan: 'bg-cyan-500/20 text-cyan-400',
  success: 'bg-status-success/20 text-status-success',
  warning: 'bg-status-warning/20 text-status-warning',
  error: 'bg-status-error/20 text-status-error',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'sm', className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center font-medium rounded-full
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Presence indicator dot
type PresenceStatus = 'active' | 'idle' | 'offline';

interface PresenceDotProps extends HTMLAttributes<HTMLSpanElement> {
  status: PresenceStatus;
  pulse?: boolean;
}

const presenceColors: Record<PresenceStatus, string> = {
  active: 'bg-presence-active',
  idle: 'bg-presence-idle',
  offline: 'bg-presence-offline',
};

export const PresenceDot = forwardRef<HTMLSpanElement, PresenceDotProps>(
  ({ status, pulse = false, className = '', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-block w-2.5 h-2.5 rounded-full
          ${presenceColors[status]}
          ${pulse && status === 'active' ? 'animate-pulse-slow' : ''}
          ${className}
        `}
        {...props}
      />
    );
  }
);

PresenceDot.displayName = 'PresenceDot';
