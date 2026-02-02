'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { BookOpen, BarChart3, Settings, Zap, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { books } from '@/content/books';

// ---------------------------------------------------------------------------
// LogoMark
// ---------------------------------------------------------------------------

function LogoMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <line
        x1="4.5"
        y1="13.5"
        x2="13.5"
        y2="4.5"
        stroke="var(--color-accent)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle
        cx="4.5"
        cy="13.5"
        r="3"
        fill="var(--color-accent)"
        opacity="0.55"
      />
      <circle
        cx="13.5"
        cy="4.5"
        r="3"
        fill="var(--color-accent)"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// NavLink
// ---------------------------------------------------------------------------

function NavLink({
  href,
  icon,
  label,
  active = false,
  onClick,
  showLabel = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  showLabel?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors ${
        active
          ? 'bg-accent-subtle text-accent'
          : 'text-secondary hover:bg-surface hover:text-primary'
      }`}
    >
      {icon}
      <span className={showLabel ? '' : 'hidden sm:inline'}>{label}</span>
      {active && (
        <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 h-[2px] w-5 rounded-full bg-accent hidden sm:block" />
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Helper: extract bookId from pathname
// ---------------------------------------------------------------------------

function getBookIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/books\/([^/]+)/);
  return match ? match[1] : null;
}

// ---------------------------------------------------------------------------
// BookSwitcher dropdown
// ---------------------------------------------------------------------------

function BookSwitcher({
  currentBookId,
  onClose,
}: {
  currentBookId: string;
  onClose?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const currentBook = books.find((b) => b.id === currentBookId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-surface transition-colors cursor-pointer border border-border/50"
      >
        <span className="max-w-[140px] truncate">{currentBook?.shortTitle ?? 'Select Book'}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-64 rounded-lg border border-border bg-elevated shadow-lg z-30">
          <div className="p-1">
            {books.map((book) => (
              <button
                key={book.id}
                onClick={() => {
                  router.push(`/books/${book.id}/learn`);
                  setOpen(false);
                  onClose?.();
                }}
                className={`flex w-full flex-col items-start rounded-md px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  book.id === currentBookId
                    ? 'bg-accent-subtle'
                    : 'hover:bg-surface'
                }`}
              >
                <span className={`text-sm font-medium ${book.id === currentBookId ? 'text-accent' : 'text-primary'}`}>
                  {book.shortTitle}
                </span>
                <span className="text-xs text-tertiary mt-0.5 line-clamp-1">
                  {book.authors}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NavHeader
// ---------------------------------------------------------------------------

export function NavHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Derive bookId from URL
  const bookId = getBookIdFromPath(pathname) ?? 'deep-learning-python';
  const bookPrefix = `/books/${bookId}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  const navItems = [
    { href: `${bookPrefix}/learn`, icon: <BookOpen className="h-4 w-4" />, label: 'Learn', active: pathname.startsWith(`${bookPrefix}/learn`) || pathname.startsWith('/learn') },
    { href: `${bookPrefix}/review`, icon: <Zap className="h-4 w-4" />, label: 'Review', active: pathname.startsWith(`${bookPrefix}/review`) || pathname === '/review' },
    { href: `${bookPrefix}/progress`, icon: <BarChart3 className="h-4 w-4" />, label: 'Progress', active: pathname.startsWith(`${bookPrefix}/progress`) || pathname === '/progress' },
    { href: '/settings', icon: <Settings className="h-4 w-4" />, label: 'Settings', active: pathname === '/settings' },
  ];

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-lg'
          : 'border-border bg-background/80 backdrop-blur-md'
      }`}
    >
      <div className="container-wide flex h-14 items-center justify-between">
        {/* ---- Logo + Book Switcher ---- */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
          >
            <LogoMark />
            <span
              className="text-base leading-none text-primary"
              style={{ letterSpacing: '-0.04em' }}
            >
              <span className="font-semibold">Deep</span>
              <span className="font-bold text-accent">Learn</span>
            </span>
          </Link>

          <span className="hidden sm:block h-4 w-px bg-border" />

          <div className="hidden sm:block">
            <BookSwitcher currentBookId={bookId} />
          </div>
        </div>

        {/* ---- Desktop Navigation ---- */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        {/* ---- User Menu + Mobile Menu Button ---- */}
        <div className="flex items-center gap-2">
          {session?.user && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-border hover:border-accent/50 transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <span className="text-xs font-semibold text-secondary">
                  {session.user.name?.[0]?.toUpperCase() ?? '?'}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-elevated shadow-lg z-30">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium text-primary truncate">
                      {session.user.name}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => signOut({ callbackUrl: '/signin' })}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-secondary hover:bg-surface hover:text-primary transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface hover:text-primary transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ---- Mobile Dropdown ---- */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-border bg-elevated px-4 py-2">
          <div className="mb-2 px-3 py-2">
            <BookSwitcher currentBookId={bookId} onClose={() => setMobileOpen(false)} />
          </div>
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} showLabel onClick={() => setMobileOpen(false)} />
          ))}
        </nav>
      )}
    </header>
  );
}

export default NavHeader;
