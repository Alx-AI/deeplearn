'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TokenizationPipelineDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TokenizationPipelineDiagram({
  className = '',
}: TokenizationPipelineDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const tokens = ['The', 'cat', 'sat', 'on', 'the', 'mat']
  const ids = [1, 45, 89, 12, 1, 67]
  const vectorHeights = [
    [0.8, 0.3, 0.6, 0.9, 0.4, 0.7],
    [0.5, 0.9, 0.2, 0.6, 0.8, 0.3],
    [0.7, 0.4, 0.8, 0.3, 0.9, 0.5],
    [0.3, 0.7, 0.4, 0.8, 0.2, 0.6],
    [0.6, 0.2, 0.9, 0.4, 0.7, 0.8],
    [0.4, 0.8, 0.3, 0.7, 0.5, 0.9],
  ]

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: PRODUCTIVE_EASE,
      },
    }),
  }

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 520 220"
        role="img"
        aria-label="Text tokenization pipeline showing the transformation from raw text to tokens, token IDs, and embedding vectors"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-tokenization"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 L 3 5 Z"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>

        {/* Step 1: Raw Text */}
        <motion.g
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        >
          <text
            x="10"
            y="30"
            fill="var(--color-text-secondary)"
            fontSize="12"
            fontWeight="500"
          >
            Text
          </text>
          <rect
            x="80"
            y="15"
            width="240"
            height="30"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="200"
            y="35"
            fill="var(--color-text-primary)"
            fontSize="11"
            textAnchor="middle"
            fontStyle="italic"
          >
            "The cat sat on the mat"
          </text>
        </motion.g>

        {/* Arrow 1 */}
        <motion.line
          x1="200"
          y1="45"
          x2="200"
          y2="62"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-tokenization)"
          custom={0.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        />

        {/* Step 2: Tokens */}
        <motion.g
          custom={1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        >
          <text
            x="10"
            y="85"
            fill="var(--color-text-secondary)"
            fontSize="12"
            fontWeight="500"
          >
            Tokens
          </text>
          {tokens.map((token, i) => (
            <g key={i}>
              <rect
                x={80 + i * 65}
                y="70"
                width={token.length > 3 ? 55 : 50}
                height="24"
                rx="3"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
              />
              <text
                x={80 + i * 65 + (token.length > 3 ? 27.5 : 25)}
                y="85"
                fill="var(--color-accent)"
                fontSize="10"
                textAnchor="middle"
                fontWeight="500"
              >
                {token}
              </text>
            </g>
          ))}
        </motion.g>

        {/* Arrow 2 */}
        <motion.line
          x1="200"
          y1="94"
          x2="200"
          y2="111"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-tokenization)"
          custom={1.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        />

        {/* Step 3: Token IDs */}
        <motion.g
          custom={2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        >
          <text
            x="10"
            y="135"
            fill="var(--color-text-secondary)"
            fontSize="12"
            fontWeight="500"
          >
            IDs
          </text>
          {ids.map((id, i) => (
            <g key={i}>
              <rect
                x={80 + i * 65}
                y="120"
                width="50"
                height="24"
                rx="3"
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />
              <text
                x={80 + i * 65 + 25}
                y="135"
                fill="var(--color-text-secondary)"
                fontSize="10"
                textAnchor="middle"
                fontWeight="500"
              >
                {id}
              </text>
            </g>
          ))}
        </motion.g>

        {/* Arrow 3 */}
        <motion.line
          x1="200"
          y1="144"
          x2="200"
          y2="161"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-tokenization)"
          custom={2.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        />

        {/* Step 4: Embeddings */}
        <motion.g
          custom={3}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={rowVariants}
        >
          <text
            x="10"
            y="185"
            fill="var(--color-text-secondary)"
            fontSize="12"
            fontWeight="500"
          >
            Vectors
          </text>
          {vectorHeights.map((heights, tokenIdx) => (
            <g key={tokenIdx}>
              <rect
                x={80 + tokenIdx * 65}
                y="170"
                width="50"
                height="40"
                rx="3"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />
              {heights.map((height, barIdx) => (
                <rect
                  key={barIdx}
                  x={83 + tokenIdx * 65 + barIdx * 7.5}
                  y={170 + 35 - height * 30}
                  width="5"
                  height={height * 30}
                  rx="1"
                  fill="var(--color-accent)"
                  opacity="0.8"
                />
              ))}
            </g>
          ))}
        </motion.g>
      </svg>
    </div>
  )
}
