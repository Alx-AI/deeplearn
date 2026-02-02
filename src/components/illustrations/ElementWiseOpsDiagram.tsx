'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ElementWiseOpsDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ElementWiseOpsDiagram({ className }: ElementWiseOpsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const cellSize = 28
  const cellGap = 2
  const fontSize = 10

  // Addition section data
  const matrixA = [
    [1, 3, 5],
    [2, 0, 4],
    [7, 1, 3]
  ]
  const matrixB = [
    [4, 2, 1],
    [3, 5, 2],
    [0, 6, 1]
  ]
  const addResult = [
    [5, 5, 6],
    [5, 5, 6],
    [7, 7, 4]
  ]

  // ReLU section data
  const reluInput = [
    [2, -1, 4],
    [-3, 5, -2],
    [1, -4, 3]
  ]
  const reluOutput = [
    [2, 0, 4],
    [0, 5, 0],
    [1, 0, 3]
  ]

  // Layout constants
  const addSectionY = 40
  const reluSectionY = 175

  // Addition section x positions
  const matAx = 28
  const matBx = 148
  const addResultX = 358

  // ReLU section x positions
  const reluInX = 50
  const reluOutX = 330

  function renderMatrix(
    data: number[][],
    originX: number,
    originY: number,
    options?: {
      highlightNegative?: boolean
      highlightChanged?: Array<[number, number]>
      accentResult?: boolean
    }
  ) {
    return data.flatMap((row, i) =>
      row.map((val, j) => {
        const x = originX + j * (cellSize + cellGap)
        const y = originY + i * (cellSize + cellGap)

        const isNegative = options?.highlightNegative && val < 0
        const isChanged = options?.highlightChanged?.some(
          ([ci, cj]) => ci === i && cj === j
        )
        const isAccent = options?.accentResult

        let fillColor = 'var(--color-bg-elevated)'
        let strokeColor = 'var(--color-border-primary)'
        let strokeW = 1
        let textColor = 'var(--color-text-primary)'
        let textWeight = 'normal'

        if (isNegative) {
          fillColor = 'var(--color-accent-subtle)'
          strokeColor = 'var(--color-accent)'
          strokeW = 1.5
          textColor = 'var(--color-accent)'
          textWeight = '600'
        } else if (isChanged) {
          fillColor = 'var(--color-accent-subtle)'
          strokeColor = 'var(--color-accent)'
          strokeW = 1.5
          textColor = 'var(--color-accent)'
          textWeight = '600'
        } else if (isAccent) {
          fillColor = 'var(--color-bg-tertiary)'
          strokeColor = 'var(--color-border-primary)'
          strokeW = 1
        }

        return (
          <g key={`${originX}-${i}-${j}`}>
            <rect
              x={x}
              y={y}
              width={cellSize}
              height={cellSize}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeW}
              rx="3"
            />
            <text
              x={x + cellSize / 2}
              y={y + cellSize / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={textColor}
              fontSize={fontSize}
              fontWeight={textWeight}
              fontFamily="var(--font-sans)"
            >
              {val}
            </text>
          </g>
        )
      })
    )
  }

  // Compute matrix width for centering operators
  const matW = 3 * cellSize + 2 * cellGap

  // Connection lines between corresponding cells in addition
  function renderConnectionLines(
    ax: number,
    bx: number,
    ay: number,
    by: number
  ) {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; key: string }> = []
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const fromX = ax + j * (cellSize + cellGap) + cellSize
        const fromY = ay + i * (cellSize + cellGap) + cellSize / 2
        const toX = bx + j * (cellSize + cellGap)
        const toY = by + i * (cellSize + cellGap) + cellSize / 2
        lines.push({
          x1: fromX + 1,
          y1: fromY,
          x2: toX - 1,
          y2: toY,
          key: `conn-${i}-${j}`
        })
      }
    }
    return lines
  }

  // Identify which cells changed in ReLU (negative became 0)
  const reluChangedCells: Array<[number, number]> = []
  reluInput.forEach((row, i) =>
    row.forEach((val, j) => {
      if (val < 0) {
        reluChangedCells.push([i, j])
      }
    })
  )

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 300"
      className={className}
      role="img"
      aria-label="Element-wise tensor operations showing addition and ReLU applied independently to each element"
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-elementwise"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x="240"
        y="22"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Element-wise Operations
      </motion.text>

      {/* ========= ADDITION SECTION ========= */}

      {/* Section label */}
      <motion.text
        x="14"
        y={addSectionY + 2}
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      >
        addition
      </motion.text>

      {/* Matrix A */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.15 }}
      >
        {renderMatrix(matrixA, matAx, addSectionY + 14)}
      </motion.g>

      {/* Plus sign */}
      <motion.text
        x={matAx + matW + 16}
        y={addSectionY + 14 + (3 * (cellSize + cellGap) - cellGap) / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-text-secondary)"
        fontSize="18"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.3 }}
      >
        +
      </motion.text>

      {/* Matrix B */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.25 }}
      >
        {renderMatrix(matrixB, matBx, addSectionY + 14)}
      </motion.g>

      {/* Connection lines between B and Result */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.15 } : {}}
        transition={{ duration: 0.8, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      >
        {renderConnectionLines(
          matBx,
          addResultX,
          addSectionY + 14,
          addSectionY + 14
        ).map((line) => (
          <line
            key={line.key}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.7"
            strokeDasharray="2,2"
          />
        ))}
      </motion.g>

      {/* Equals sign */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.4 }}
      >
        {(() => {
          const eqX = matBx + matW + 48
          const eqY = addSectionY + 14 + (3 * (cellSize + cellGap) - cellGap) / 2
          return (
            <>
              <line
                x1={eqX - 7}
                y1={eqY - 4}
                x2={eqX + 7}
                y2={eqY - 4}
                stroke="var(--color-text-secondary)"
                strokeWidth="2"
              />
              <line
                x1={eqX - 7}
                y1={eqY + 4}
                x2={eqX + 7}
                y2={eqY + 4}
                stroke="var(--color-text-secondary)"
                strokeWidth="2"
              />
            </>
          )
        })()}
      </motion.g>

      {/* Result matrix */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.55 }}
      >
        {renderMatrix(addResult, addResultX, addSectionY + 14, {
          accentResult: true
        })}
      </motion.g>

      {/* Divider line */}
      <motion.line
        x1="30"
        y1="160"
        x2="450"
        y2="160"
        stroke="var(--color-border-primary)"
        strokeWidth="0.5"
        strokeDasharray="4,4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 0.4, pathLength: 1 } : {}}
        transition={{ duration: 0.8, ease: PRODUCTIVE_EASE, delay: 0.6 }}
      />

      {/* ========= RELU SECTION ========= */}

      {/* Section label */}
      <motion.text
        x="14"
        y={reluSectionY + 2}
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.65 }}
      >
        relu
      </motion.text>

      {/* ReLU Input matrix */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      >
        {renderMatrix(reluInput, reluInX, reluSectionY + 14, {
          highlightNegative: true
        })}
      </motion.g>

      {/* Arrow with "relu" label */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.85 }}
      >
        {(() => {
          const arrowStartX = reluInX + matW + 18
          const arrowEndX = reluOutX - 18
          const arrowY = reluSectionY + 14 + (3 * (cellSize + cellGap) - cellGap) / 2
          return (
            <>
              <line
                x1={arrowStartX}
                y1={arrowY}
                x2={arrowEndX}
                y2={arrowY}
                stroke="var(--color-text-secondary)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead-elementwise)"
              />
              <rect
                x={(arrowStartX + arrowEndX) / 2 - 22}
                y={arrowY - 20}
                width="44"
                height="16"
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border-primary)"
                strokeWidth="0.5"
                rx="4"
              />
              <text
                x={(arrowStartX + arrowEndX) / 2}
                y={arrowY - 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-secondary)"
                fontSize="10"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                relu
              </text>
              {/* Formula hint */}
              <text
                x={(arrowStartX + arrowEndX) / 2}
                y={arrowY + 16}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-tertiary)"
                fontSize="9"
                fontFamily="var(--font-sans)"
                fontStyle="italic"
              >
                max(0, x)
              </text>
            </>
          )
        })()}
      </motion.g>

      {/* ReLU Output matrix */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.95 }}
      >
        {renderMatrix(reluOutput, reluOutX, reluSectionY + 14, {
          highlightChanged: reluChangedCells
        })}
      </motion.g>

      {/* Explanatory footnote */}
      <motion.text
        x="240"
        y="290"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 1.1 }}
      >
        Each element is processed independently -- no interaction between positions
      </motion.text>
    </svg>
  )
}
