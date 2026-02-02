'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LinearClassifierDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function LinearClassifierDiagram({ className }: LinearClassifierDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Class A points (filled circles) - bottom left region
  const classAPoints = [
    { x: 60, y: 220 },
    { x: 80, y: 200 },
    { x: 100, y: 210 },
    { x: 120, y: 190 },
    { x: 90, y: 170 },
    { x: 140, y: 180 },
  ]

  // Class B points (open circles) - top right region
  const classBPoints = [
    { x: 200, y: 100 },
    { x: 220, y: 90 },
    { x: 240, y: 110 },
    { x: 260, y: 80 },
    { x: 280, y: 100 },
    { x: 250, y: 120 },
  ]

  // Decision boundary line - diagonal from top-left to bottom-right
  // Line equation approximately: y = -0.8x + 280
  const boundaryPath = 'M 40 248 L 320 24'

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 360 280"
        role="img"
        aria-label="Linear classifier diagram showing a decision boundary separating two classes of data points"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Background shaded region (Class A side - below the line) */}
        <motion.path
          d="M 40 248 L 320 24 L 320 280 L 40 280 Z"
          fill="var(--color-accent-subtle)"
          opacity="0.15"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Axes */}
        <line
          x1="40"
          y1="40"
          x2="40"
          y2="260"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="260"
          x2="320"
          y2="260"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />

        {/* Y-axis tick marks */}
        {[80, 140, 200].map((y, i) => (
          <line
            key={`y-tick-${i}`}
            x1="36"
            y1={y}
            x2="40"
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
        ))}

        {/* X-axis tick marks */}
        {[100, 160, 220, 280].map((x, i) => (
          <line
            key={`x-tick-${i}`}
            x1={x}
            y1="260"
            x2={x}
            y2="264"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
        ))}

        {/* Class A points (filled circles) */}
        {classAPoints.map((point, i) => (
          <motion.circle
            key={`class-a-${i}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="var(--color-accent)"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.06,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Class B points (open circles) */}
        {classBPoints.map((point, i) => (
          <motion.circle
            key={`class-b-${i}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: (classAPoints.length + i) * 0.06,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Decision boundary line */}
        <motion.path
          d={boundaryPath}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: PRODUCTIVE_EASE,
          }}
        />

        {/* Labels */}
        <motion.text
          x="90"
          y="240"
          fontSize="12"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          Class A
        </motion.text>

        <motion.text
          x="250"
          y="70"
          fontSize="12"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          Class B
        </motion.text>

        <motion.text
          x="200"
          y="150"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          Decision Boundary
        </motion.text>
      </svg>
    </div>
  )
}
