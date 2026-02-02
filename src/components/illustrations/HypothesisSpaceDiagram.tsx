'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HypothesisSpaceDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function HypothesisSpaceDiagram({ className }: HypothesisSpaceDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Search arrow paths within each region
  // Small curved arrows suggesting exploration/search
  const linearSearchArrows = [
    { d: 'M 216 162 Q 222 152, 232 156', delay: 1.4 },
    { d: 'M 248 168 Q 254 176, 246 180', delay: 1.6 },
  ]

  const treeSearchArrows = [
    { d: 'M 170 118 Q 180 108, 190 114', delay: 1.8 },
    { d: 'M 290 170 Q 298 160, 308 166', delay: 2.0 },
    { d: 'M 200 198 Q 192 206, 200 212', delay: 2.2 },
  ]

  const nnSearchArrows = [
    { d: 'M 100 100 Q 112 90, 120 98', delay: 2.4 },
    { d: 'M 370 130 Q 378 120, 388 126', delay: 2.6 },
    { d: 'M 140 228 Q 132 236, 140 242', delay: 2.8 },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 280"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
      role="img"
      aria-label="Hypothesis space diagram showing nested regions for Linear Models, Decision Trees, and Neural Networks, with a target function inside the largest region"
    >
      <defs>
        {/* Arrowhead marker for search arrows */}
        <marker
          id="arrowhead-hypothesis-space"
          markerWidth="6"
          markerHeight="5"
          refX="5"
          refY="2.5"
          orient="auto"
        >
          <path
            d="M 0 0 L 6 2.5 L 0 5 Z"
            fill="var(--color-text-tertiary)"
          />
        </marker>

        {/* Arrowhead for accent-colored arrows */}
        <marker
          id="arrowhead-hypothesis-space-accent"
          markerWidth="6"
          markerHeight="5"
          refX="5"
          refY="2.5"
          orient="auto"
        >
          <path
            d="M 0 0 L 6 2.5 L 0 5 Z"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* ── Neural Networks region (largest, outermost) ── */}
      <motion.ellipse
        cx="240"
        cy="150"
        rx="210"
        ry="120"
        fill="var(--color-bg-tertiary)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="6,3"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Decision Trees region (medium, middle) ── */}
      <motion.ellipse
        cx="238"
        cy="155"
        rx="138"
        ry="78"
        fill="var(--color-accent-subtle)"
        fillOpacity="0.25"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Linear Models region (smallest, innermost) ── */}
      <motion.ellipse
        cx="236"
        cy="164"
        rx="62"
        ry="36"
        fill="var(--color-accent-subtle)"
        fillOpacity="0.35"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Region labels ── */}

      {/* Neural Networks label (top-left of outer ellipse) */}
      <motion.text
        x="68"
        y="52"
        fontSize="12"
        fontWeight="600"
        fill="var(--color-text-primary)"
        textAnchor="start"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        Neural Networks
      </motion.text>
      <motion.text
        x="68"
        y="66"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        textAnchor="start"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        (largest hypothesis space)
      </motion.text>

      {/* Decision Trees label (top-right area of middle ellipse) */}
      <motion.text
        x="330"
        y="90"
        fontSize="12"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        textAnchor="start"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        Decision Trees
      </motion.text>

      {/* Linear Models label (inside the smallest ellipse) */}
      <motion.text
        x="236"
        y="160"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-accent)"
        textAnchor="middle"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Linear Models
      </motion.text>
      <motion.text
        x="236"
        y="173"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        textAnchor="middle"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        (smallest)
      </motion.text>

      {/* ── Target Function star ── */}
      {/* Positioned in the neural network region but outside the decision tree region */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Star shape */}
        <motion.polygon
          points="390,170 393,179 402,179 395,185 397,194 390,189 383,194 385,185 378,179 387,179"
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth="0.5"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Subtle glow behind the star */}
        <motion.circle
          cx="390"
          cy="183"
          r="10"
          fill="var(--color-accent)"
          opacity="0.15"
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Target function label */}
        <motion.text
          x="390"
          y="208"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-accent)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          Target
        </motion.text>
        <motion.text
          x="390"
          y="220"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-accent)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          Function
        </motion.text>
      </motion.g>

      {/* ── Search arrows within Linear Models region ── */}
      {linearSearchArrows.map((arrow, i) => (
        <motion.path
          key={`linear-search-${i}`}
          d={arrow.d}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-hypothesis-space-accent)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: arrow.delay, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* ── Search arrows within Decision Trees region ── */}
      {treeSearchArrows.map((arrow, i) => (
        <motion.path
          key={`tree-search-${i}`}
          d={arrow.d}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-hypothesis-space)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: arrow.delay, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* ── Search arrows within Neural Networks region ── */}
      {nnSearchArrows.map((arrow, i) => (
        <motion.path
          key={`nn-search-${i}`}
          d={arrow.d}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeLinecap="round"
          markerEnd="url(#arrowhead-hypothesis-space)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: arrow.delay, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* ── Annotation: "Architecture defines the boundary" ── */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 3.0, ease: PRODUCTIVE_EASE }}
      >
        {/* Callout line from outer boundary to annotation */}
        <line
          x1="136"
          y1="258"
          x2="170"
          y2="248"
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.5"
        />
        <text
          x="28"
          y="272"
          fontSize="9.5"
          fill="var(--color-text-tertiary)"
          textAnchor="start"
          fontStyle="italic"
        >
          Architecture defines the search boundary
        </text>
      </motion.g>

      {/* ── Annotation: Search label ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 3.2, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="170"
          y="112"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          fontStyle="italic"
        >
          search
        </text>
        {/* Small arrow pointing to search arrows area */}
        <line
          x1="180"
          y1="114"
          x2="186"
          y2="116"
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.6"
        />
      </motion.g>
    </svg>
  )
}
