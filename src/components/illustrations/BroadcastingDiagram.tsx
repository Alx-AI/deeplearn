'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BroadcastingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function BroadcastingDiagram({ className }: BroadcastingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Matrix values
  const matrixA = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
  const vectorB = [10, 20, 30]
  const result = [
    [11, 22, 33],
    [14, 25, 36],
    [17, 28, 39]
  ]

  const cellSize = 24
  const cellGap = 2
  const matrixWidth = 3 * cellSize + 2 * cellGap
  const matrixHeight = 3 * cellSize + 2 * cellGap

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 300"
      className={className}
      role="img"
      aria-label="Broadcasting diagram showing how a 1x3 vector is broadcast to match a 3x3 matrix shape"
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-broadcast"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x="220"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Broadcasting: shape (3,3) + shape (1,3)
      </motion.text>

      {/* Left Matrix (3x3) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      >
        {matrixA.map((row, i) =>
          row.map((val, j) => {
            const x = 40 + j * (cellSize + cellGap)
            const y = 50 + i * (cellSize + cellGap)
            return (
              <g key={`a-${i}-${j}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="1"
                  rx="2"
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-text-primary)"
                  fontSize="9"
                  fontFamily="var(--font-sans)"
                >
                  {val}
                </text>
              </g>
            )
          })
        )}
        <text
          x="40"
          y="140"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontFamily="var(--font-sans)"
        >
          Matrix A
        </text>
        <text
          x="40"
          y="152"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (3, 3)
        </text>
      </motion.g>

      {/* Plus symbol */}
      <motion.text
        x="140"
        y="90"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-text-secondary)"
        fontSize="20"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.3 }}
      >
        +
      </motion.text>

      {/* Right Vector (1x3) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      >
        {vectorB.map((val, j) => {
          const x = 170 + j * (cellSize + cellGap)
          const y = 50
          return (
            <g key={`b-${j}`}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1"
                rx="2"
              />
              <text
                x={x + cellSize / 2}
                y={y + cellSize / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-primary)"
                fontSize="9"
                fontFamily="var(--font-sans)"
              >
                {val}
              </text>
            </g>
          )
        })}
        <text
          x="170"
          y="90"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontFamily="var(--font-sans)"
        >
          Vector B
        </text>
        <text
          x="170"
          y="102"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (1, 3)
        </text>
      </motion.g>

      {/* Arrow and stretched vector */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      >
        {/* Vertical arrow */}
        <line
          x1="220"
          y1="80"
          x2="220"
          y2="110"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-broadcast)"
        />

        {/* Stretched vector (virtual) - showing broadcast */}
        {[0, 1, 2].map((i) =>
          vectorB.map((val, j) => {
            const x = 170 + j * (cellSize + cellGap)
            const y = 120 + i * (cellSize + cellGap)
            return (
              <g key={`stretched-${i}-${j}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill="var(--color-bg-tertiary)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  rx="2"
                  opacity="0.5"
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-text-secondary)"
                  fontSize="9"
                  fontFamily="var(--font-sans)"
                  opacity="0.6"
                >
                  {val}
                </text>
              </g>
            )
          })
        )}
        <text
          x="170"
          y="210"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fontStyle="italic"
        >
          broadcast to (3, 3)
        </text>
      </motion.g>

      {/* Equals symbol */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      >
        <line
          x1="275"
          y1="155"
          x2="285"
          y2="155"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
        <line
          x1="275"
          y1="162"
          x2="285"
          y2="162"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
      </motion.g>

      {/* Result Matrix (3x3) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.8 }}
      >
        {result.map((row, i) =>
          row.map((val, j) => {
            const x = 310 + j * (cellSize + cellGap)
            const y = 120 + i * (cellSize + cellGap)
            return (
              <g key={`result-${i}-${j}`}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill="var(--color-accent-subtle)"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  rx="2"
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-text-primary)"
                  fontSize="9"
                  fontWeight="600"
                  fontFamily="var(--font-sans)"
                >
                  {val}
                </text>
              </g>
            )
          })
        )}
        <text
          x="310"
          y="210"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontFamily="var(--font-sans)"
        >
          Result
        </text>
        <text
          x="310"
          y="222"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (3, 3)
        </text>
      </motion.g>

      {/* Explanation text */}
      <motion.text
        x="220"
        y="260"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 1 }}
      >
        Vector B is virtually stretched to match Matrix A's shape
      </motion.text>
      <motion.text
        x="220"
        y="275"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 1.1 }}
      >
        Element-wise addition produces the result
      </motion.text>
    </svg>
  )
}
