'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HyperparamSearchDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

/* ------------------------------------------------------------------ */
/*  Point data for each search strategy                                */
/* ------------------------------------------------------------------ */

interface Point {
  x: number
  y: number
  best?: boolean
}

// Grid search: 5x5 regular grid
const gridPoints: Point[] = (() => {
  const pts: Point[] = []
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      pts.push({
        x: 12 + col * 28,
        y: 12 + row * 28,
        best: row === 3 && col === 2,
      })
    }
  }
  return pts
})()

// Random search: 25 scattered points with good coverage
const randomPoints: Point[] = [
  { x: 8, y: 95 },
  { x: 22, y: 18 },
  { x: 38, y: 62 },
  { x: 52, y: 110 },
  { x: 15, y: 44 },
  { x: 70, y: 30 },
  { x: 95, y: 72 },
  { x: 112, y: 14 },
  { x: 60, y: 88 },
  { x: 80, y: 55 },
  { x: 130, y: 100 },
  { x: 105, y: 42 },
  { x: 45, y: 8 },
  { x: 125, y: 65 },
  { x: 18, y: 125 },
  { x: 88, y: 118 },
  { x: 135, y: 28 },
  { x: 75, y: 10 },
  { x: 30, y: 80 },
  { x: 100, y: 90 },
  { x: 55, y: 42 },
  { x: 118, y: 50, best: true },
  { x: 42, y: 130 },
  { x: 140, y: 115 },
  { x: 65, y: 55 },
]

// Bayesian: initial exploration + convergence toward promising region (around x:90, y:60)
const bayesianPoints: Point[] = [
  // Early exploration (sparse, spread out)
  { x: 10, y: 15 },
  { x: 130, y: 120 },
  { x: 25, y: 100 },
  { x: 140, y: 20 },
  { x: 70, y: 130 },
  { x: 50, y: 30 },
  // Mid-phase: narrowing
  { x: 85, y: 75 },
  { x: 105, y: 50 },
  { x: 70, y: 55 },
  { x: 115, y: 70 },
  { x: 95, y: 40 },
  { x: 80, y: 85 },
  // Late-phase: clustering around optimum
  { x: 98, y: 58 },
  { x: 90, y: 48 },
  { x: 105, y: 62 },
  { x: 88, y: 68 },
  { x: 95, y: 55 },
  { x: 100, y: 45 },
  { x: 92, y: 52 },
  { x: 102, y: 58 },
  { x: 96, y: 62 },
  { x: 94, y: 50, best: true },
  { x: 108, y: 55 },
  { x: 86, y: 58 },
  { x: 100, y: 52 },
]

/* ------------------------------------------------------------------ */
/*  Panel configuration                                                */
/* ------------------------------------------------------------------ */

interface PanelConfig {
  title: string
  note: string
  points: Point[]
}

const panels: PanelConfig[] = [
  {
    title: 'Grid Search',
    note: 'Tests many redundant values per dimension',
    points: gridPoints,
  },
  {
    title: 'Random Search',
    note: 'More unique values per dimension',
    points: randomPoints,
  },
  {
    title: 'Bayesian',
    note: 'Focuses on promising areas',
    points: bayesianPoints,
  },
]

/* ------------------------------------------------------------------ */
/*  Layout constants                                                   */
/* ------------------------------------------------------------------ */

const panelW = 155
const panelH = 145
const panelGap = 18
const panelStartX = 15
const panelTopY = 34

// Inner search-space area within each panel
const padInner = 6
const spaceW = panelW - padInner * 2
const spaceH = panelH - padInner * 2

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function HyperparamSearchDiagram({
  className = '',
}: HyperparamSearchDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 260"
      className={className}
      role="img"
      aria-label="Comparison of hyperparameter search strategies: grid search with evenly spaced points, random search with scattered coverage, and Bayesian optimization that clusters around the best region"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Radial gradient simulating a performance landscape per panel */}
        {panels.map((_, pIdx) => {
          // Centre the "good region" slightly differently per panel
          const cx = pIdx === 2 ? '68%' : pIdx === 1 ? '78%' : '52%'
          const cy = pIdx === 2 ? '42%' : pIdx === 1 ? '38%' : '62%'
          return (
            <radialGradient
              key={`landscape-${pIdx}`}
              id={`landscape-${pIdx}`}
              cx={cx}
              cy={cy}
              r="60%"
            >
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
              <stop offset="55%" stopColor="var(--color-accent)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="var(--color-bg-tertiary)" stopOpacity="0.12" />
            </radialGradient>
          )
        })}
      </defs>

      {/* Title */}
      <motion.text
        x="280"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Hyperparameter Search Strategies
      </motion.text>

      {/* Panels */}
      {panels.map((panel, pIdx) => {
        const groupX = panelStartX + pIdx * (panelW + panelGap)

        return (
          <motion.g
            key={panel.title}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{
              duration: 0.55,
              delay: pIdx * 0.14,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Panel title */}
            <text
              x={groupX + panelW / 2}
              y={panelTopY}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11.5"
              fontWeight="600"
            >
              {panel.title}
            </text>

            {/* Panel background with performance gradient */}
            <rect
              x={groupX}
              y={panelTopY + 8}
              width={panelW}
              height={panelH}
              rx="4"
              fill={`url(#landscape-${pIdx})`}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />

            {/* Axis labels */}
            <text
              x={groupX + panelW / 2}
              y={panelTopY + panelH + 22}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
            >
              learning rate
            </text>

            <text
              x={groupX - 6}
              y={panelTopY + 8 + panelH / 2}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              transform={`rotate(-90, ${groupX - 6}, ${panelTopY + 8 + panelH / 2})`}
            >
              num units
            </text>

            {/* Search points */}
            {panel.points.map((pt, ptIdx) => {
              // Normalise point coordinates into panel-local space
              const maxDataX = pIdx === 0 ? 124 : 145
              const maxDataY = pIdx === 0 ? 124 : 135
              const cx = groupX + padInner + (pt.x / maxDataX) * spaceW
              const cy = panelTopY + 8 + padInner + (pt.y / maxDataY) * spaceH

              const isBest = !!pt.best

              return (
                <motion.circle
                  key={`p${pIdx}-${ptIdx}`}
                  cx={cx}
                  cy={cy}
                  r={isBest ? 5 : 3}
                  fill={
                    isBest
                      ? 'var(--color-accent)'
                      : 'var(--color-text-secondary)'
                  }
                  stroke={isBest ? 'var(--color-bg-primary)' : 'none'}
                  strokeWidth={isBest ? 1.5 : 0}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? { opacity: isBest ? 1 : 0.7, scale: 1 }
                      : { opacity: 0, scale: 0 }
                  }
                  transition={{
                    duration: 0.35,
                    delay: pIdx * 0.14 + ptIdx * 0.025 + 0.25,
                    ease: PRODUCTIVE_EASE,
                  }}
                />
              )
            })}

            {/* "Best" label for highlighted point */}
            {panel.points.map((pt, ptIdx) => {
              if (!pt.best) return null
              const maxDataX = pIdx === 0 ? 124 : 145
              const maxDataY = pIdx === 0 ? 124 : 135
              const cx = groupX + padInner + (pt.x / maxDataX) * spaceW
              const cy = panelTopY + 8 + padInner + (pt.y / maxDataY) * spaceH

              return (
                <motion.g
                  key={`best-${pIdx}-${ptIdx}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 3 }
                  }
                  transition={{
                    duration: 0.35,
                    delay: pIdx * 0.14 + panel.points.length * 0.025 + 0.35,
                    ease: PRODUCTIVE_EASE,
                  }}
                >
                  {/* Pulsing ring */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r="8"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={
                      isInView
                        ? { opacity: [0, 0.5, 0], scale: [0.8, 1.3, 1.3] }
                        : { opacity: 0 }
                    }
                    transition={{
                      duration: 2,
                      delay: pIdx * 0.14 + panel.points.length * 0.025 + 0.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="var(--color-accent)"
                    fontSize="9"
                    fontWeight="700"
                  >
                    best
                  </text>
                </motion.g>
              )
            })}

            {/* Panel note */}
            <motion.text
              x={groupX + panelW / 2}
              y={panelTopY + panelH + 34}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              fontStyle="italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: pIdx * 0.14 + 0.9,
              }}
            >
              {panel.note}
            </motion.text>
          </motion.g>
        )
      })}

      {/* Bottom legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <circle
          cx="195"
          cy="250"
          r="3"
          fill="var(--color-text-secondary)"
          opacity="0.7"
        />
        <text
          x="203"
          y="253"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Evaluated point
        </text>

        <circle
          cx="300"
          cy="250"
          r="5"
          fill="var(--color-accent)"
          stroke="var(--color-bg-primary)"
          strokeWidth="1.5"
        />
        <text
          x="310"
          y="253"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Best result
        </text>
      </motion.g>
    </svg>
  )
}
