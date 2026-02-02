'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ConvolutionDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ConvolutionDiagram({ className }: ConvolutionDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const cellSize = 24
  const inputGridSize = 5
  const kernelSize = 3
  const outputGridSize = 3
  const gap = 60

  // Input grid starting position
  const inputX = 40
  const inputY = 50

  // Kernel position (overlaying top-left of input)
  const kernelX = inputX + cellSize * 0.5
  const kernelY = inputY + cellSize * 0.5

  // Output grid position
  const outputX = inputX + inputGridSize * cellSize + gap + 40
  const outputY = inputY

  // Sample input values (5x5 grid)
  const inputValues = [
    [1, 0, 2, 1, 0],
    [0, 1, 1, 2, 1],
    [2, 1, 0, 1, 2],
    [1, 2, 1, 0, 1],
    [0, 1, 2, 1, 0]
  ]

  // Kernel values (3x3)
  const kernelValues = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
  ]

  // Output values (3x3) — element-wise multiply of kernel with each input patch, then sum
  const outputValues = [
    [0, -2, 0],
    [1, 1, -2],
    [0, 2, 0]
  ]

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 220"
        role="img"
        aria-label="Convolution operation showing a 3x3 kernel sliding over a 5x5 input to produce a 3x3 output"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)'
        }}
      >
        <defs>
          <marker
            id="arrowhead-convolution"
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

        {/* Input Grid Label */}
        <text
          x={inputX + (inputGridSize * cellSize) / 2}
          y={inputY - 15}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
        >
          Input
        </text>

        {/* Input Grid */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          {inputValues.map((row, i) =>
            row.map((val, j) => (
              <g key={`input-${i}-${j}`}>
                <rect
                  x={inputX + j * cellSize}
                  y={inputY + i * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="1"
                />
                <text
                  x={inputX + j * cellSize + cellSize / 2}
                  y={inputY + i * cellSize + cellSize / 2 + 3}
                  textAnchor="middle"
                  fill="var(--color-text-secondary)"
                  fontSize="9"
                >
                  {val}
                </text>
              </g>
            ))
          )}
        </motion.g>

        {/* Kernel Label */}
        <text
          x={kernelX + (kernelSize * cellSize) / 2}
          y={kernelY - 10}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="12"
          fontWeight="600"
        >
          Kernel (3×3)
        </text>

        {/* Kernel Grid (overlaying input) */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          {/* Highlighted region on input */}
          <rect
            x={kernelX - 2}
            y={kernelY - 2}
            width={kernelSize * cellSize + 4}
            height={kernelSize * cellSize + 4}
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="2"
            rx="2"
          />
          {kernelValues.map((row, i) =>
            row.map((val, j) => (
              <text
                key={`kernel-${i}-${j}`}
                x={kernelX + j * cellSize + cellSize / 2}
                y={kernelY + i * cellSize + cellSize / 2 + 3}
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="9"
                fontWeight="700"
              >
                {val}
              </text>
            ))
          )}
        </motion.g>

        {/* Arrow from kernel to output */}
        <motion.line
          x1={kernelX + (kernelSize * cellSize) / 2 + kernelSize * cellSize / 2 + 10}
          y1={kernelY + (kernelSize * cellSize) / 2}
          x2={outputX - 15}
          y2={outputY + cellSize}
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-convolution)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Output Grid Label */}
        <text
          x={outputX + (outputGridSize * cellSize) / 2}
          y={outputY - 15}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
        >
          Output
        </text>

        {/* Output Grid */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
        >
          {outputValues.map((row, i) =>
            row.map((val, j) => {
              const isHighlighted = i === 0 && j === 0
              return (
                <g key={`output-${i}-${j}`}>
                  <rect
                    x={outputX + j * cellSize}
                    y={outputY + i * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={isHighlighted ? 'var(--color-accent-subtle)' : 'var(--color-bg-elevated)'}
                    stroke={isHighlighted ? 'var(--color-accent)' : 'var(--color-border-primary)'}
                    strokeWidth={isHighlighted ? '2' : '1'}
                  />
                  <text
                    x={outputX + j * cellSize + cellSize / 2}
                    y={outputY + i * cellSize + cellSize / 2 + 3}
                    textAnchor="middle"
                    fill={isHighlighted ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
                    fontSize="9"
                    fontWeight={isHighlighted ? '700' : '400'}
                  >
                    {val}
                  </text>
                </g>
              )
            })
          )}
        </motion.g>

        {/* Computation annotation */}
        <motion.text
          x={outputX + (outputGridSize * cellSize) / 2}
          y={outputY + outputGridSize * cellSize + 25}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          Element-wise multiply + sum
        </motion.text>
      </svg>
    </div>
  )
}
