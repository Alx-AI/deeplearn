'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface OverfittingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function OverfittingDiagram({ className }: OverfittingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Pre-computed data points for each plot (following a quadratic-ish trend with noise)
  const dataPoints = [
    { x: 20, y: 85 },
    { x: 35, y: 78 },
    { x: 50, y: 68 },
    { x: 65, y: 55 },
    { x: 80, y: 48 },
    { x: 95, y: 45 },
    { x: 110, y: 50 },
    { x: 125, y: 58 },
    { x: 140, y: 70 },
    { x: 155, y: 85 },
  ]

  // Underfitting: Simple straight line (linear fit that misses the curve)
  const underfitPath = 'M 20 100 L 155 80'

  // Good fit: Smooth curve that captures the general trend
  const goodFitPath = 'M 20 105 Q 50 90 80 68 T 155 105'

  // Overfitting: Wiggly curve that passes through every point
  const overfitPath = `M 20 105
    L 35 98
    Q 42 92 50 88
    Q 57 81 65 75
    Q 72 71 80 68
    Q 87 66 95 65
    Q 102 67 110 70
    Q 117 74 125 78
    Q 132 84 140 90
    Q 147 97 155 105`

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 200"
      role="img"
      aria-label="Diagram showing underfitting versus good fit versus overfitting on three side-by-side plots"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Plot 1: Underfitting */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Plot background */}
        <rect
          x="5"
          y="20"
          width="160"
          height="130"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1="15"
          y1="140"
          x2="165"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="15"
          y1="30"
          x2="15"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y + 20}
            r="3"
            fill="var(--color-text-secondary)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.05, ease: PRODUCTIVE_EASE }}
          />
        ))}

        {/* Underfit line */}
        <motion.path
          d={underfitPath}
          stroke="var(--color-text-tertiary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <text
          x="85"
          y="175"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="14"
          fontWeight="500"
        >
          Underfitting
        </text>
      </motion.g>

      {/* Plot 2: Good Fit */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {/* Plot background with accent highlight */}
        <rect
          x="180"
          y="20"
          width="160"
          height="130"
          fill="var(--color-accent)"
          opacity="0.05"
          rx="4"
        />
        <rect
          x="180"
          y="20"
          width="160"
          height="130"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          rx="4"
          opacity="0.4"
        />

        {/* Axes */}
        <line
          x1="190"
          y1="140"
          x2="340"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="190"
          y1="30"
          x2="190"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x + 175}
            cy={point.y + 20}
            r="3"
            fill="var(--color-text-secondary)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.75 + i * 0.05, ease: PRODUCTIVE_EASE }}
          />
        ))}

        {/* Good fit curve */}
        <motion.path
          d={goodFitPath}
          transform="translate(175, 0)"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.35, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <text
          x="260"
          y="175"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="14"
          fontWeight="600"
        >
          Good Fit
        </text>
      </motion.g>

      {/* Plot 3: Overfitting */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Plot background */}
        <rect
          x="355"
          y="20"
          width="160"
          height="130"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1="365"
          y1="140"
          x2="515"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="365"
          y1="30"
          x2="365"
          y2="140"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x + 345}
            cy={point.y + 20}
            r="3"
            fill="var(--color-text-secondary)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.05, ease: PRODUCTIVE_EASE }}
          />
        ))}

        {/* Overfit wiggly curve */}
        <motion.path
          d={overfitPath}
          transform="translate(345, 0)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 1, delay: 1.5, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <text
          x="435"
          y="175"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="14"
          fontWeight="500"
        >
          Overfitting
        </text>
      </motion.g>
    </svg>
  )
}
