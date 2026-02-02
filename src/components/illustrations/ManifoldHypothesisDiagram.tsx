'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ManifoldHypothesisDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ManifoldHypothesisDiagram({ className }: ManifoldHypothesisDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Define the curved manifold path (smooth flowing surface)
  const manifoldPath = 'M 80 180 Q 120 140, 160 150 T 280 120 Q 300 110, 320 140'

  // Points on the manifold (along the curve)
  const onManifoldPoints = [
    { x: 80, y: 180 },
    { x: 110, y: 155 },
    { x: 140, y: 145 },
    { x: 170, y: 150 },
    { x: 200, y: 140 },
    { x: 230, y: 125 },
    { x: 260, y: 115 },
    { x: 290, y: 120 },
    { x: 310, y: 135 },
  ]

  // Points off the manifold (improbable data)
  const offManifoldPoints = [
    { x: 150, y: 220 },
    { x: 280, y: 80 },
    { x: 100, y: 90 },
  ]

  // Grid lines for 3D space suggestion
  const gridLines = {
    horizontal: [60, 100, 140, 180, 220],
    vertical: [60, 100, 140, 180, 220, 260, 300, 340],
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 280"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
      role="img"
      aria-label="Manifold hypothesis diagram showing data points clustered along a curved 2D manifold embedded in 3D space"
    >
      <defs>
        {/* Gradient for manifold surface */}
        <linearGradient id="manifoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-subtle)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent-subtle)" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* Background grid suggesting 3D space */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Horizontal grid lines */}
        {gridLines.horizontal.map((y, i) => (
          <line
            key={`h-${i}`}
            x1="40"
            y1={y}
            x2="360"
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {/* Vertical grid lines */}
        {gridLines.vertical.map((x, i) => (
          <line
            key={`v-${i}`}
            x1={x}
            y1="40"
            x2={x}
            y2="240"
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.2"
          />
        ))}

        {/* Diagonal lines for depth perception */}
        <line x1="40" y1="240" x2="80" y2="220" stroke="var(--color-border-primary)" strokeWidth="0.5" opacity="0.15" />
        <line x1="360" y1="240" x2="340" y2="220" stroke="var(--color-border-primary)" strokeWidth="0.5" opacity="0.15" />
      </motion.g>

      {/* Manifold surface */}
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Manifold ribbon/surface with thickness */}
        <motion.path
          d={manifoldPath}
          fill="none"
          stroke="url(#manifoldGradient)"
          strokeWidth="35"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Manifold outline */}
        <motion.path
          d={manifoldPath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </motion.g>

      {/* On-manifold points (valid data) */}
      {onManifoldPoints.map((point, i) => (
        <motion.circle
          key={`on-${i}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.8 + i * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Off-manifold points (improbable data) */}
      {offManifoldPoints.map((point, i) => (
        <motion.circle
          key={`off-${i}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: 1.2 + i * 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Labels */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Data manifold label */}
        <text
          x="200"
          y="35"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-accent)"
          textAnchor="middle"
        >
          Data manifold
        </text>

        {/* Valid data label */}
        <text
          x="340"
          y="155"
          fontSize="11"
          fill="var(--color-text-primary)"
          textAnchor="end"
        >
          Valid data
        </text>
        <text
          x="340"
          y="168"
          fontSize="11"
          fill="var(--color-text-secondary)"
          textAnchor="end"
        >
          (on manifold)
        </text>

        {/* Improbable data label */}
        <text
          x="60"
          y="85"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="start"
        >
          Improbable
        </text>
        <text
          x="60"
          y="98"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="start"
        >
          (off manifold)
        </text>

        {/* Connector line to off-manifold point */}
        <line
          x1="60"
          y1="92"
          x2="95"
          y2="90"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeDasharray="2,2"
          opacity="0.4"
        />
      </motion.g>
    </svg>
  )
}
