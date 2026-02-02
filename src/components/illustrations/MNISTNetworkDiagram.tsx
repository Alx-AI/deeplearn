'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface MNISTNetworkDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function MNISTNetworkDiagram({ className = '' }: MNISTNetworkDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Define the "7" pattern in a 5x5 grid (1 = filled, 0 = empty)
  const digitPattern = [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ]

  // Layer positions and node counts
  const inputLayerX = 100
  const hiddenLayerX = 240
  const outputLayerX = 380

  const inputNodes = 6
  const hiddenNodes = 4
  const outputNodes = 3

  // Calculate node positions
  const getNodePositions = (x: number, count: number) => {
    const startY = 60
    const spacing = 25
    return Array.from({ length: count }, (_, i) => ({
      x,
      y: startY + i * spacing,
    }))
  }

  const inputPositions = getNodePositions(inputLayerX, inputNodes)
  const hiddenPositions = getNodePositions(hiddenLayerX, hiddenNodes)
  const outputPositions = getNodePositions(outputLayerX, outputNodes)

  // Generate connections between layers
  const connections: Array<{ x1: number; y1: number; x2: number; y2: number }> = []

  // Input to Hidden
  inputPositions.forEach((input) => {
    hiddenPositions.forEach((hidden) => {
      connections.push({ x1: input.x, y1: input.y, x2: hidden.x, y2: hidden.y })
    })
  })

  // Hidden to Output
  hiddenPositions.forEach((hidden) => {
    outputPositions.forEach((output) => {
      connections.push({ x1: hidden.x, y1: hidden.y, x2: output.x, y2: output.y })
    })
  })

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 480 220"
        role="img"
        aria-label="Neural network diagram showing MNIST digit recognition with input layer, hidden layer, and output layer"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Input Grid - Stylized "7" */}
        <g transform="translate(20, 50)">
          {digitPattern.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.rect
                key={`cell-${rowIndex}-${colIndex}`}
                x={colIndex * 12}
                y={rowIndex * 12}
                width="10"
                height="10"
                rx="1"
                fill={cell ? 'var(--color-accent)' : 'var(--color-bg-elevated)'}
                stroke="var(--color-border-primary)"
                strokeWidth="0.5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.3,
                  delay: rowIndex * 0.05 + colIndex * 0.03,
                  ease: PRODUCTIVE_EASE,
                }}
              />
            ))
          )}
          <text
            x="30"
            y="75"
            fontSize="9"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            28×28
          </text>
          <text
            x="30"
            y="85"
            fontSize="9"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            pixels
          </text>
        </g>

        {/* Connections */}
        <g>
          {connections.map((conn, index) => (
            <motion.line
              key={`conn-${index}`}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="var(--color-text-primary)"
              strokeWidth="0.5"
              opacity="0"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 0.15 }
                  : {}
              }
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.005,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}
        </g>

        {/* Input Layer Neurons */}
        <g>
          {inputPositions.map((pos, index) => (
            <motion.circle
              key={`input-${index}`}
              cx={pos.x}
              cy={pos.y}
              r="6"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: 0.8 + index * 0.05,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}
          {/* Dots to indicate more nodes */}
          <text
            x={inputLayerX}
            y="35"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          <text
            x={inputLayerX}
            y="195"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          {/* Layer Label */}
          <text
            x={inputLayerX}
            y="205"
            fontSize="9"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Input (784)
          </text>
        </g>

        {/* Hidden Layer Neurons */}
        <g>
          {hiddenPositions.map((pos, index) => (
            <motion.circle
              key={`hidden-${index}`}
              cx={pos.x}
              cy={pos.y}
              r="6"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: 1.1 + index * 0.05,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}
          {/* Dots to indicate more nodes */}
          <text
            x={hiddenLayerX}
            y="35"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          <text
            x={hiddenLayerX}
            y="175"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          {/* Layer Label */}
          <text
            x={hiddenLayerX}
            y="205"
            fontSize="9"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Hidden (512)
          </text>
        </g>

        {/* Output Layer Neurons */}
        <g>
          {outputPositions.map((pos, index) => (
            <motion.circle
              key={`output-${index}`}
              cx={pos.x}
              cy={pos.y}
              r="6"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: 1.4 + index * 0.05,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}
          {/* Dots to indicate more nodes */}
          <text
            x={outputLayerX}
            y="35"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          <text
            x={outputLayerX}
            y="145"
            fontSize="10"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            ⋮
          </text>
          {/* Layer Label */}
          <text
            x={outputLayerX}
            y="205"
            fontSize="9"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Output (10)
          </text>
          <text
            x={outputLayerX}
            y="215"
            fontSize="8"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            classes 0–9
          </text>
        </g>

        {/* Predicted Output */}
        <g transform="translate(445, 50)">
          <motion.text
            x="0"
            y="50"
            fontSize="42"
            fontWeight="600"
            fill="var(--color-accent)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 1.8,
              ease: PRODUCTIVE_EASE,
            }}
          >
            7
          </motion.text>
          <motion.text
            x="0"
            y="70"
            fontSize="8"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.3,
              delay: 2.0,
              ease: PRODUCTIVE_EASE,
            }}
          >
            prediction
          </motion.text>
        </g>

        {/* Arrows indicating flow */}
        <motion.path
          d="M 70 110 L 85 110"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          fill="none"
          markerEnd="url(#arrowhead-mnist)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.3, delay: 1.0, ease: PRODUCTIVE_EASE }}
        />
        <motion.path
          d="M 405 110 L 420 110"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          fill="none"
          markerEnd="url(#arrowhead-mnist)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.3, delay: 1.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead-mnist"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="var(--color-text-tertiary)"
              opacity="0.4"
            />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
