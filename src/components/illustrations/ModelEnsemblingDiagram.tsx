'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ModelEnsemblingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ModelEnsemblingDiagram({ className }: ModelEnsemblingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 200"
      className={className}
      role="img"
      aria-label="Ensemble learning diagram showing three models combining predictions"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Gradient for Model A */}
        <linearGradient id="modelA-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.05" />
        </linearGradient>

        {/* Gradient for Model B */}
        <linearGradient id="modelB-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-text-primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--color-text-primary)" stopOpacity="0.04" />
        </linearGradient>

        {/* Gradient for Model C */}
        <linearGradient id="modelC-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-text-secondary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-text-secondary)" stopOpacity="0.05" />
        </linearGradient>

        {/* Arrow marker */}
        <marker
          id="arrowhead-model-ensembling"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path
            d="M 0 0 L 8 4 L 0 8 Z"
            fill="var(--color-text-tertiary)"
          />
        </marker>

        {/* Accent arrow marker */}
        <marker
          id="arrowhead-ensembling-accent"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path
            d="M 0 0 L 8 4 L 0 8 Z"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Input arrows to each model */}
      <motion.path
        d="M 20 40 L 60 40"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      />
      <motion.path
        d="M 20 100 L 60 100"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.15 }}
      />
      <motion.path
        d="M 20 160 L 60 160"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      />

      {/* Model A */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.3 }}
      >
        <rect
          x="60"
          y="20"
          width="100"
          height="40"
          rx="6"
          fill="url(#modelA-gradient)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <text
          x="110"
          y="44"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Model A
        </text>
      </motion.g>

      {/* Model B */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.35 }}
      >
        <rect
          x="60"
          y="80"
          width="100"
          height="40"
          rx="6"
          fill="url(#modelB-gradient)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <text
          x="110"
          y="104"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Model B
        </text>
      </motion.g>

      {/* Model C */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.4 }}
      >
        <rect
          x="60"
          y="140"
          width="100"
          height="40"
          rx="6"
          fill="url(#modelC-gradient)"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <text
          x="110"
          y="164"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Model C
        </text>
      </motion.g>

      {/* Prediction arrows from models to combine node */}
      <motion.path
        d="M 160 40 L 240 85"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.6 }}
      />
      <motion.path
        d="M 160 100 L 240 100"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.65 }}
      />
      <motion.path
        d="M 160 160 L 240 115"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrowhead-model-ensembling)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      />

      {/* Combine/Average node */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.9 }}
      >
        <circle
          cx="270"
          cy="100"
          r="30"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="270"
          y="105"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Average
        </text>
      </motion.g>

      {/* Output arrow to final prediction */}
      <motion.path
        d="M 300 100 L 340 100"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        fill="none"
        markerEnd="url(#arrowhead-ensembling-accent)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 1.1 }}
      />

      {/* Final Prediction box */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 1.3 }}
      >
        <rect
          x="340"
          y="80"
          width="80"
          height="40"
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="380"
          y="97"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Final
        </text>
        <text
          x="380"
          y="111"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Prediction
        </text>
      </motion.g>

      {/* Labels for prediction values (optional detail) */}
      <motion.text
        x="200"
        y="30"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        0.82
      </motion.text>
      <motion.text
        x="200"
        y="96"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.85 }}
      >
        0.75
      </motion.text>
      <motion.text
        x="200"
        y="156"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.9 }}
      >
        0.88
      </motion.text>
    </svg>
  )
}
