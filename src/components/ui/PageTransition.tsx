'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * PageTransition
 *
 * Wraps page content with a fade-in + slide-up entrance animation.
 * Apply this as the outermost wrapper inside each page component
 * for consistent page-level motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.2, 0, 0.38, 0.9],
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
