'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BpeMergingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

interface TokenStep {
  label: string
  tokens: string[]
  merged: Set<number>
}

const steps: TokenStep[] = [
  {
    label: 'Step 0',
    tokens: ['u', 'n', 'h', 'a', 'p', 'p', 'i', 'n', 'e', 's', 's'],
    merged: new Set(),
  },
  {
    label: 'Step 1',
    tokens: ['u', 'n', 'h', 'a', 'pp', 'i', 'n', 'e', 'ss'],
    merged: new Set([4, 8]),
  },
  {
    label: 'Step 2',
    tokens: ['un', 'h', 'a', 'pp', 'i', 'ne', 'ss'],
    merged: new Set([0, 5]),
  },
  {
    label: 'Step 3',
    tokens: ['un', 'happi', 'ness'],
    merged: new Set([1, 2]),
  },
]

export default function BpeMergingDiagram({
  className = '',
}: BpeMergingDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const rowVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.35,
        duration: 0.6,
        ease: PRODUCTIVE_EASE,
      },
    }),
  }

  const arrowVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.35 + 0.2,
        duration: 0.4,
        ease: PRODUCTIVE_EASE,
      },
    }),
  }

  const SVG_WIDTH = 500
  const ROW_START_Y = 30
  const ROW_SPACING = 62
  const BOX_HEIGHT = 24
  const BOX_RX = 4
  const BOX_GAP = 3
  const LABEL_X = 10
  const TOKENS_START_X = 62

  function getBoxWidth(token: string): number {
    return Math.max(24, token.length * 10 + 12)
  }

  function getRowWidth(tokens: string[]): number {
    return tokens.reduce(
      (sum, t, i) => sum + getBoxWidth(t) + (i < tokens.length - 1 ? BOX_GAP : 0),
      0
    )
  }

  function getTokenX(tokens: string[], index: number): number {
    const totalWidth = getRowWidth(tokens)
    const availableWidth = SVG_WIDTH - TOKENS_START_X - 10
    const offsetX = TOKENS_START_X + (availableWidth - totalWidth) / 2
    let x = offsetX
    for (let i = 0; i < index; i++) {
      x += getBoxWidth(tokens[i]) + BOX_GAP
    }
    return x
  }

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 280"
        role="img"
        aria-label="Byte Pair Encoding merging process showing the word unhappiness being compressed from 11 character tokens to 3 subword tokens through iterative pair merging"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-bpe"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 L 2.5 4 Z"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>

        {/* Title */}
        <motion.text
          x={SVG_WIDTH / 2}
          y="16"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="11"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
        >
          BPE Merging: &quot;unhappiness&quot;
        </motion.text>

        {/* Steps */}
        {steps.map((step, stepIdx) => {
          const y = ROW_START_Y + stepIdx * ROW_SPACING

          return (
            <motion.g
              key={stepIdx}
              custom={stepIdx}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={rowVariants}
            >
              {/* Step label */}
              <text
                x={LABEL_X}
                y={y + BOX_HEIGHT / 2 + 4}
                fill="var(--color-text-secondary)"
                fontSize="10"
                fontWeight="500"
              >
                {step.label}
              </text>

              {/* Token count badge */}
              <text
                x={SVG_WIDTH - 8}
                y={y + BOX_HEIGHT / 2 + 4}
                textAnchor="end"
                fill="var(--color-text-tertiary)"
                fontSize="9"
              >
                {step.tokens.length} tokens
              </text>

              {/* Token boxes */}
              {step.tokens.map((token, tokenIdx) => {
                const boxW = getBoxWidth(token)
                const boxX = getTokenX(step.tokens, tokenIdx)
                const isMerged = step.merged.has(tokenIdx)

                return (
                  <g key={tokenIdx}>
                    <rect
                      x={boxX}
                      y={y}
                      width={boxW}
                      height={BOX_HEIGHT}
                      rx={BOX_RX}
                      fill={
                        isMerged
                          ? 'var(--color-accent-subtle)'
                          : 'var(--color-bg-elevated)'
                      }
                      stroke={
                        isMerged
                          ? 'var(--color-accent)'
                          : 'var(--color-border-primary)'
                      }
                      strokeWidth={isMerged ? 1.5 : 1}
                    />
                    <text
                      x={boxX + boxW / 2}
                      y={y + BOX_HEIGHT / 2 + 4}
                      textAnchor="middle"
                      fill={
                        isMerged
                          ? 'var(--color-accent)'
                          : 'var(--color-text-primary)'
                      }
                      fontSize="11"
                      fontWeight={isMerged ? '600' : '400'}
                    >
                      {token}
                    </text>
                  </g>
                )
              })}
            </motion.g>
          )
        })}

        {/* Arrows between steps */}
        {[0, 1, 2].map((idx) => {
          const y1 = ROW_START_Y + idx * ROW_SPACING + BOX_HEIGHT + 4
          const y2 = ROW_START_Y + (idx + 1) * ROW_SPACING - 4
          const midX = SVG_WIDTH / 2

          return (
            <motion.g
              key={`arrow-${idx}`}
              custom={idx + 0.5}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={arrowVariants}
            >
              <line
                x1={midX}
                y1={y1}
                x2={midX}
                y2={y2}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead-bpe)"
              />
              <text
                x={midX + 12}
                y={(y1 + y2) / 2 + 3}
                fill="var(--color-text-tertiary)"
                fontSize="9"
                fontStyle="italic"
              >
                merge pairs
              </text>
            </motion.g>
          )
        })}

        {/* Compression summary at bottom */}
        <motion.g
          custom={4.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        >
          <rect
            x={SVG_WIDTH / 2 - 90}
            y="254"
            width="180"
            height="22"
            rx="11"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <text
            x={SVG_WIDTH / 2}
            y="269"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="11"
            fontWeight="600"
          >
            11 tokens → 3 tokens
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
