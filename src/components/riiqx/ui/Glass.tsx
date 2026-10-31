'use client';

// =============================================================================
// RIIQX LIQUID INTELLIGENCE UI SYSTEM
// 15 Modular Liquid Glass Components
// Depth, Translucency, Fine Highlights & Apple Liquid Glass Physics
// =============================================================================

import React, { forwardRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, Check, AlertTriangle, AlertCircle, Info } from 'lucide-react';

/* -----------------------------------------------------------------------------
 * 1. GlassPanel — Foundational Translucent Surface
 * -------------------------------------------------------------------------- */
export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'subtle' | 'accent';
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className = '', variant = 'default', blur = 'lg', border = true, children, ...props }, ref) => {
    const blurClass = {
      none: '',
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    }[blur];

    const variantClass = {
      default: 'bg-white/80 dark:bg-[#121215]/80 text-[#202124] dark:text-[#F4F4F6]',
      elevated: 'bg-white/95 dark:bg-[#18181C]/90 text-[#202124] dark:text-[#F4F4F6] shadow-xl',
      subtle: 'bg-white/50 dark:bg-[#121215]/50 text-[#202124] dark:text-[#F4F4F6]',
      accent: 'bg-[#FFD43B]/10 dark:bg-[#FFD43B]/10 text-[#202124] dark:text-[#F4F4F6]',
    }[variant];

    const borderClass = border
      ? 'border border-[#EAE7E1] dark:border-white/[0.08]'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-2xl ${blurClass} ${variantClass} ${borderClass} transition-colors ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = 'GlassPanel';

/* -----------------------------------------------------------------------------
 * 2. GlassCard — Interactive or Static Card Container
 * -------------------------------------------------------------------------- */
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  glow?: 'none' | 'yellow' | 'coral' | 'emerald';
  elevated?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className = '', interactive = false, glow = 'none', elevated = false, children, ...props }, ref) => {
    const glowClass = {
      none: '',
      yellow: 'hover:shadow-[0_0_24px_-4px_rgba(255,212,59,0.22)]',
      coral: 'hover:shadow-[0_0_24px_-4px_rgba(255,107,94,0.22)]',
      emerald: 'hover:shadow-[0_0_24px_-4px_rgba(16,185,129,0.22)]',
    }[glow];

    const elevatedClass = elevated
      ? 'shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] bg-white/90 dark:bg-[#18181C]/90'
      : 'shadow-sm bg-white/75 dark:bg-[#141418]/75';

    const interactiveClass = interactive
      ? 'cursor-pointer hover:border-[#FFD43B]/50 dark:hover:border-[#FFD43B]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200'
      : 'transition-colors';

    return (
      <div
        ref={ref}
        className={`rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] backdrop-blur-md ${elevatedClass} ${glowClass} ${interactiveClass} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

/* -----------------------------------------------------------------------------
 * 3. GlassNavigation — Tab or Sidebar Floating Nav
 * -------------------------------------------------------------------------- */
export interface GlassNavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface GlassNavigationProps {
  items: GlassNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function GlassNavigation({
  items,
  activeId,
  onSelect,
  orientation = 'horizontal',
  className = '',
}: GlassNavigationProps) {
  return (
    <nav
      className={`rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/70 dark:bg-[#121215]/70 backdrop-blur-lg p-1.5 flex ${
        orientation === 'vertical' ? 'flex-col space-y-1' : 'flex-row space-x-1 overflow-x-auto no-scrollbar'
      } ${className}`}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-150 shrink-0 ${
              isActive
                ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-xs'
                : 'text-[#737373] dark:text-[#A1A1AA] hover:text-[#202124] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
            }`}
          >
            {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#202124]' : 'text-current'}`} />}
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-black/15 text-[#202124]'
                    : 'bg-black/5 dark:bg-white/10 text-current'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

/* -----------------------------------------------------------------------------
 * 4. GlassModal — Depth-Layered Centered Modal Dialog
 * -------------------------------------------------------------------------- */
export interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function GlassModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: GlassModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full ${maxWidthClass} rounded-3xl border border-[#EAE7E1] dark:border-white/[0.12] bg-white/95 dark:bg-[#16161A]/95 backdrop-blur-2xl p-6 shadow-2xl text-[#202124] dark:text-[#F4F4F6] z-10`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {title && <h3 className="text-lg font-bold tracking-tight">{title}</h3>}
              {description && (
                <p className="text-xs text-[#737373] dark:text-[#A1A1AA] mt-1">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* -----------------------------------------------------------------------------
 * 5. GlassDropdown — Glassmorphic Select Dropdown
 * -------------------------------------------------------------------------- */
export interface GlassDropdownOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface GlassDropdownProps {
  options: GlassDropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlassDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
}: GlassDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#202124] dark:text-[#F4F4F6] shadow-xs hover:border-[#FFD43B]/50 transition"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <span className="text-[10px] opacity-60 ml-2">▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-full min-w-[160px] rounded-2xl border border-[#EAE7E1] dark:border-white/[0.12] bg-white/95 dark:bg-[#18181C]/95 backdrop-blur-xl p-1 shadow-xl z-40 space-y-0.5">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  opt.value === value
                    ? 'bg-[#FFD43B] text-[#202124]'
                    : 'text-[#737373] dark:text-[#A1A1AA] hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {opt.value === value && <Check className="w-3 h-3 text-[#202124]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 6. GlassTooltip — Floating Translucent Tooltip
 * -------------------------------------------------------------------------- */
export interface GlassTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function GlassTooltip({ content, children, position = 'top' }: GlassTooltipProps) {
  const [visible, setVisible] = useState(false);

  const posClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap rounded-lg border border-[#EAE7E1] dark:border-white/[0.1] bg-[#202124]/90 dark:bg-[#18181C]/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white shadow-md pointer-events-none transition-opacity ${posClass}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 7. GlassCommandBar — ⌘K Global Prompt / Search Input
 * -------------------------------------------------------------------------- */
export interface GlassCommandBarProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export function GlassCommandBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a goal or command...',
  shortcut = '⌘K',
  className = '',
}: GlassCommandBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={`relative flex items-center rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/70 dark:bg-[#141418]/70 backdrop-blur-md px-3.5 py-1.5 shadow-xs focus-within:border-[#FFD43B] focus-within:shadow-[0_0_20px_-3px_rgba(255,212,59,0.2)] transition-all ${className}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-xs font-medium text-[#202124] dark:text-[#F4F4F6] placeholder:text-[#A1A1AA] focus:outline-none"
      />
      {shortcut && (
        <span className="ml-2 rounded-md border border-[#EAE7E1] dark:border-white/[0.1] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#737373] dark:text-[#A1A1AA] shrink-0">
          {shortcut}
        </span>
      )}
    </form>
  );
}

/* -----------------------------------------------------------------------------
 * 8. GlassButton — Interactive Button with Variants & Micro-Interactions
 * -------------------------------------------------------------------------- */
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', loading = false, disabled, icon: Icon, children, ...props }, ref) => {
    const sizeClass = {
      sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-2 text-xs rounded-2xl gap-2 font-bold',
      lg: 'px-5 py-2.5 text-sm rounded-2xl gap-2.5 font-bold',
    }[size];

    const variantClass = {
      primary:
        'bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] shadow-xs hover:shadow-[0_0_20px_-3px_rgba(255,212,59,0.3)] active:scale-[0.98]',
      secondary:
        'border border-[#EAE7E1] dark:border-white/[0.1] bg-white/70 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] text-[#202124] dark:text-white backdrop-blur-md active:scale-[0.98]',
      ghost:
        'hover:bg-black/5 dark:hover:bg-white/10 text-[#737373] dark:text-[#A1A1AA] hover:text-[#202124] dark:hover:text-white',
      danger:
        'bg-[#FF4D4F] hover:bg-[#E03B3D] text-white shadow-xs hover:shadow-[0_0_20px_-3px_rgba(255,77,79,0.3)] active:scale-[0.98]',
      success:
        'bg-[#10B981] hover:bg-[#059669] text-white shadow-xs hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] active:scale-[0.98]',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none ${sizeClass} ${variantClass} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          Icon && <Icon className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{children}</span>
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';

/* -----------------------------------------------------------------------------
 * 9. GlassInput — Glass Form Input with Floating Border
 * -------------------------------------------------------------------------- */
export interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className = '', error, icon: Icon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] dark:text-[#A1A1AA] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full rounded-2xl border ${
            error
              ? 'border-[#FF4D4F] focus:border-[#FF4D4F]'
              : 'border-[#EAE7E1] dark:border-white/[0.08] focus:border-[#FFD43B]'
          } bg-white/70 dark:bg-[#141418]/70 backdrop-blur-md px-3.5 py-2.5 text-xs text-[#202124] dark:text-[#F4F4F6] placeholder:text-[#A1A1AA] focus:outline-none focus:shadow-[0_0_16px_-2px_rgba(255,212,59,0.2)] transition ${
            Icon ? 'pl-10' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-[11px] text-[#FF4D4F]">{error}</p>}
      </div>
    );
  }
);
GlassInput.displayName = 'GlassInput';

/* -----------------------------------------------------------------------------
 * 10. GlassTabBar — Segmented Horizontal Pill Bar
 * -------------------------------------------------------------------------- */
export interface GlassTabOption {
  id: string;
  label: string;
  badge?: number;
}

export interface GlassTabBarProps {
  tabs: GlassTabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function GlassTabBar({ tabs, activeTab, onTabChange, className = '' }: GlassTabBarProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/70 dark:bg-[#141418]/70 backdrop-blur-md p-1 shadow-2xs overflow-x-auto no-scrollbar ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 shrink-0 ${
              isActive
                ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-2xs'
                : 'text-[#737373] dark:text-[#A1A1AA] hover:text-[#202124] dark:hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-black/15 text-[#202124]' : 'bg-black/5 dark:bg-white/10'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 11. GlassBottomSheet — Mobile Swipeable Drawer
 * -------------------------------------------------------------------------- */
export interface GlassBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function GlassBottomSheet({ isOpen, onClose, title, children }: GlassBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10 w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-[#EAE7E1] dark:border-white/[0.12] bg-white/95 dark:bg-[#16161A]/95 backdrop-blur-2xl p-5 pb-safe-nav text-[#202124] dark:text-[#F4F4F6] shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/15 dark:bg-white/20" />
        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EAE7E1] dark:border-white/[0.08]">
            <h3 className="text-sm font-bold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-full text-[#737373]">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div>{children}</div>
      </motion.div>
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 12. GlassFloatingToolbar — Quick Actions Dock
 * -------------------------------------------------------------------------- */
export interface GlassFloatingToolbarProps {
  children: React.ReactNode;
  position?: 'bottom-center' | 'top-right' | 'bottom-right';
  className?: string;
}

export function GlassFloatingToolbar({
  children,
  position = 'bottom-center',
  className = '',
}: GlassFloatingToolbarProps) {
  const posClass = {
    'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2 z-40',
    'top-right': 'fixed top-16 right-6 z-40',
    'bottom-right': 'fixed bottom-6 right-6 z-40',
  }[position];

  return (
    <div
      className={`${posClass} flex items-center gap-2 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.12] bg-white/85 dark:bg-[#16161A]/85 backdrop-blur-xl p-2 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 13. GlassNotification — Floating Toast Alert
 * -------------------------------------------------------------------------- */
export interface GlassNotificationProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  onDismiss?: () => void;
  className?: string;
}

export function GlassNotification({
  type = 'info',
  title,
  message,
  onDismiss,
  className = '',
}: GlassNotificationProps) {
  const Icon = {
    success: Check,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info,
  }[type];

  const colorClass = {
    success: 'text-[#10B981] bg-[#10B981]/15 border-[#10B981]/30',
    warning: 'text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/30',
    error: 'text-[#FF4D4F] bg-[#FF4D4F]/15 border-[#FF4D4F]/30',
    info: 'text-[#FFD43B] bg-[#FFD43B]/15 border-[#FFD43B]/30',
  }[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.1] bg-white/90 dark:bg-[#16161A]/90 backdrop-blur-xl p-3.5 shadow-xl text-[#202124] dark:text-[#F4F4F6] max-w-sm ${className}`}
    >
      <div className={`p-1.5 rounded-xl border shrink-0 ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold leading-snug">{title}</h4>
        {message && (
          <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA] mt-0.5 leading-relaxed">
            {message}
          </p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[#737373] hover:text-[#202124] dark:hover:text-white p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 14. GlassProgress — Translucent Meter
 * -------------------------------------------------------------------------- */
export interface GlassProgressProps {
  value: number; // 0 to 100
  color?: 'yellow' | 'coral' | 'emerald';
  className?: string;
}

export function GlassProgress({ value, color = 'yellow', className = '' }: GlassProgressProps) {
  const barColor = {
    yellow: 'bg-gradient-to-r from-[#FFD43B] to-[#FFC928]',
    coral: 'bg-gradient-to-r from-[#FF6B5E] to-[#FF4D4F]',
    emerald: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
  }[color];

  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full border border-black/5 dark:border-white/[0.08] bg-black/5 dark:bg-white/[0.05] p-0.5 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barColor}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * 15. GlassStatusIndicator — Pulse Badge
 * -------------------------------------------------------------------------- */
export interface GlassStatusIndicatorProps {
  status: 'online' | 'busy' | 'offline' | 'error' | 'ready';
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function GlassStatusIndicator({
  status,
  label,
  pulse = true,
  className = '',
}: GlassStatusIndicatorProps) {
  const dotColor = {
    online: 'bg-[#10B981]',
    busy: 'bg-[#FFD43B]',
    offline: 'bg-[#737373]',
    error: 'bg-[#FF4D4F]',
    ready: 'bg-[#3B82F6]',
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#EAE7E1] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.05] backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-[#202124] dark:text-[#F4F4F6] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && status === 'online' && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      {label && <span className="capitalize">{label}</span>}
    </span>
  );
}

