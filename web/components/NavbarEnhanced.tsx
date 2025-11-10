'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Activity, ChevronDown, Radio, TrendingUp, Server, Shield, Package, DollarSign, BarChart3, Lock, Home, LogIn, Menu, X } from 'lucide-react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import LiveStatusPill from './LiveStatusPill';

const siteName = 'AI•Predicted•Signals';

interface DropdownItem {
  label: string;
  href: string;
  icon: any;
  description: string;
  badge?: string;
  badgeColor?: string;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
  columns?: number;
}

// Navigation structure
const liveStatusDropdown: NavDropdown = {
  label: 'Live Status',
  columns: 2,
  items: [
    {
      label: 'Live Signals Feed',
      href: '/signals',
      icon: Radio,
      description: 'Real-time signal stream',
      badge: 'Live',
      badgeColor: 'green',
    },
    {
      label: '24h PnL Snapshot',
      href: '/performance',
      icon: TrendingUp,
      description: 'Rolling profit display',
    },
    {
      label: 'API Health Monitor',
      href: '/live',
      icon: Server,
      description: 'Uptime, latency & heartbeat',
    },
    {
      label: 'System Dashboard',
      href: '/investor',
      icon: BarChart3,
      description: 'Internal metrics',
      badge: 'Investor',
      badgeColor: 'purple',
    },
  ],
};

const tradingPairsDropdown: NavDropdown = {
  label: 'Trading Pairs',
  columns: 1,
  items: [
    {
      label: 'BTC/USD',
      href: '/pairs/btc-usd',
      icon: TrendingUp,
      description: 'Bitcoin signals',
    },
    {
      label: 'ETH/USD',
      href: '/pairs/eth-usd',
      icon: TrendingUp,
      description: 'Ethereum signals',
    },
    {
      label: 'SOL/USD',
      href: '/pairs/sol-usd',
      icon: TrendingUp,
      description: 'Solana signals',
    },
    {
      label: 'MATIC/USD',
      href: '/pairs/matic-usd',
      icon: TrendingUp,
      description: 'Polygon signals',
    },
    {
      label: 'LINK/USD',
      href: '/pairs/link-usd',
      icon: TrendingUp,
      description: 'Chainlink signals',
    },
  ],
};

const productDropdown: NavDropdown = {
  label: 'Product',
  columns: 1,
  items: [
    {
      label: 'Crypto-AI-Bot',
      href: '/product/crypto-ai-bot',
      icon: Activity,
      description: 'Multi-agent AI engine',
    },
    {
      label: 'Signals-API',
      href: '/product/signals-api',
      icon: Server,
      description: 'Backend reliability & metrics',
    },
    {
      label: 'Signals-Site',
      href: '/product/signals-site',
      icon: Package,
      description: 'SaaS front-end portal',
    },
    {
      label: 'How It All Connects',
      href: '/tech',
      icon: Activity,
      description: 'Architecture overview',
    },
  ],
};

const loginDropdown: NavDropdown = {
  label: 'Login',
  columns: 1,
  items: [
    {
      label: 'Investor Preview',
      href: '/investor',
      icon: TrendingUp,
      description: 'Access dashboard',
    },
    {
      label: 'Team Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      description: 'Internal analytics',
    },
    {
      label: 'Discord Community',
      href: 'https://discord.gg/your-server',
      icon: Home,
      description: 'Join our community',
    },
  ],
};

function DropdownMenu({ dropdown }: { dropdown: NavDropdown }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-text2 hover:text-text transition-colors rounded-lg hover:bg-surface/50"
      >
        {dropdown.label}
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 min-w-[320px] bg-gray-900/95 backdrop-blur-xl border border-purple-600/20 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          <div className="p-2">
            <div
              className={clsx(
                'grid gap-1',
                dropdown.columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
              )}
            >
              {dropdown.items.map((item) => {
                const Icon = item.icon;
                const isExternal = item.href.startsWith('http');

                const content = (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/20 transition-all group cursor-pointer">
                    <div className="mt-1">
                      <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white group-hover:text-purple-200 transition-colors">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={clsx(
                              'px-1.5 py-0.5 text-[10px] font-bold rounded uppercase',
                              item.badgeColor === 'green' && 'bg-green-500/20 text-green-400',
                              item.badgeColor === 'purple' && 'bg-purple-500/20 text-purple-400'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );

                if (isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Gradient border glow */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-purple-500/20 pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
}

function MobileDropdown({ dropdown }: { dropdown: NavDropdown }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-purple-600/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-text2 hover:text-text transition-colors"
      >
        {dropdown.label}
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-gray-900/50"
          >
            <div className="px-2 pb-2">
              {dropdown.items.map((item) => {
                const Icon = item.icon;
                const isExternal = item.href.startsWith('http');

                const content = (
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/20 transition-all">
                    <Icon className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-white">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={clsx(
                              'px-1.5 py-0.5 text-[10px] font-bold rounded uppercase',
                              item.badgeColor === 'green' && 'bg-green-500/20 text-green-400',
                              item.badgeColor === 'purple' && 'bg-purple-500/20 text-purple-400'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );

                if (isExternal) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={item.href} href={item.href}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NavbarEnhanced() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);

      // Hide/show navbar on scroll
      if (latest > lastScrollY && latest > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(latest);
    });
    return () => unsubscribe();
  }, [scrollY, lastScrollY]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300',
        isScrolled ? 'bg-gray-900/95 border-purple-600/40 shadow-2xl' : 'bg-gray-900/80 border-purple-600/20'
      )}
    >
      {/* Gradient top border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Activity className="w-6 h-6 text-purple-400 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 blur-md bg-purple-400 opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              {siteName}
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Live Status Dropdown */}
            <DropdownMenu dropdown={liveStatusDropdown} />

            {/* Trading Pairs Dropdown */}
            <DropdownMenu dropdown={tradingPairsDropdown} />

            {/* Product Dropdown */}
            <DropdownMenu dropdown={productDropdown} />

            {/* Simple Links */}
            <Link
              href="/pricing"
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-all rounded-lg',
                isActive('/pricing')
                  ? 'text-purple-300 bg-purple-900/30'
                  : 'text-text2 hover:text-text hover:bg-surface/50'
              )}
            >
              Pricing
            </Link>

            <Link
              href="/performance"
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-all rounded-lg',
                isActive('/performance')
                  ? 'text-purple-300 bg-purple-900/30'
                  : 'text-text2 hover:text-text hover:bg-surface/50'
              )}
            >
              Performance
            </Link>

            <Link
              href="/tech-safety"
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-all rounded-lg',
                isActive('/tech-safety')
                  ? 'text-purple-300 bg-purple-900/30'
                  : 'text-text2 hover:text-text hover:bg-surface/50'
              )}
            >
              Tech & Safety
            </Link>

            <Link
              href="/acquire"
              className={clsx(
                'px-4 py-2 text-sm font-medium transition-all rounded-lg',
                isActive('/acquire')
                  ? 'text-purple-300 bg-purple-900/30'
                  : 'text-text2 hover:text-text hover:bg-surface/50'
              )}
            >
              Acquire Info
            </Link>

            {/* Login Dropdown */}
            <DropdownMenu dropdown={loginDropdown} />
          </div>

          {/* Right Side - Live Status Pill & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LiveStatusPill />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Launch Console
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-text2 hover:text-text transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-purple-600/20"
            >
              <div className="py-4 space-y-1">
                {/* Mobile Dropdowns */}
                <MobileDropdown dropdown={liveStatusDropdown} />
                <MobileDropdown dropdown={tradingPairsDropdown} />
                <MobileDropdown dropdown={productDropdown} />

                {/* Mobile Simple Links */}
                <Link
                  href="/pricing"
                  className={clsx(
                    'block px-4 py-3 text-sm font-medium transition-all border-b border-purple-600/20',
                    isActive('/pricing')
                      ? 'text-purple-300 bg-purple-900/30'
                      : 'text-text2 hover:text-text hover:bg-surface/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>

                <Link
                  href="/performance"
                  className={clsx(
                    'block px-4 py-3 text-sm font-medium transition-all border-b border-purple-600/20',
                    isActive('/performance')
                      ? 'text-purple-300 bg-purple-900/30'
                      : 'text-text2 hover:text-text hover:bg-surface/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Performance
                </Link>

                <Link
                  href="/tech-safety"
                  className={clsx(
                    'block px-4 py-3 text-sm font-medium transition-all border-b border-purple-600/20',
                    isActive('/tech-safety')
                      ? 'text-purple-300 bg-purple-900/30'
                      : 'text-text2 hover:text-text hover:bg-surface/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Tech & Safety
                </Link>

                <Link
                  href="/acquire"
                  className={clsx(
                    'block px-4 py-3 text-sm font-medium transition-all border-b border-purple-600/20',
                    isActive('/acquire')
                      ? 'text-purple-300 bg-purple-900/30'
                      : 'text-text2 hover:text-text hover:bg-surface/50'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Acquire Info
                </Link>

                <MobileDropdown dropdown={loginDropdown} />

                {/* Mobile CTA */}
                <div className="px-4 pt-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Launch Console
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
