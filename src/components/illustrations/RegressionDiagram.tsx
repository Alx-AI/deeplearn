'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RegressionDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function RegressionDiagram({ className = '' }: RegressionDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 200"
      role="img"
      aria-label="Comparison of classification versus regression showing discrete categories versus continuous predictions"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Left Panel - Classification */}
      <g>
        {/* Panel border */}
        <rect
          x="10"
          y="10"
          width="210"
          height="180"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="8"
        />

        {/* Title */}
        <text
          x="115"
          y="30"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Classification
        </text>

        {/* Subtitle */}
        <text
          x="115"
          y="45"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-tertiary)"
        >
          Discrete Categories
        </text>

        {/* Y-axis label */}
        <text
          x="30"
          y="75"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          Count
        </text>

        {/* Category bars */}
        {/* Cat bar - highlighted (tallest) */}
        <g>
          <motion.rect
            x="50"
            y="160"
            width="40"
            height="0"
            fill="var(--color-accent)"
            rx="3"
            initial={{ height: 0, y: 160 }}
            animate={isInView ? { height: 90, y: 70 } : { height: 0, y: 160 }}
            transition={{ duration: 0.6, delay: 0.2, ease: PRODUCTIVE_EASE }}
          />
          <text
            x="70"
            y="175"
            textAnchor="middle"
            fontSize="11"
            fontWeight="500"
            fill="var(--color-text-primary)"
          >
            Cat
          </text>
        </g>

        {/* Dog bar */}
        <g>
          <motion.rect
            x="105"
            y="160"
            width="40"
            height="0"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
            rx="3"
            initial={{ height: 0, y: 160 }}
            animate={isInView ? { height: 55, y: 105 } : { height: 0, y: 160 }}
            transition={{ duration: 0.6, delay: 0.3, ease: PRODUCTIVE_EASE }}
          />
          <text
            x="125"
            y="175"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-secondary)"
          >
            Dog
          </text>
        </g>

        {/* Bird bar */}
        <g>
          <motion.rect
            x="160"
            y="160"
            width="40"
            height="0"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
            rx="3"
            initial={{ height: 0, y: 160 }}
            animate={isInView ? { height: 35, y: 125 } : { height: 0, y: 160 }}
            transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
          />
          <text
            x="180"
            y="175"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-secondary)"
          >
            Bird
          </text>
        </g>
      </g>

      {/* Dashed divider */}
      <line
        x1="230"
        y1="20"
        x2="230"
        y2="180"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.5"
      />

      {/* Right Panel - Regression */}
      <g>
        {/* Panel border */}
        <rect
          x="240"
          y="10"
          width="210"
          height="180"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="8"
        />

        {/* Title */}
        <text
          x="345"
          y="30"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Regression
        </text>

        {/* Subtitle */}
        <text
          x="345"
          y="45"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-tertiary)"
        >
          Continuous Prediction
        </text>

        {/* Y-axis label */}
        <text
          x="255"
          y="65"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          Price
        </text>

        {/* X-axis label */}
        <text
          x="415"
          y="175"
          textAnchor="end"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          Size
        </text>

        {/* Axes */}
        <line
          x1="270"
          y1="160"
          x2="425"
          y2="160"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <line
          x1="270"
          y1="60"
          x2="270"
          y2="160"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Scatter points */}
        {[
          { x: 285, y: 145 },
          { x: 300, y: 135 },
          { x: 310, y: 130 },
          { x: 325, y: 118 },
          { x: 340, y: 110 },
          { x: 355, y: 100 },
          { x: 370, y: 88 },
          { x: 385, y: 80 },
          { x: 400, y: 72 },
        ].map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05, ease: PRODUCTIVE_EASE }}
          />
        ))}

        {/* Regression line */}
        <motion.line
          x1="275"
          y1="150"
          x2="410"
          y2="65"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: PRODUCTIVE_EASE }}
          style={{
            strokeDasharray: '1',
            strokeDashoffset: '1',
          }}
        />

        {/* Predicted point on line */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          {/* Highlight circle */}
          <circle
            cx="360"
            cy="95"
            r="8"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="0.6"
          />
          {/* Point */}
          <circle
            cx="360"
            cy="95"
            r="4"
            fill="var(--color-accent)"
          />
          {/* Label */}
          <text
            x="360"
            y="85"
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="var(--color-accent)"
          >
            Prediction
          </text>
        </motion.g>
      </g>
    </svg>
  )
}
