'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HypeCycleDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function HypeCycleDiagram({ className = '' }: HypeCycleDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Define the hype cycle curve path
  const hypeCurvePath = 'M 50 200 Q 100 150 120 100 T 180 80 Q 220 70 240 120 T 280 180 Q 320 200 360 210 T 450 220'

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 280"
      className={className}
      role="img"
      aria-label="AI Hype Cycle Diagram showing the evolution of AI expectations over time"
      style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
    >
      {/* Background */}
      <rect width="500" height="280" fill="var(--color-bg-elevated)" />

      {/* Grid lines */}
      <g stroke="var(--color-border-primary)" strokeWidth="0.5" opacity="0.3">
        <line x1="50" y1="60" x2="450" y2="60" />
        <line x1="50" y1="100" x2="450" y2="100" />
        <line x1="50" y1="140" x2="450" y2="140" />
        <line x1="50" y1="180" x2="450" y2="180" />
        <line x1="50" y1="220" x2="450" y2="220" />
      </g>

      {/* Axes */}
      <g stroke="var(--color-text-tertiary)" strokeWidth="2">
        {/* Y-axis */}
        <line x1="50" y1="40" x2="50" y2="240" />
        {/* X-axis */}
        <line x1="50" y1="240" x2="460" y2="240" />
      </g>

      {/* Axis labels */}
      <text
        x="20"
        y="140"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        textAnchor="middle"
        transform="rotate(-90 20 140)"
      >
        Expectations
      </text>
      <text
        x="250"
        y="260"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        textAnchor="middle"
      >
        Time
      </text>

      {/* Hype cycle curve */}
      <motion.path
        d={hypeCurvePath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, ease: PRODUCTIVE_EASE }}
      />

      {/* Phase labels along the bottom */}
      <g fill="var(--color-text-tertiary)" fontSize="9" fontFamily="var(--font-sans)" textAnchor="middle">
        <text x="85" y="255">Innovation</text>
        <text x="85" y="263">Trigger</text>

        <text x="170" y="255">Peak of</text>
        <text x="170" y="263">Hype</text>

        <text x="250" y="259">Trough</text>

        <text x="330" y="255">Slope of</text>
        <text x="330" y="263">Enlightenment</text>

        <text x="415" y="259">Plateau</text>
      </g>

      {/* Milestone markers */}
      {isInView && (
        <>
          {/* Early AI (1960s) - near first peak */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4, ease: PRODUCTIVE_EASE }}
          >
            <circle cx="180" cy="80" r="4" fill="var(--color-accent)" />
            <text
              x="180"
              y="65"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
              fontWeight="500"
            >
              Early AI
            </text>
            <text
              x="180"
              y="74"
              fill="var(--color-text-secondary)"
              fontSize="9"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
            >
              (1960s)
            </text>
          </motion.g>

          {/* AI Winters - in the trough */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.4, ease: PRODUCTIVE_EASE }}
          >
            <circle cx="260" cy="150" r="4" fill="var(--color-accent)" />
            <text
              x="260"
              y="168"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
              fontWeight="500"
            >
              AI Winters
            </text>
          </motion.g>

          {/* Deep Learning - on the rising plateau */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.4, ease: PRODUCTIVE_EASE }}
          >
            <circle cx="380" cy="215" r="4" fill="var(--color-accent)" />
            <text
              x="380"
              y="203"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontFamily="var(--font-sans)"
              textAnchor="middle"
              fontWeight="500"
            >
              Deep Learning
            </text>
          </motion.g>
        </>
      )}
    </svg>
  )
}
