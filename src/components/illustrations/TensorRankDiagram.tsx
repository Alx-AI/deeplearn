'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TensorRankDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TensorRankDiagram({ className }: TensorRankDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 200"
      role="img"
      aria-label="Comparison of tensor ranks from scalar to 3D tensor"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Scalar (0D) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0 }}
      >
        {/* Single cell */}
        <rect
          x="40"
          y="60"
          width="22"
          height="22"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="2"
        />
        <text
          x="51"
          y="74"
          fontSize="9"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          42
        </text>
        {/* Label */}
        <text
          x="51"
          y="100"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
        >
          Scalar (0D)
        </text>
      </motion.g>

      {/* Vector (1D) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      >
        {/* 4 cells in a row */}
        {[1, 3, 5, 7].map((num, i) => (
          <g key={i}>
            <rect
              x={130 + i * 22}
              y="60"
              width="22"
              height="22"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
              rx="2"
            />
            <text
              x={141 + i * 22}
              y="74"
              fontSize="9"
              fill="var(--color-text-secondary)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {num}
            </text>
          </g>
        ))}
        {/* Label */}
        <text
          x="185"
          y="100"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
        >
          Vector (1D)
        </text>
      </motion.g>

      {/* Matrix (2D) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      >
        {/* 3x3 grid */}
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ].map((row, rowIdx) => (
          <g key={rowIdx}>
            {row.map((num, colIdx) => (
              <g key={colIdx}>
                <rect
                  x={280 + colIdx * 22}
                  y={40 + rowIdx * 22}
                  width="22"
                  height="22"
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="1.5"
                  rx="2"
                />
                <text
                  x={291 + colIdx * 22}
                  y={54 + rowIdx * 22}
                  fontSize="9"
                  fill="var(--color-text-secondary)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {num}
                </text>
              </g>
            ))}
          </g>
        ))}
        {/* Label */}
        <text
          x="313"
          y="120"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
        >
          Matrix (2D)
        </text>
      </motion.g>

      {/* 3D Tensor */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.3 }}
      >
        {/* Back layer */}
        <g opacity="0.4">
          {Array.from({ length: 9 }).map((_, i) => {
            const row = Math.floor(i / 3)
            const col = i % 3
            return (
              <rect
                key={`back-${i}`}
                x={440 + col * 22 + 12}
                y={30 + row * 22 + 12}
                width="22"
                height="22"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
                rx="2"
              />
            )
          })}
        </g>

        {/* Middle layer */}
        <g opacity="0.7">
          {Array.from({ length: 9 }).map((_, i) => {
            const row = Math.floor(i / 3)
            const col = i % 3
            return (
              <rect
                key={`mid-${i}`}
                x={440 + col * 22 + 6}
                y={30 + row * 22 + 6}
                width="22"
                height="22"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
                rx="2"
              />
            )
          })}
        </g>

        {/* Front layer with numbers */}
        <g>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, i) => {
            const row = Math.floor(i / 3)
            const col = i % 3
            return (
              <g key={`front-${i}`}>
                <rect
                  x={440 + col * 22}
                  y={30 + row * 22}
                  width="22"
                  height="22"
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="1.5"
                  rx="2"
                />
                <text
                  x={451 + col * 22}
                  y={44 + row * 22}
                  fontSize="9"
                  fill="var(--color-text-secondary)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {num}
                </text>
              </g>
            )
          })}
        </g>

        {/* Label */}
        <text
          x="479"
          y="120"
          fontSize="11"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
        >
          3D Tensor
        </text>
      </motion.g>
    </svg>
  )
}
