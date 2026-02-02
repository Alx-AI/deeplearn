'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface AttentionMechanismDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function AttentionMechanismDiagram({ className }: AttentionMechanismDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Input tokens on the left
  const inputTokens = [
    { text: 'The', y: 30 },
    { text: 'cat', y: 80 },
    { text: 'sat', y: 130 },
    { text: 'down', y: 180 }
  ]

  // Output token on the right
  const outputToken = { text: 'le', y: 105 }

  // Attention weights (higher = more attention)
  // cat gets highest attention, The and sat medium, down lowest
  const attentionWeights = [
    { from: 0, weight: 0.5, strokeWidth: 2, opacity: 0.5 }, // The -> le
    { from: 1, weight: 1.0, strokeWidth: 3, opacity: 0.8 }, // cat -> le (highest)
    { from: 2, weight: 0.5, strokeWidth: 2, opacity: 0.5 }, // sat -> le
    { from: 3, weight: 0.2, strokeWidth: 1, opacity: 0.3 }  // down -> le
  ]

  const inputX = 60
  const outputX = 340
  const tokenWidth = 70
  const tokenHeight = 32

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 235"
      className={className}
      role="img"
      aria-label="Attention mechanism diagram showing how the output token 'le' attends to input tokens with varying weights"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)'
      }}
    >
      <defs>
        {/* Gradient for highest attention line */}
        <linearGradient id="attention-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Title */}
      <motion.text
        x="200"
        y="15"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Attention Weights Show Which Inputs Matter Most
      </motion.text>

      {/* Attention lines */}
      <g>
        {attentionWeights.map((attention, i) => {
          const fromY = inputTokens[attention.from].y + tokenHeight / 2
          const toY = outputToken.y + tokenHeight / 2
          const isHighest = attention.weight === 1.0

          return (
            <motion.line
              key={`attention-${i}`}
              x1={inputX + tokenWidth / 2}
              y1={fromY}
              x2={outputX - tokenWidth / 2}
              y2={toY}
              stroke={isHighest ? 'url(#attention-gradient)' : 'var(--color-border-primary)'}
              strokeWidth={attention.strokeWidth}
              opacity={attention.opacity}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: attention.opacity } : { pathLength: 0, opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.1,
                ease: PRODUCTIVE_EASE
              }}
            />
          )
        })}
      </g>

      {/* Input tokens */}
      <g>
        {inputTokens.map((token, i) => (
          <motion.g
            key={`input-${i}`}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: PRODUCTIVE_EASE
            }}
          >
            {/* Token box */}
            <rect
              x={inputX - tokenWidth / 2}
              y={token.y}
              width={tokenWidth}
              height={tokenHeight}
              rx="6"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
            />
            {/* Token text */}
            <text
              x={inputX}
              y={token.y + tokenHeight / 2 + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="500"
              fill="var(--color-text-primary)"
            >
              {token.text}
            </text>
          </motion.g>
        ))}

        {/* Input label */}
        <motion.text
          x={inputX}
          y={inputTokens[inputTokens.length - 1].y + tokenHeight + 18}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-tertiary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          Input Tokens
        </motion.text>
      </g>

      {/* Output token */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{
          duration: 0.5,
          delay: 0.3,
          ease: PRODUCTIVE_EASE
        }}
      >
        {/* Token box with accent */}
        <rect
          x={outputX - tokenWidth / 2}
          y={outputToken.y}
          width={tokenWidth}
          height={tokenHeight}
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        {/* Token text */}
        <text
          x={outputX}
          y={outputToken.y + tokenHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          {outputToken.text}
        </text>

        {/* Output label */}
        <text
          x={outputX}
          y={outputToken.y + tokenHeight + 18}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-tertiary)"
        >
          Output Token
        </text>
      </motion.g>

      {/* Legend for attention strength */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="200"
          y="215"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Line thickness = attention strength
        </text>
      </motion.g>
    </svg>
  )
}
