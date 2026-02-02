'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface NextTokenPredictionDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function NextTokenPredictionDiagram({
  className = '',
}: NextTokenPredictionDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const inputTokens = ['The', 'cat', 'sat', 'on', 'the']
  const targetTokens = ['cat', 'sat', 'on', 'the', 'mat']

  const tokenWidth = 58
  const tokenHeight = 28
  const tokenGap = 18
  const startX = 52
  const inputY = 40
  const targetY = 170

  // Probability distribution for position 3 ("on" -> "the")
  const probDistIndex = 3
  const probBars = [
    { label: 'the', prob: 0.62 },
    { label: 'a', prob: 0.18 },
    { label: 'his', prob: 0.11 },
    { label: '...', prob: 0.09 },
  ]
  const probBarMaxHeight = 36
  const probBarWidth = 10
  const probBarGap = 4

  // Position helper
  const tokenX = (i: number) => startX + i * (tokenWidth + tokenGap)
  const tokenCenterX = (i: number) => tokenX(i) + tokenWidth / 2

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 260"
      className={className}
      role="img"
      aria-label="Next token prediction diagram showing how each input position predicts the next token as its training target"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-ntp"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
        <marker
          id="arrowhead-ntp-accent"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Row labels */}
      <motion.text
        x="8"
        y={inputY + tokenHeight / 2}
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
        dominantBaseline="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        Input
      </motion.text>

      <motion.text
        x="8"
        y={targetY + tokenHeight / 2}
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
        dominantBaseline="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Target
      </motion.text>

      {/* Input tokens (top row) */}
      {inputTokens.map((token, i) => (
        <motion.g
          key={`input-${i}`}
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
          transition={{
            duration: 0.5,
            delay: i * 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        >
          <rect
            x={tokenX(i)}
            y={inputY}
            width={tokenWidth}
            height={tokenHeight}
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x={tokenCenterX(i)}
            y={inputY + tokenHeight / 2}
            fill="var(--color-text-primary)"
            fontSize="12"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {token}
          </text>
          {/* Position index above */}
          <text
            x={tokenCenterX(i)}
            y={inputY - 8}
            fill="var(--color-text-tertiary)"
            fontSize="9"
            textAnchor="middle"
          >
            t{i + 1}
          </text>
        </motion.g>
      ))}

      {/* Arrows from input to target */}
      {inputTokens.map((_, i) => {
        const isHighlighted = i === probDistIndex
        return (
          <motion.line
            key={`arrow-${i}`}
            x1={tokenCenterX(i)}
            y1={inputY + tokenHeight}
            x2={tokenCenterX(i)}
            y2={targetY}
            stroke={
              isHighlighted
                ? 'var(--color-accent)'
                : 'var(--color-text-tertiary)'
            }
            strokeWidth={isHighlighted ? 2 : 1.5}
            strokeDasharray={isHighlighted ? 'none' : '4,3'}
            markerEnd={
              isHighlighted
                ? 'url(#arrowhead-ntp-accent)'
                : 'url(#arrowhead-ntp)'
            }
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: 0.5,
              delay: 0.3 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* Probability distribution mini bar chart at highlighted position */}
      {(() => {
        const distCenterX = tokenCenterX(probDistIndex)
        const distY = 98
        const totalBarsWidth =
          probBars.length * probBarWidth +
          (probBars.length - 1) * probBarGap
        const distStartX = distCenterX - totalBarsWidth / 2

        return (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{
              duration: 0.5,
              delay: 0.7,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Background panel */}
            <rect
              x={distStartX - 8}
              y={distY - 10}
              width={totalBarsWidth + 16}
              height={probBarMaxHeight + 28}
              rx="4"
              fill="var(--color-bg-tertiary)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />

            {/* "P(next)" label */}
            <text
              x={distCenterX}
              y={distY - 2}
              fill="var(--color-text-tertiary)"
              fontSize="9"
              textAnchor="middle"
              fontWeight="500"
            >
              P(next)
            </text>

            {/* Bars */}
            {probBars.map((bar, bi) => {
              const barH = bar.prob * probBarMaxHeight
              const bx =
                distStartX + bi * (probBarWidth + probBarGap)
              const by = distY + 6 + (probBarMaxHeight - barH)
              const isTop = bi === 0

              return (
                <g key={`prob-bar-${bi}`}>
                  <motion.rect
                    x={bx}
                    y={by}
                    width={probBarWidth}
                    rx="1.5"
                    fill={
                      isTop
                        ? 'var(--color-accent)'
                        : 'var(--color-text-tertiary)'
                    }
                    opacity={isTop ? 1 : 0.4}
                    initial={{ height: 0 }}
                    animate={
                      isInView ? { height: barH } : { height: 0 }
                    }
                    transition={{
                      duration: 0.5,
                      delay: 0.9 + bi * 0.06,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                  <text
                    x={bx + probBarWidth / 2}
                    y={distY + probBarMaxHeight + 15}
                    fill="var(--color-text-tertiary)"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    {bar.label}
                  </text>
                </g>
              )
            })}
          </motion.g>
        )
      })()}

      {/* Target tokens (bottom row) */}
      {targetTokens.map((token, i) => {
        const isHighlighted = i === probDistIndex
        return (
          <motion.g
            key={`target-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
            }
            transition={{
              duration: 0.5,
              delay: 0.5 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <rect
              x={tokenX(i)}
              y={targetY}
              width={tokenWidth}
              height={tokenHeight}
              rx="4"
              fill={
                isHighlighted
                  ? 'var(--color-accent-subtle)'
                  : 'var(--color-bg-elevated)'
              }
              stroke={
                isHighlighted
                  ? 'var(--color-accent)'
                  : 'var(--color-border-primary)'
              }
              strokeWidth={isHighlighted ? 2 : 1.5}
            />
            <text
              x={tokenCenterX(i)}
              y={targetY + tokenHeight / 2}
              fill={
                isHighlighted
                  ? 'var(--color-accent)'
                  : 'var(--color-text-primary)'
              }
              fontSize="12"
              fontWeight={isHighlighted ? '600' : '500'}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {token}
            </text>
          </motion.g>
        )
      })}

      {/* Loss annotation bracket at highlighted position */}
      <motion.g
        initial={{ opacity: 0, x: 8 }}
        animate={
          isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }
        }
        transition={{
          duration: 0.5,
          delay: 1.2,
          ease: PRODUCTIVE_EASE,
        }}
      >
        {/* Bracket line on the right side of the highlighted column */}
        {(() => {
          const bracketX = tokenX(probDistIndex) + tokenWidth + 6
          const bracketTop = inputY + tokenHeight + 4
          const bracketBottom = targetY - 4
          const bracketMidY = (bracketTop + bracketBottom) / 2
          const tickW = 4

          return (
            <>
              <path
                d={`M ${bracketX} ${bracketTop} L ${bracketX + tickW} ${bracketTop} L ${bracketX + tickW} ${bracketMidY - 3} L ${bracketX + tickW + 3} ${bracketMidY} L ${bracketX + tickW} ${bracketMidY + 3} L ${bracketX + tickW} ${bracketBottom} L ${bracketX} ${bracketBottom}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
              />
              <text
                x={bracketX + tickW + 8}
                y={bracketMidY - 3}
                fill="var(--color-accent)"
                fontSize="9"
                fontWeight="600"
                dominantBaseline="middle"
              >
                Cross-entropy
              </text>
              <text
                x={bracketX + tickW + 8}
                y={bracketMidY + 8}
                fill="var(--color-accent)"
                fontSize="9"
                fontWeight="600"
                dominantBaseline="middle"
              >
                loss
              </text>
            </>
          )
        })()}
      </motion.g>

      {/* Shift indicator showing the offset */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.0,
          ease: PRODUCTIVE_EASE,
        }}
      >
        {/* Arrow from input[0] label area down to target[0] showing "shifted by 1" */}
        <text
          x={tokenX(0) - 2}
          y={targetY + tokenHeight + 14}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          targets = inputs shifted by 1
        </text>
      </motion.g>

      {/* Bottom label */}
      <motion.text
        x="250"
        y="250"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Each position predicts the next token
      </motion.text>
    </svg>
  )
}
