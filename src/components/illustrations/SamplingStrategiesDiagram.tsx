'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SamplingStrategiesDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

const tokens = ['the', 'a', 'cat', 'dog', 'to', 'is', 'my', 'an']

interface Strategy {
  title: string
  label: string
  probabilities: number[]
  highlighted: boolean[]
}

const strategies: Strategy[] = [
  {
    title: 'Greedy',
    label: 'Always pick highest',
    probabilities: [0.52, 0.15, 0.1, 0.07, 0.06, 0.04, 0.03, 0.03],
    highlighted: [true, false, false, false, false, false, false, false],
  },
  {
    title: 'Low Temp',
    label: 'Confident, repetitive',
    probabilities: [0.72, 0.12, 0.06, 0.04, 0.02, 0.02, 0.01, 0.01],
    highlighted: [true, true, true, true, true, true, true, true],
  },
  {
    title: 'High Temp',
    label: 'Creative, random',
    probabilities: [0.18, 0.16, 0.15, 0.13, 0.12, 0.1, 0.09, 0.07],
    highlighted: [true, true, true, true, true, true, true, true],
  },
  {
    title: 'Top-k / Top-p',
    label: 'Balanced diversity',
    probabilities: [0.38, 0.26, 0.2, 0.16, 0.0, 0.0, 0.0, 0.0],
    highlighted: [true, true, true, true, false, false, false, false],
  },
]

// Layout constants
const chartWidth = 115
const chartHeight = 100
const chartGap = 22
const chartStartX = 18
const chartTopY = 58
const barGap = 2
const barWidth = (chartWidth - (tokens.length - 1) * barGap) / tokens.length
const maxBarHeight = 75

export default function SamplingStrategiesDiagram({
  className = '',
}: SamplingStrategiesDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 280"
      className={className}
      role="img"
      aria-label="Sampling strategies for text generation showing Greedy, Low Temperature, High Temperature, and Top-k/Top-p probability distributions"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <motion.text
        x="280"
        y="22"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Sampling Strategies for Text Generation
      </motion.text>

      {/* Subtitle */}
      <motion.text
        x="280"
        y="40"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        Probability distribution over next token
      </motion.text>

      {strategies.map((strategy, sIdx) => {
        const groupX = chartStartX + sIdx * (chartWidth + chartGap)
        const baselineY = chartTopY + chartHeight

        return (
          <motion.g
            key={strategy.title}
            initial={{ opacity: 0, y: 12 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{
              duration: 0.5,
              delay: sIdx * 0.12,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Strategy title */}
            <text
              x={groupX + chartWidth / 2}
              y={chartTopY - 6}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              {strategy.title}
            </text>

            {/* Y-axis line */}
            <line
              x1={groupX}
              y1={chartTopY}
              x2={groupX}
              y2={baselineY}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />

            {/* X-axis line */}
            <line
              x1={groupX}
              y1={baselineY}
              x2={groupX + chartWidth}
              y2={baselineY}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />

            {/* Y-axis label */}
            <text
              x={groupX - 4}
              y={chartTopY + chartHeight / 2}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              transform={`rotate(-90, ${groupX - 4}, ${chartTopY + chartHeight / 2})`}
            >
              prob
            </text>

            {/* Bars */}
            {strategy.probabilities.map((prob, bIdx) => {
              const barH = prob * maxBarHeight / 0.75 // normalize so 0.75 maps to maxBarHeight
              const clampedH = Math.min(barH, maxBarHeight)
              const barX = groupX + bIdx * (barWidth + barGap)
              const barY = baselineY - clampedH
              const isActive = strategy.highlighted[bIdx]

              // For greedy: only the first bar gets accent
              // For top-k: first 4 get accent, rest are grayed/invisible
              // For temperatures: all bars are shown with accent
              let fillColor: string
              if (strategy.title === 'Greedy') {
                fillColor = isActive
                  ? 'var(--color-accent)'
                  : 'var(--color-bg-tertiary)'
              } else if (strategy.title === 'Top-k / Top-p') {
                fillColor = isActive
                  ? 'var(--color-accent)'
                  : 'var(--color-bg-tertiary)'
              } else {
                fillColor = 'var(--color-accent)'
              }

              const barOpacity =
                strategy.title === 'Top-k / Top-p' && !isActive ? 0.25 : 1

              return (
                <g key={`${sIdx}-${bIdx}`}>
                  {/* Animated bar growing upward */}
                  {clampedH > 0 && (
                    <motion.rect
                      x={barX}
                      width={barWidth}
                      rx="1.5"
                      fill={fillColor}
                      opacity={barOpacity}
                      initial={{ y: baselineY, height: 0 }}
                      animate={
                        isInView
                          ? { y: barY, height: clampedH }
                          : { y: baselineY, height: 0 }
                      }
                      transition={{
                        duration: 0.6,
                        delay: sIdx * 0.12 + bIdx * 0.04 + 0.2,
                        ease: PRODUCTIVE_EASE,
                      }}
                    />
                  )}

                  {/* Cut-off indicator dashes for zeroed-out top-k bars */}
                  {strategy.title === 'Top-k / Top-p' && !isActive && (
                    <motion.line
                      x1={barX}
                      y1={baselineY - 2}
                      x2={barX + barWidth}
                      y2={baselineY - 2}
                      stroke="var(--color-text-tertiary)"
                      strokeWidth="1"
                      strokeDasharray="2,1.5"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: sIdx * 0.12 + bIdx * 0.04 + 0.6,
                      }}
                    />
                  )}

                  {/* Token label on x-axis */}
                  <motion.text
                    x={barX + barWidth / 2}
                    y={baselineY + 11}
                    textAnchor="middle"
                    fill="var(--color-text-tertiary)"
                    fontSize="9"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: sIdx * 0.12 + bIdx * 0.04 + 0.5,
                    }}
                  >
                    {tokens[bIdx]}
                  </motion.text>
                </g>
              )
            })}

            {/* Selection indicator for greedy (arrow pointing to top bar) */}
            {strategy.title === 'Greedy' && (
              <motion.g
                initial={{ opacity: 0, y: 4 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }
                }
                transition={{
                  duration: 0.4,
                  delay: 0.9,
                  ease: PRODUCTIVE_EASE,
                }}
              >
                <polygon
                  points={`${groupX + barWidth / 2 - 3},${chartTopY - 10} ${groupX + barWidth / 2 + 3},${chartTopY - 10} ${groupX + barWidth / 2},${chartTopY - 14}`}
                  fill="var(--color-accent)"
                />
              </motion.g>
            )}

            {/* Top-k cutoff line */}
            {strategy.title === 'Top-k / Top-p' && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <line
                  x1={groupX + 4 * (barWidth + barGap) - barGap / 2}
                  y1={chartTopY}
                  x2={groupX + 4 * (barWidth + barGap) - barGap / 2}
                  y2={baselineY}
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                  opacity="0.6"
                />
                <text
                  x={groupX + 4 * (barWidth + barGap) + 2}
                  y={chartTopY + 8}
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  fontStyle="italic"
                >
                  cutoff
                </text>
              </motion.g>
            )}

            {/* Strategy label below chart */}
            <motion.text
              x={groupX + chartWidth / 2}
              y={baselineY + 24}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="9"
              fontWeight="500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: sIdx * 0.12 + 0.8,
              }}
            >
              {strategy.label}
            </motion.text>
          </motion.g>
        )
      })}

      {/* Bottom legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        {/* Accent swatch */}
        <rect
          x="170"
          y="255"
          width="10"
          height="10"
          rx="1.5"
          fill="var(--color-accent)"
        />
        <text
          x="184"
          y="264"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Selected / eligible tokens
        </text>

        {/* Muted swatch */}
        <rect
          x="300"
          y="255"
          width="10"
          height="10"
          rx="1.5"
          fill="var(--color-bg-tertiary)"
        />
        <text
          x="314"
          y="264"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Excluded tokens
        </text>
      </motion.g>
    </svg>
  )
}
