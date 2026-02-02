'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface MaxPoolingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

const MaxPoolingDiagram = ({ className }: MaxPoolingDiagramProps) => {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // 4x4 input grid values
  const inputGrid = [
    [1, 3, 7, 4],
    [5, 2, 9, 6],
    [8, 4, 3, 1],
    [6, 9, 2, 5],
  ]

  // Define the four 2x2 regions and their max values
  const regions = [
    {
      color: 'var(--color-accent-subtle)',
      borderColor: 'var(--color-accent)',
      startRow: 0,
      startCol: 0,
      maxValue: 5,
      maxRow: 1,
      maxCol: 0,
      outputRow: 0,
      outputCol: 0,
    },
    {
      color: 'var(--color-accent-subtle)',
      borderColor: 'var(--color-accent)',
      startRow: 0,
      startCol: 2,
      maxValue: 9,
      maxRow: 1,
      maxCol: 2,
      outputRow: 0,
      outputCol: 1,
    },
    {
      color: 'var(--color-accent-subtle)',
      borderColor: 'var(--color-accent)',
      startRow: 2,
      startCol: 0,
      maxValue: 9,
      maxRow: 3,
      maxCol: 1,
      outputRow: 1,
      outputCol: 0,
    },
    {
      color: 'var(--color-accent-subtle)',
      borderColor: 'var(--color-accent)',
      startRow: 2,
      startCol: 2,
      maxValue: 5,
      maxRow: 3,
      maxCol: 3,
      outputRow: 1,
      outputCol: 1,
    },
  ]

  const cellSize = 30
  const inputX = 20
  const inputY = 40
  const outputX = 300
  const outputY = 75

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 200"
      className={className}
      style={{ width: '100%', height: 'auto' }}
      role="img"
      aria-label="Max pooling diagram showing how a 4x4 grid is downsampled to a 2x2 grid by taking the maximum value from each 2x2 region"
    >
      <defs>
        <marker
          id="arrowhead-maxpool"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* Title */}
      <text
        x="210"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        fontFamily="var(--font-sans)"
      >
        Max Pooling Operation
      </text>

      {/* Input Grid Label */}
      <motion.text
        x={inputX + (cellSize * 4) / 2}
        y={inputY - 10}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Input (4×4)
      </motion.text>

      {/* Region backgrounds */}
      {regions.map((region, idx) => (
        <motion.rect
          key={`region-bg-${idx}`}
          x={inputX + region.startCol * cellSize}
          y={inputY + region.startRow * cellSize}
          width={cellSize * 2}
          height={cellSize * 2}
          fill={region.color}
          stroke={region.borderColor}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: 0.3 + idx * 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Input Grid Cells */}
      {inputGrid.map((row, rowIdx) =>
        row.map((value, colIdx) => {
          const region = regions.find(
            (r) =>
              rowIdx >= r.startRow &&
              rowIdx < r.startRow + 2 &&
              colIdx >= r.startCol &&
              colIdx < r.startCol + 2
          )
          const isMax = region && region.maxRow === rowIdx && region.maxCol === colIdx

          return (
            <g key={`cell-${rowIdx}-${colIdx}`}>
              <motion.rect
                x={inputX + colIdx * cellSize}
                y={inputY + rowIdx * cellSize}
                width={cellSize}
                height={cellSize}
                fill={isMax ? 'var(--color-accent-subtle)' : 'transparent'}
                stroke="var(--color-border-primary)"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: rowIdx * 0.05 + colIdx * 0.05,
                  ease: PRODUCTIVE_EASE,
                }}
              />
              {isMax && (
                <motion.circle
                  cx={inputX + colIdx * cellSize + cellSize / 2}
                  cy={inputY + rowIdx * cellSize + cellSize / 2}
                  r={cellSize / 2 - 2}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 0.6, scale: 1 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + (region ? regions.indexOf(region) * 0.1 : 0),
                    ease: PRODUCTIVE_EASE,
                  }}
                />
              )}
              <motion.text
                x={inputX + colIdx * cellSize + cellSize / 2}
                y={inputY + rowIdx * cellSize + cellSize / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isMax ? 'var(--color-accent)' : 'var(--color-text-primary)'}
                fontSize={isMax ? '13' : '12'}
                fontWeight={isMax ? '700' : '500'}
                fontFamily="var(--font-sans)"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + rowIdx * 0.05 + colIdx * 0.05,
                  ease: PRODUCTIVE_EASE,
                }}
              >
                {value}
              </motion.text>
            </g>
          )
        })
      )}

      {/* Arrow */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={inputX + cellSize * 4 + 20}
          y1={inputY + cellSize * 2}
          x2={outputX - 20}
          y2={outputY + cellSize}
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-maxpool)"
        />
        <text
          x={(inputX + cellSize * 4 + 20 + outputX - 20) / 2}
          y={inputY + cellSize * 2 - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontFamily="var(--font-sans)"
        >
          Max Pool 2×2
        </text>
      </motion.g>

      {/* Output Grid Label */}
      <motion.text
        x={outputX + cellSize}
        y={outputY - 10}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        Output (2×2)
      </motion.text>

      {/* Output Grid */}
      {regions.map((region, idx) => (
        <g key={`output-${idx}`}>
          <motion.rect
            x={outputX + region.outputCol * cellSize}
            y={outputY + region.outputRow * cellSize}
            width={cellSize}
            height={cellSize}
            fill="var(--color-accent-subtle)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: 1.0 + idx * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
          <motion.text
            x={outputX + region.outputCol * cellSize + cellSize / 2}
            y={outputY + region.outputRow * cellSize + cellSize / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-accent)"
            fontSize="14"
            fontWeight="700"
            fontFamily="var(--font-sans)"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 1.2 + idx * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {region.maxValue}
          </motion.text>
        </g>
      ))}

      {/* Connection lines from max values to output */}
      {regions.map((region, idx) => (
        <motion.line
          key={`connection-${idx}`}
          x1={inputX + region.maxCol * cellSize + cellSize / 2}
          y1={inputY + region.maxRow * cellSize + cellSize / 2}
          x2={outputX + region.outputCol * cellSize + cellSize / 2}
          y2={outputY + region.outputRow * cellSize + cellSize / 2}
          stroke={region.borderColor}
          strokeWidth="1.5"
          strokeDasharray="3,3"
          opacity="0.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.4 } : {}}
          transition={{
            duration: 0.6,
            delay: 1.0 + idx * 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Explanation text */}
      <motion.text
        x="210"
        y="185"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Each output value is the maximum from its corresponding 2×2 region
      </motion.text>
    </svg>
  )
}

export default MaxPoolingDiagram
