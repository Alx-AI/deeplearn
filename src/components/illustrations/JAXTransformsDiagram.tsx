'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface JAXTransformsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function JAXTransformsDiagram({ className }: JAXTransformsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 280"
      className={className}
      role="img"
      aria-label="JAX function transformations diagram showing jit, grad, and vmap"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Center function box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx="210"
          cy="140"
          r="32"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />
        <text
          x="210"
          y="145"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="16"
          fontWeight="600"
        >
          f(x)
        </text>
      </motion.g>

      {/* Arrow to jit (top) */}
      <motion.path
        d="M 210 108 Q 210 70 210 50"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="210,50 206,58 214,58"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow to grad (left) */}
      <motion.path
        d="M 180 135 Q 120 135 80 135"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="80,135 88,131 88,139"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow to vmap (right) */}
      <motion.path
        d="M 240 135 Q 300 135 340 135"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="340,135 332,131 332,139"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* jit(f) - Top */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="150"
          y="10"
          width="120"
          height="36"
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Lightning bolt icon */}
        <path
          d="M 167 22 L 163 28 L 167 28 L 165 34 L 171 26 L 167 26 L 169 22 Z"
          fill="var(--color-accent)"
        />
        <text
          x="180"
          y="24"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          jit(f)
        </text>
        <text
          x="180"
          y="38"
          fill="var(--color-text-secondary)"
          fontSize="11"
        >
          Compiled & Fast
        </text>
      </motion.g>

      {/* grad(f) - Left */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="10"
          y="115"
          width="66"
          height="36"
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Gradient/slope icon */}
        <path
          d="M 23 139 L 31 127"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon
          points="31,127 29,131 33,130"
          fill="var(--color-accent)"
        />
        <text
          x="43"
          y="128"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          grad(f)
        </text>
        <text
          x="43"
          y="142"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
        >
          Gradients
        </text>
      </motion.g>

      {/* vmap(f) - Right */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="344"
          y="115"
          width="66"
          height="36"
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Batch/parallel lines icon */}
        <g stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="355" y1="127" x2="365" y2="127" />
          <line x1="355" y1="133" x2="365" y2="133" />
          <line x1="355" y1="139" x2="365" y2="139" />
        </g>
        <text
          x="377"
          y="128"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          vmap(f)
        </text>
        <text
          x="377"
          y="142"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
        >
          Batched
        </text>
      </motion.g>
    </svg>
  );
}
