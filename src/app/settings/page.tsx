'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Monitor,
  Download,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Type,
  Target,
  Sparkles,
} from 'lucide-react';
import { NavHeader } from '@/components/navigation/NavHeader';
import { PageTransition } from '@/components/ui/PageTransition';
import type { UserSettings } from '@/lib/db/schema';
import { useSettings } from '@/lib/db/hooks';
import { exportAllData, clearAllData } from '@/lib/db/api-client';
import { useThemeStore } from '@/lib/store';

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container-content py-8 sm:py-12">
        <div className="mb-8">
          <div className="h-9 w-40 animate-pulse rounded-lg bg-surface" />
          <div className="mt-2 h-5 w-64 animate-pulse rounded-lg bg-surface" />
        </div>
        <div className="flex flex-col gap-6 max-w-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-elevated p-5 shadow-sm"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-surface" />
                <div className="flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface" />
                  <div className="mt-2 h-4 w-56 animate-pulse rounded bg-surface" />
                </div>
              </div>
              <div className="ml-11 h-10 animate-pulse rounded-lg bg-surface" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const { settings, isLoading, updateSettings, resetSettings } = useSettings();
  const setTheme = useThemeStore((s) => s.setTheme);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const updateSetting = useCallback(
    <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
      updateSettings({ [key]: value });
      // Sync theme changes to the theme store (which manages data-theme on <html>)
      if (key === 'theme') {
        setTheme(value as 'light' | 'dark' | 'system');
      }
    },
    [updateSettings, setTheme],
  );

  const handleExport = useCallback(async () => {
    const data = await exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deeplearn-export.json';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  }, []);

  const handleReset = useCallback(async () => {
    await clearAllData();
    setShowResetConfirm(false);
    setShowResetSuccess(true);
    setTimeout(() => setShowResetSuccess(false), 3000);
  }, []);

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavHeader />

      <PageTransition>
      <div className="container-content py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-base text-secondary">
            Customize your learning experience
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-2xl">
          {/* Theme */}
          <SettingSection
            icon={<Sun className="h-4 w-4" />}
            title="Theme"
            description="Choose your preferred color scheme"
          >
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as const).map((theme) => {
                const icons = { light: Sun, dark: Moon, system: Monitor };
                const Icon = icons[theme];
                const isActive = settings.theme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => updateSetting('theme', theme)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'border-accent bg-accent-subtle text-accent'
                        : 'border-border bg-background text-secondary hover:border-accent/30 hover:text-primary'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{theme}</span>
                  </button>
                );
              })}
            </div>
          </SettingSection>

          {/* Daily Review Goal */}
          <SettingSection
            icon={<Target className="h-4 w-4" />}
            title="Daily Review Goal"
            description="Target number of cards to review per day"
          >
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={200}
                step={5}
                value={settings.dailyReviewGoal}
                onChange={(e) => updateSetting('dailyReviewGoal', Number(e.target.value))}
                className="flex-1 accent-[var(--color-accent)]"
              />
              <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-primary">
                {settings.dailyReviewGoal}
              </div>
            </div>
          </SettingSection>

          {/* New Cards Per Day */}
          <SettingSection
            icon={<Sparkles className="h-4 w-4" />}
            title="New Cards Per Day"
            description="Maximum new cards introduced each day"
          >
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={settings.newCardsPerDay}
                onChange={(e) => updateSetting('newCardsPerDay', Number(e.target.value))}
                className="flex-1 accent-[var(--color-accent)]"
              />
              <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-primary">
                {settings.newCardsPerDay}
              </div>
            </div>
          </SettingSection>

          {/* Font Size */}
          <SettingSection
            icon={<Type className="h-4 w-4" />}
            title="Reading Font Size"
            description="Adjust the text size for lesson content"
          >
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => {
                const isActive = settings.fontSize === size;
                const sizeLabel = { small: 'A', medium: 'A', large: 'A' };
                const sizeClass = {
                  small: 'text-sm',
                  medium: 'text-base',
                  large: 'text-lg',
                };
                return (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all cursor-pointer ${
                      isActive
                        ? 'border-accent bg-accent-subtle text-accent'
                        : 'border-border bg-background text-secondary hover:border-accent/30 hover:text-primary'
                    }`}
                  >
                    <span className={`font-semibold ${sizeClass[size]}`}>
                      {sizeLabel[size]}
                    </span>
                    <span className="text-xs capitalize">{size}</span>
                  </button>
                );
              })}
            </div>
          </SettingSection>

          {/* Reduced Motion */}
          <SettingSection
            icon={<Sparkles className="h-4 w-4" />}
            title="Reduced Motion"
            description="Minimize animations for accessibility"
          >
            <button
              onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
              className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                settings.reducedMotion ? 'bg-accent' : 'bg-surface-tertiary'
              }`}
            >
              <motion.span
                layout
                className="inline-block h-5 w-5 rounded-full bg-[var(--color-bg-elevated)] shadow-sm"
                animate={{ x: settings.reducedMotion ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </SettingSection>

          {/* Divider */}
          <hr className="border-border" />

          {/* Export Data */}
          <SettingSection
            icon={<Download className="h-4 w-4" />}
            title="Export Data"
            description="Download all your progress and review history as JSON"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-surface hover:text-primary cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Export Settings
              </button>
              <AnimatePresence>
                {showExportSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-sm text-success"
                  >
                    <Check className="h-4 w-4" />
                    Exported
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </SettingSection>

          {/* Reset Progress */}
          <SettingSection
            icon={<Trash2 className="h-4 w-4" />}
            title="Reset Progress"
            description="Clear all learning progress and review history. This cannot be undone."
          >
            <AnimatePresence mode="wait">
              {!showResetConfirm ? (
                <motion.div key="button" exit={{ opacity: 0 }}>
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-error/30 px-4 py-2.5 text-sm font-medium text-error transition-colors hover:bg-error-subtle cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reset All Progress
                  </button>
                  <AnimatePresence>
                    {showResetSuccess && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="ml-3 inline-flex items-center gap-1 text-sm text-success"
                      >
                        <Check className="h-4 w-4" />
                        Progress reset
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="rounded-lg border border-error/30 bg-error-subtle p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Are you sure?
                      </p>
                      <p className="mt-1 text-sm text-secondary">
                        This will permanently delete all your lesson progress, review card states, and review history. This action cannot be undone.
                      </p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={handleReset}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-error px-4 py-2 text-sm font-medium text-inverse transition-colors hover:bg-error/90 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Yes, Reset Everything
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SettingSection>
        </div>
      </div>
      </PageTransition>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Setting Section Layout
// ---------------------------------------------------------------------------

function SettingSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-border bg-elevated p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-secondary mt-0.5">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">{title}</h3>
            <p className="mt-0.5 text-sm text-secondary">{description}</p>
          </div>
        </div>
      </div>
      <div className="ml-11">{children}</div>
    </motion.div>
  );
}
