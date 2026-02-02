'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface CoordinateTransformDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function CoordinateTransformDiagram({
  className = '',
}: CoordinateTransformDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Original space: intermixed/swirled dots (can't be separated by a line)
  const originalBlackDots = [
    { x: 40, y: 80 },
    { x: 60, y: 120 },
    { x: 50, y: 160 },
    { x: 80, y: 100 },
    { x: 90, y: 140 },
  ]

  const originalWhiteDots = [
    { x: 70, y: 60 },
    { x: 100, y: 80 },
    { x: 110, y: 120 },
    { x: 80, y: 160 },
    { x: 120, y: 100 },
  ]

  // Transformed space: cleanly separated
  const transformedBlackDots = [
    { x: 320, y: 60 },
    { x: 340, y: 80 },
    { x: 330, y: 100 },
    { x: 350, y: 120 },
    { x: 360, y: 140 },
  ]

  const transformedWhiteDots = [
    { x: 420, y: 80 },
    { x: 440, y: 100 },
    { x: 450, y: 120 },
    { x: 460, y: 140 },
    { x: 430, y: 160 },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 220"
      className={className}
      role="img"
      aria-label="Coordinate transformation diagram showing how a linear transformation can make data linearly separable"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Left Panel - Original Space */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Title */}
        <text
          x="80"
          y="25"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="600"
        >
          Original Space
        </text>

        {/* Border */}
        <rect
          x="10"
          y="40"
          width="150"
          height="160"
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1="20"
          y1="190"
          x2="150"
          y2="190"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="20"
          y1="50"
          x2="20"
          y2="190"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
      </motion.g>

      {/* Original Black Dots */}
      {originalBlackDots.map((dot, i) => (
        <motion.circle
          key={`orig-black-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="5"
          fill="var(--color-text-primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.3 + i * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Original White Dots */}
      {originalWhiteDots.map((dot, i) => (
        <motion.circle
          key={`orig-white-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="5"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.3 + i * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Transform Arrow */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <defs>
          <marker
            id="arrowhead-coord-transform"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="var(--color-accent)"
            />
          </marker>
        </defs>
        <line
          x1="180"
          y1="120"
          x2="270"
          y2="120"
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-coord-transform)"
        />
        <text
          x="225"
          y="110"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          transform
        </text>
      </motion.g>

      {/* Right Panel - Transformed Space */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Title */}
        <text
          x="385"
          y="25"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="600"
        >
          Transformed Space
        </text>

        {/* Border */}
        <rect
          x="300"
          y="40"
          width="170"
          height="160"
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1="310"
          y1="190"
          x2="460"
          y2="190"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="310"
          y1="50"
          x2="310"
          y2="190"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Separator Line (dashed) */}
        <motion.line
          x1="395"
          y1="50"
          x2="395"
          y2="190"
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeDasharray="6 4"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={
            isInView ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }
          }
          transition={{
            duration: 0.6,
            delay: 1.0,
            ease: PRODUCTIVE_EASE,
          }}
          style={{ transformOrigin: '395px 120px' }}
        />
      </motion.g>

      {/* Transformed Black Dots */}
      {transformedBlackDots.map((dot, i) => (
        <motion.circle
          key={`trans-black-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="5"
          fill="var(--color-text-primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.7 + i * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Transformed White Dots */}
      {transformedWhiteDots.map((dot, i) => (
        <motion.circle
          key={`trans-white-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="5"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 0.7 + i * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}
    </svg>
  )
}
