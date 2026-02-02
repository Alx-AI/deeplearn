'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TrainingLoopDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TrainingLoopDiagram({ className = '' }: TrainingLoopDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 340"
      className={className}
      role="img"
      aria-label="Training loop diagram showing the iterative process of forward pass, loss computation, backward pass, and weight updates"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrow marker */}
        <marker
          id="arrowhead-training-loop"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L9,3 z"
            fill="var(--color-accent)"
          />
        </marker>

        {/* Glow filter for center */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Central Weights label with glow */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx="200"
          cy="170"
          r="35"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          opacity="0.3"
          filter="url(#glow)"
        />
        <text
          x="200"
          y="170"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-accent)"
          fontSize="13"
          fontWeight="600"
        >
          Weights
        </text>
        <text
          x="200"
          y="185"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          θ (parameters)
        </text>
      </motion.g>

      {/* Box 1: Forward Pass (top) */}
      <motion.g
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="140"
          y="30"
          width="120"
          height="50"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="200"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          Forward Pass
        </text>
        <text
          x="200"
          y="63"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          ŷ = f(x, θ)
        </text>
      </motion.g>

      {/* Box 2: Compute Loss (right) */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="280"
          y="145"
          width="105"
          height="50"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="332.5"
          y="165"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          Compute Loss
        </text>
        <text
          x="332.5"
          y="178"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          L(ŷ, y)
        </text>
      </motion.g>

      {/* Box 3: Backward Pass (bottom) */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="140"
          y="260"
          width="120"
          height="50"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="200"
          y="280"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          Backward Pass
        </text>
        <text
          x="200"
          y="293"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          ∇θL
        </text>
      </motion.g>

      {/* Box 4: Update Weights (left) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="15"
          y="145"
          width="105"
          height="50"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="67.5"
          y="165"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          Update Weights
        </text>
        <text
          x="67.5"
          y="178"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          θ := θ - α∇θL
        </text>
      </motion.g>

      {/* Arrow 1: Forward Pass → Compute Loss */}
      <motion.path
        d="M 260 55 L 280 55 Q 290 55 290 65 L 290 145"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-training-loop)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow 2: Compute Loss → Backward Pass */}
      <motion.path
        d="M 332.5 195 L 332.5 275 Q 332.5 285 322.5 285 L 260 285"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-training-loop)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow 3: Backward Pass → Update Weights */}
      <motion.path
        d="M 140 285 L 120 285 Q 110 285 110 275 L 110 195"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-training-loop)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow 4: Update Weights → Forward Pass */}
      <motion.path
        d="M 67.5 145 L 67.5 65 Q 67.5 55 77.5 55 L 140 55"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-training-loop)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Step labels */}
      <motion.text
        x="295"
        y="100"
        textAnchor="start"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        1
      </motion.text>

      <motion.text
        x="340"
        y="220"
        textAnchor="start"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        2
      </motion.text>

      <motion.text
        x="95"
        y="250"
        textAnchor="start"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        3
      </motion.text>

      <motion.text
        x="50"
        y="95"
        textAnchor="start"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
      >
        4
      </motion.text>

      {/* Input/Output labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="200"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Input: x, Labels: y
        </text>
      </motion.g>
    </svg>
  )
}
