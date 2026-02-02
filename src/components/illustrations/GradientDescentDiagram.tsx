'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GradientDescentDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function GradientDescentDiagram({ className = '' }: GradientDescentDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Loss curve: smooth U-shape (quadratic bezier)
  // B(t): P0=(60,180) P1=(210,60) P2=(360,180)
  // x(t) = 60 + 300t, y(t) = 180 - 240t + 240t^2
  // Curve minimum at t=0.5 -> (210, 120)
  const lossCurvePath = 'M 60 180 Q 210 60 360 180'

  // Helper: y on the bezier at a given x
  const curveY = (x: number) => {
    const t = (x - 60) / 300
    return 180 - 240 * t + 240 * t * t
  }

  // Descent points along the curve (x derived from curve equation)
  const descentPoints = [
    { x: 90, y: curveY(90), size: 8 },
    { x: 140, y: curveY(140), size: 7 },
    { x: 190, y: curveY(190), size: 6 },
    { x: 220, y: curveY(220), size: 5 },
    { x: 260, y: curveY(260), size: 4 },
  ]

  // Minimum point (at t=0.5 -> x=210)
  const minimumPoint = { x: 210, y: curveY(210) }

  // Gradient tangent lines at specific points (computed from curve derivative)
  // At x=90: slope = -0.64, y ~= 158
  // At x=190: slope = -0.107, y ~= 121
  const gradientLines = [
    { x: 90, y: curveY(90), x1: 70, y1: curveY(90) + 12.8, x2: 110, y2: curveY(90) - 12.8 },
    { x: 190, y: curveY(190), x1: 175, y1: curveY(190) + 1.6, x2: 205, y2: curveY(190) - 1.6 },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 260"
      role="img"
      aria-label="Gradient descent visualization showing a ball rolling down a loss curve to find the minimum"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <text
        x="210"
        y="20"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--color-text-primary)"
      >
        Gradient Descent
      </text>

      {/* Axes */}
      <g stroke="var(--color-border-primary)" strokeWidth="1.5" fill="none">
        {/* Y-axis */}
        <line x1="40" y1="60" x2="40" y2="200" />
        {/* X-axis */}
        <line x1="40" y1="200" x2="380" y2="200" />
      </g>

      {/* Axis labels */}
      <text
        x="20"
        y="130"
        textAnchor="middle"
        fontSize="12"
        fontWeight="500"
        fill="var(--color-text-secondary)"
        transform="rotate(-90 20 130)"
      >
        Loss
      </text>
      <text
        x="210"
        y="225"
        textAnchor="middle"
        fontSize="12"
        fontWeight="500"
        fill="var(--color-text-secondary)"
      >
        Weight value
      </text>

      {/* High Loss label */}
      <text
        x="90"
        y={curveY(90) - 18}
        textAnchor="middle"
        fontSize="10"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
      >
        High Loss
      </text>

      {/* Loss curve */}
      <motion.path
        d={lossCurvePath}
        stroke="var(--color-text-primary)"
        strokeWidth="2.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: PRODUCTIVE_EASE }}
      />

      {/* Gradient tangent lines */}
      {gradientLines.map((line, i) => (
        <g key={i}>
          <motion.line
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            opacity="0.5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.5 } : {}}
            transition={{ delay: 0.8 + i * 0.2, duration: 0.4 }}
          />
          {i === 0 && (
            <motion.text
              x={line.x1 - 10}
              y={line.y1 - 5}
              fontSize="9"
              fill="var(--color-accent)"
              fontWeight="500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.4 }}
            >
              gradient
            </motion.text>
          )}
        </g>
      ))}

      {/* Descent path arrows */}
      {descentPoints.slice(0, -1).map((point, i) => {
        const nextPoint = descentPoints[i + 1]
        const dx = nextPoint.x - point.x
        const dy = nextPoint.y - point.y
        const length = Math.sqrt(dx * dx + dy * dy)
        const arrowSize = 4
        const shortenBy = nextPoint.size + 2
        const shortenRatio = (length - shortenBy) / length

        return (
          <motion.line
            key={i}
            x1={point.x}
            y1={point.y}
            x2={point.x + dx * shortenRatio}
            y2={point.y + dy * shortenRatio}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd={`url(#arrowhead-${i})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{ delay: 1.2 + i * 0.2, duration: 0.3, ease: PRODUCTIVE_EASE }}
          />
        )
      })}

      {/* Arrow markers */}
      <defs>
        {descentPoints.slice(0, -1).map((_, i) => (
          <marker
            key={i}
            id={`arrowhead-${i}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="var(--color-accent)"
              opacity="0.6"
            />
          </marker>
        ))}
      </defs>

      {/* Descent dots */}
      {descentPoints.map((point, i) => (
        <motion.circle
          key={i}
          cx={point.x}
          cy={point.y}
          r={point.size}
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.2 + i * 0.2, duration: 0.3, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* Minimum marker with glow */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Glow effect */}
        <circle
          cx={minimumPoint.x}
          cy={minimumPoint.y}
          r="12"
          fill="var(--color-accent)"
          opacity="0.15"
        />
        <circle
          cx={minimumPoint.x}
          cy={minimumPoint.y}
          r="8"
          fill="var(--color-accent)"
          opacity="0.25"
        />

        {/* Star marker */}
        <path
          d={`M ${minimumPoint.x} ${minimumPoint.y - 5} L ${minimumPoint.x + 1.5} ${minimumPoint.y - 1.5} L ${minimumPoint.x + 5} ${minimumPoint.y} L ${minimumPoint.x + 1.5} ${minimumPoint.y + 1.5} L ${minimumPoint.x} ${minimumPoint.y + 5} L ${minimumPoint.x - 1.5} ${minimumPoint.y + 1.5} L ${minimumPoint.x - 5} ${minimumPoint.y} L ${minimumPoint.x - 1.5} ${minimumPoint.y - 1.5} Z`}
          fill="var(--color-accent)"
        />

        {/* Minimum label */}
        <text
          x={minimumPoint.x}
          y={minimumPoint.y + 25}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Minimum
        </text>
      </motion.g>

      {/* "Gradient points downhill" annotation */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 1.8, duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="310"
          y="100"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-text-secondary)"
          fontStyle="italic"
        >
          gradient points
        </text>
        <text
          x="310"
          y="112"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-text-secondary)"
          fontStyle="italic"
        >
          downhill
        </text>
        {/* Small arrow pointing down-left */}
        <path
          d="M 305 115 L 270 135"
          stroke="var(--color-text-secondary)"
          strokeWidth="1"
          fill="none"
          markerEnd="url(#annotation-arrow)"
        />
      </motion.g>

      {/* Annotation arrow marker */}
      <defs>
        <marker
          id="annotation-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon
            points="0 0, 5 2.5, 0 5"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>
    </svg>
  )
}
