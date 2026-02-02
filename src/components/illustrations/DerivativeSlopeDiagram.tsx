'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface DerivativeSlopeDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function DerivativeSlopeDiagram({ className = '' }: DerivativeSlopeDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // --- Parabola in SVG coordinates ---
  // In SVG, y increases downward. We model a U-shaped loss curve as:
  //   svgY(x) = -a * (x - h)^2 + k
  // where (h, k) is the bottom of the U (minimum loss, largest SVG y).
  // The mathematical derivative of the loss function is positive right of
  // the minimum and negative left of it. The SVG tangent slope is the
  // negative of the mathematical slope.
  const h = 230 // x-centre of parabola
  const k = 235 // SVG y at the minimum (near the x-axis at y=250)
  const a = 0.0035

  // SVG y-coordinate on the curve
  const svgY = (x: number) => -a * (x - h) * (x - h) + k

  // SVG tangent slope (dy_svg / dx)
  const svgSlope = (x: number) => -2 * a * (x - h)

  // Generate smooth parabola path from x=60 to x=400
  const curvePoints: string[] = []
  for (let x = 60; x <= 400; x += 2) {
    curvePoints.push(`${x},${svgY(x).toFixed(2)}`)
  }
  const curvePath = `M ${curvePoints[0]} ${curvePoints.slice(1).map((p) => `L ${p}`).join(' ')}`

  // --- Key points ---

  // Right-side point (mathematical derivative > 0, loss increasing rightward)
  const ptRightX = 320
  const ptRightSvgY = svgY(ptRightX) // ~206.7

  // Left-side point (mathematical derivative < 0, loss decreasing rightward)
  const ptLeftX = 140
  const ptLeftSvgY = svgY(ptLeftX) // ~206.7

  // Minimum of the loss curve
  const minX = h
  const minSvgY = k

  // --- Tangent line helper ---
  const tangentLine = (cx: number, cy: number, slope: number, halfW: number) => ({
    x1: cx - halfW,
    y1: cy - slope * halfW,
    x2: cx + halfW,
    y2: cy + slope * halfW,
  })

  const tangentHalfW = 45
  const tangentRight = tangentLine(ptRightX, ptRightSvgY, svgSlope(ptRightX), tangentHalfW)
  const tangentLeft = tangentLine(ptLeftX, ptLeftSvgY, svgSlope(ptLeftX), tangentHalfW)

  // --- Star path generator ---
  const starPath = (cx: number, cy: number, outerR: number, innerR: number, points: number) => {
    const pts: string[] = []
    for (let i = 0; i < points * 2; i++) {
      const angle = -Math.PI / 2 + (Math.PI / points) * i
      const r = i % 2 === 0 ? outerR : innerR
      pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`)
    }
    return `M ${pts.join(' L ')} Z`
  }

  // --- Animation timing (sequential: curve -> tangents -> labels) ---
  const curveDelay = 0
  const curveDuration = 1.0
  const tangentDelay = curveDuration + 0.2
  const tangentDuration = 0.5
  const labelDelay = tangentDelay + tangentDuration + 0.15
  const labelDuration = 0.5

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 280"
      role="img"
      aria-label="Derivative as slope diagram showing a U-shaped loss curve with tangent lines at two points and the minimum where the derivative equals zero"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-derivative"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* ========== Axes ========== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Y-axis */}
        <line
          x1="45"
          y1="30"
          x2="45"
          y2="250"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        {/* X-axis */}
        <line
          x1="45"
          y1="250"
          x2="430"
          y2="250"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        {/* Y-axis arrow tick */}
        <polyline
          points="42,35 45,28 48,35"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* X-axis arrow tick */}
        <polyline
          points="425,247 432,250 425,253"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Y-axis label */}
        <text
          x="18"
          y="140"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-text-secondary)"
          transform="rotate(-90, 18, 140)"
        >
          Loss
        </text>
        {/* X-axis label */}
        <text
          x="237"
          y="270"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          Parameter value
        </text>
      </motion.g>

      {/* ========== Curve fill (subtle area under curve) ========== */}
      <motion.path
        d={`${curvePath} L 400,250 L 60,250 Z`}
        fill="var(--color-bg-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.45 } : {}}
        transition={{ duration: 0.8, delay: curveDelay + 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* ========== U-shaped loss curve ========== */}
      <motion.path
        d={curvePath}
        stroke="var(--color-text-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: curveDuration, delay: curveDelay, ease: PRODUCTIVE_EASE }}
      />

      {/* ========================================================
          Right-side point (positive mathematical slope)
          The tangent visually tilts upward left-to-right in chart
          space, meaning loss increases as parameter increases.
          ======================================================== */}

      {/* Tangent line */}
      <motion.line
        x1={tangentRight.x1}
        y1={tangentRight.y1}
        x2={tangentRight.x2}
        y2={tangentRight.y2}
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
        transition={{ duration: tangentDuration, delay: tangentDelay, ease: PRODUCTIVE_EASE }}
      />

      {/* Dot on the curve */}
      <motion.circle
        cx={ptRightX}
        cy={ptRightSvgY}
        r="5"
        fill="var(--color-accent)"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: tangentDelay + 0.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Slope label */}
      <motion.text
        x={tangentRight.x2 + 6}
        y={tangentRight.y2 - 4}
        fontSize="10"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0, x: 5 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay, ease: PRODUCTIVE_EASE }}
      >
        slope &gt; 0
      </motion.text>

      {/* "Move left" arrow and annotation */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay + 0.15, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={ptRightX - 8}
          y1={ptRightSvgY - 30}
          x2={ptRightX - 48}
          y2={ptRightSvgY - 30}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-derivative)"
        />
        <text
          x={ptRightX - 28}
          y={ptRightSvgY - 38}
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          fill="var(--color-text-secondary)"
        >
          Move this way
        </text>
        <text
          x={ptRightX - 28}
          y={ptRightSvgY - 19}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="500"
          fill="var(--color-text-tertiary)"
        >
          to decrease f(x)
        </text>
      </motion.g>

      {/* ========================================================
          Left-side point (negative mathematical slope)
          The tangent visually tilts downward left-to-right in chart
          space, meaning loss decreases as parameter increases.
          ======================================================== */}

      {/* Tangent line */}
      <motion.line
        x1={tangentLeft.x1}
        y1={tangentLeft.y1}
        x2={tangentLeft.x2}
        y2={tangentLeft.y2}
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.9 } : {}}
        transition={{ duration: tangentDuration, delay: tangentDelay + 0.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Dot on the curve */}
      <motion.circle
        cx={ptLeftX}
        cy={ptLeftSvgY}
        r="5"
        fill="var(--color-accent)"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: tangentDelay + 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Slope label */}
      <motion.text
        x={tangentLeft.x1 - 6}
        y={tangentLeft.y1 - 4}
        fontSize="10"
        fontWeight="600"
        fill="var(--color-accent)"
        textAnchor="end"
        initial={{ opacity: 0, x: -5 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay + 0.1, ease: PRODUCTIVE_EASE }}
      >
        slope &lt; 0
      </motion.text>

      {/* "Move right" arrow and annotation */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay + 0.25, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={ptLeftX + 8}
          y1={ptLeftSvgY - 30}
          x2={ptLeftX + 48}
          y2={ptLeftSvgY - 30}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-derivative)"
        />
        <text
          x={ptLeftX + 28}
          y={ptLeftSvgY - 38}
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          fill="var(--color-text-secondary)"
        >
          Move this way
        </text>
        <text
          x={ptLeftX + 28}
          y={ptLeftSvgY - 19}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="500"
          fill="var(--color-text-tertiary)"
        >
          to decrease f(x)
        </text>
      </motion.g>

      {/* ========================================================
          Minimum point (derivative = 0)
          ======================================================== */}

      {/* Glow ring */}
      <motion.circle
        cx={minX}
        cy={minSvgY}
        r="14"
        fill="var(--color-accent-subtle)"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.5 } : {}}
        transition={{ duration: 0.4, delay: labelDelay + 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Star marker */}
      <motion.path
        d={starPath(minX, minSvgY, 7, 3, 5)}
        fill="var(--color-accent)"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: labelDelay + 0.35, ease: PRODUCTIVE_EASE }}
      />

      {/* Minimum label (to the right of the star, above the x-axis) */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay + 0.4, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={minX + 24}
          y={minSvgY - 8}
          textAnchor="start"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          Minimum
        </text>
        <text
          x={minX + 24}
          y={minSvgY + 5}
          textAnchor="start"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-text-tertiary)"
        >
          (derivative = 0)
        </text>
      </motion.g>

      {/* ========== Title annotation ========== */}
      <motion.text
        x="230"
        y="22"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: labelDuration, delay: labelDelay + 0.5, ease: PRODUCTIVE_EASE }}
      >
        derivative = slope of tangent line
      </motion.text>
    </svg>
  )
}
