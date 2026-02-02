'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FrameworkStackDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function FrameworkStackDiagram({ className }: FrameworkStackDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 240"
      role="img"
      aria-label="Framework stack diagram showing Keras on top of TensorFlow/PyTorch/JAX backends running on GPU/TPU hardware"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Hardware Layer (Bottom) */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0 }}
      >
        <rect
          x="140"
          y="180"
          width="180"
          height="45"
          rx="8"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="230"
          y="199"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          GPU / TPU Hardware
        </text>
        <text
          x="230"
          y="213"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          Where to run
        </text>

        {/* Hardware icon */}
        <g transform="translate(152, 185)">
          <rect
            x="0"
            y="0"
            width="16"
            height="12"
            rx="2"
            fill="none"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
          />
          <line x1="4" y1="4" x2="4" y2="8" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
          <line x1="8" y1="4" x2="8" y2="8" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
          <line x1="12" y1="4" x2="12" y2="8" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
        </g>
      </motion.g>

      {/* Connector from Hardware to Backend */}
      <motion.line
        x1="230"
        y1="180"
        x2="230"
        y2="165"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="3,3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.3 }}
      />

      {/* Backend Layer (Middle) */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      >
        <rect
          x="110"
          y="110"
          width="240"
          height="45"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="230"
          y="129"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          TensorFlow / PyTorch / JAX
        </text>
        <text
          x="230"
          y="143"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          How to compute
        </text>
      </motion.g>

      {/* Connector from Backend to Keras */}
      <motion.line
        x1="230"
        y1="110"
        x2="230"
        y2="95"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="3,3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      />

      {/* Keras Layer (Top) */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.4 }}
      >
        <rect
          x="70"
          y="40"
          width="320"
          height="45"
          rx="8"
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="230"
          y="59"
          textAnchor="middle"
          fill="var(--color-bg-primary)"
          fontSize="12"
          fontWeight="600"
        >
          Keras
        </text>
        <text
          x="230"
          y="73"
          textAnchor="middle"
          fill="var(--color-bg-primary)"
          fillOpacity="0.9"
          fontSize="9"
        >
          What to build (high-level API)
        </text>
      </motion.g>

      {/* Side label arrows and text */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.6 }}
      >
        {/* High-level indicator */}
        <line
          x1="60"
          y1="62"
          x2="68"
          y2="62"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-framework-stack)"
        />
        <text
          x="56"
          y="66"
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          High-level
        </text>

        {/* Low-level indicator */}
        <line
          x1="60"
          y1="132"
          x2="108"
          y2="132"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-framework-stack)"
        />
        <text
          x="56"
          y="136"
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Low-level
        </text>

        {/* Hardware indicator */}
        <line
          x1="60"
          y1="202"
          x2="138"
          y2="202"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-framework-stack)"
        />
        <text
          x="56"
          y="206"
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Hardware
        </text>
      </motion.g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-framework-stack"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>
    </svg>
  )
}
