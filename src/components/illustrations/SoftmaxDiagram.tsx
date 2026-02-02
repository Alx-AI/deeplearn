'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SoftmaxDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function SoftmaxDiagram({ className }: SoftmaxDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  // Data: logits and corresponding probabilities
  const classes = ['Sports', 'Politics', 'Tech', 'Science']
  const logits = [2.1, 0.5, -1.2, 3.8]
  const probabilities = [0.15, 0.03, 0.01, 0.81]

  // Normalize logits for visualization (scale to 0-100 range)
  const maxLogit = Math.max(...logits)
  const minLogit = Math.min(...logits)
  const normalizedLogits = logits.map(l =>
    ((l - minLogit) / (maxLogit - minLogit)) * 80 + 20
  )

  // Scale probabilities for visualization
  const probabilityWidths = probabilities.map(p => p * 120)

  const barHeight = 20
  const barGap = 8
  const leftX = 70
  const rightX = 320

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 200"
      className={className}
      role="img"
      aria-label="Softmax function converting raw logits into probabilities"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <text
        x="240"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
      >
        Softmax Activation
      </text>

      {/* Left section - Raw Logits */}
      <text
        x="70"
        y="45"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
      >
        Raw Scores (Logits)
      </text>

      {classes.map((label, i) => {
        const y = 60 + i * (barHeight + barGap)

        return (
          <g key={`logit-${i}`}>
            {/* Class label */}
            <text
              x="60"
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fill="var(--color-text-tertiary)"
              fontSize="10"
            >
              {label}
            </text>

            {/* Bar background */}
            <rect
              x={leftX}
              y={y}
              width="100"
              height={barHeight}
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              rx="2"
            />

            {/* Animated bar */}
            <motion.rect
              x={leftX}
              y={y}
              height={barHeight}
              fill="var(--color-bg-tertiary)"
              rx="2"
              initial={{ width: 0 }}
              animate={inView ? { width: normalizedLogits[i] } : { width: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Value label */}
            <motion.text
              x={leftX + 105}
              y={y + barHeight / 2 + 4}
              fill="var(--color-text-secondary)"
              fontSize="10"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1 + 0.6,
              }}
            >
              {logits[i].toFixed(1)}
            </motion.text>
          </g>
        )
      })}

      {/* Arrow and label */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{
          duration: 0.6,
          delay: 0.5,
          ease: PRODUCTIVE_EASE,
        }}
      >
        <path
          d="M 180 120 L 280 120"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-softmax)"
        />
        <text
          x="230"
          y="115"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          softmax
        </text>
      </motion.g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-softmax"
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

      {/* Right section - Probabilities */}
      <text
        x={rightX}
        y="45"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
      >
        Probabilities
      </text>

      {classes.map((label, i) => {
        const y = 60 + i * (barHeight + barGap)
        const isHighest = i === 3 // Science has highest probability

        return (
          <g key={`prob-${i}`}>
            {/* Bar background */}
            <rect
              x={rightX}
              y={y}
              width="120"
              height={barHeight}
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              rx="2"
            />

            {/* Animated bar */}
            <motion.rect
              x={rightX}
              y={y}
              height={barHeight}
              fill={isHighest ? 'var(--color-accent)' : 'var(--color-bg-tertiary)'}
              rx="2"
              initial={{ width: 0 }}
              animate={inView ? { width: probabilityWidths[i] } : { width: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.8 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Value label */}
            <motion.text
              x={rightX + 125}
              y={y + barHeight / 2 + 4}
              fill={isHighest ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              fontSize="10"
              fontWeight={isHighest ? '600' : '400'}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.8 + i * 0.1 + 0.6,
              }}
            >
              {probabilities[i].toFixed(2)}
            </motion.text>
          </g>
        )
      })}

      {/* Sum label */}
      <motion.text
        x={rightX + 60}
        y="175"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.4,
          delay: 1.4,
        }}
      >
        Σ = 1.0
      </motion.text>
    </svg>
  )
}
