'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface HigherRankTensorsDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function HigherRankTensorsDiagram({ className }: HigherRankTensorsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Isometric offset helpers
  const isoX = 8
  const isoY = -6

  // --- Rank 2: Matrix (flat 2D grid) ---
  const rank2X = 20
  const rank2Y = 60
  const r2Cell = 14
  const r2Cols = 4
  const r2Rows = 3

  // --- Rank 3: 3D Tensor (cube) ---
  const rank3X = 150
  const rank3Y = 52
  const r3Cell = 13
  const r3Size = 3
  const r3Layers = 3

  // --- Rank 4: Batch of cubes ---
  const rank4X = 280
  const rank4Y = 52
  const r4Cell = 11
  const r4Size = 3
  const r4Layers = 3
  const r4BatchCount = 3
  const r4Spacing = 28

  // --- Rank 5: Video batch (stacked/grid of cubes) ---
  const rank5X = 416
  const rank5Y = 46
  const r5Cell = 9
  const r5Size = 3
  const r5Layers = 3
  const r5BatchCount = 2
  const r5TimeSteps = 3
  const r5SpacingX = 22
  const r5SpacingY = 30

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 240"
      role="img"
      aria-label="Tensor ranks in practice showing rank 2 through rank 5 with real-world examples"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <motion.text
        x="280"
        y="18"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Tensor Ranks in Practice
      </motion.text>

      {/* =========== Rank 2: Matrix (flat 2D grid) =========== */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      >
        {/* Grid cells */}
        {Array.from({ length: r2Rows }).map((_, row) =>
          Array.from({ length: r2Cols }).map((_, col) => (
            <rect
              key={`r2-${row}-${col}`}
              x={rank2X + col * r2Cell}
              y={rank2Y + row * r2Cell}
              width={r2Cell}
              height={r2Cell}
              fill="var(--color-accent-subtle)"
              stroke="var(--color-border-primary)"
              strokeWidth="0.8"
              rx="1"
            />
          ))
        )}

        {/* Axis label: features (horizontal) */}
        <line
          x1={rank2X}
          y1={rank2Y + r2Rows * r2Cell + 6}
          x2={rank2X + r2Cols * r2Cell}
          y2={rank2Y + r2Rows * r2Cell + 6}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          markerEnd="url(#arrow-hrt)"
        />
        <text
          x={rank2X + (r2Cols * r2Cell) / 2}
          y={rank2Y + r2Rows * r2Cell + 16}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          features
        </text>

        {/* Axis label: samples (vertical) */}
        <line
          x1={rank2X - 6}
          y1={rank2Y}
          x2={rank2X - 6}
          y2={rank2Y + r2Rows * r2Cell}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          markerEnd="url(#arrow-hrt)"
        />
        <text
          x={rank2X - 9}
          y={rank2Y + (r2Rows * r2Cell) / 2}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          transform={`rotate(-90, ${rank2X - 9}, ${rank2Y + (r2Rows * r2Cell) / 2})`}
        >
          samples
        </text>

        {/* Label */}
        <text
          x={rank2X + (r2Cols * r2Cell) / 2}
          y={rank2Y - 14}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          Rank-2
        </text>
        <text
          x={rank2X + (r2Cols * r2Cell) / 2}
          y={rank2Y - 4}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="7.5"
          fontFamily="var(--font-sans)"
        >
          Matrix
        </text>

        {/* Example label */}
        <text
          x={rank2X + (r2Cols * r2Cell) / 2}
          y={rank2Y + r2Rows * r2Cell + 30}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          fontFamily="var(--font-sans)"
        >
          &quot;Table&quot;
        </text>

        {/* Shape */}
        <text
          x={rank2X + (r2Cols * r2Cell) / 2}
          y={rank2Y + r2Rows * r2Cell + 42}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (60000, 784)
        </text>
      </motion.g>

      {/* =========== Rank 3: 3D Tensor (cube) =========== */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.25 }}
      >
        {/* Draw layers back to front */}
        {Array.from({ length: r3Layers }).map((_, layer) => {
          const layerIdx = r3Layers - 1 - layer
          const ox = layerIdx * isoX
          const oy = layerIdx * isoY
          const opacity = 0.35 + (layer / (r3Layers - 1)) * 0.65
          return (
            <g key={`r3-layer-${layerIdx}`} opacity={opacity}>
              {Array.from({ length: r3Size }).map((_, row) =>
                Array.from({ length: r3Size }).map((_, col) => (
                  <rect
                    key={`r3-${layerIdx}-${row}-${col}`}
                    x={rank3X + col * r3Cell + ox}
                    y={rank3Y + row * r3Cell + oy}
                    width={r3Cell}
                    height={r3Cell}
                    fill="var(--color-accent-subtle)"
                    stroke="var(--color-border-primary)"
                    strokeWidth="0.8"
                    rx="1"
                  />
                ))
              )}
            </g>
          )
        })}

        {/* Axis labels */}
        {/* width (horizontal) */}
        <text
          x={rank3X + (r3Size * r3Cell) / 2}
          y={rank3Y + r3Size * r3Cell + 14}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          width
        </text>
        {/* height (vertical) */}
        <text
          x={rank3X - 8}
          y={rank3Y + (r3Size * r3Cell) / 2}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          transform={`rotate(-90, ${rank3X - 8}, ${rank3Y + (r3Size * r3Cell) / 2})`}
        >
          height
        </text>
        {/* channels (depth diagonal) */}
        <text
          x={rank3X + r3Size * r3Cell + (r3Layers - 1) * isoX + 4}
          y={rank3Y + (r3Layers - 1) * isoY - 2}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          ch
        </text>

        {/* Label */}
        <text
          x={rank3X + (r3Size * r3Cell) / 2 + ((r3Layers - 1) * isoX) / 2}
          y={rank3Y - 20}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          Rank-3
        </text>
        <text
          x={rank3X + (r3Size * r3Cell) / 2 + ((r3Layers - 1) * isoX) / 2}
          y={rank3Y - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="7.5"
          fontFamily="var(--font-sans)"
        >
          3D Tensor
        </text>

        {/* Example label */}
        <text
          x={rank3X + (r3Size * r3Cell) / 2 + ((r3Layers - 1) * isoX) / 2}
          y={rank3Y + r3Size * r3Cell + 28}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          fontFamily="var(--font-sans)"
        >
          &quot;Image&quot;
        </text>
        <text
          x={rank3X + (r3Size * r3Cell) / 2 + ((r3Layers - 1) * isoX) / 2}
          y={rank3Y + r3Size * r3Cell + 40}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (28, 28, 3)
        </text>
      </motion.g>

      {/* =========== Rank 4: Batch of cubes =========== */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.4 }}
      >
        {/* Draw batch cubes left to right */}
        {Array.from({ length: r4BatchCount }).map((_, batchIdx) => {
          const bx = rank4X + batchIdx * r4Spacing
          const bOpacity = 0.4 + ((batchIdx + 1) / r4BatchCount) * 0.6
          return (
            <g key={`r4-batch-${batchIdx}`} opacity={bOpacity}>
              {/* Each cube has stacked layers */}
              {Array.from({ length: r4Layers }).map((_, layer) => {
                const layerIdx = r4Layers - 1 - layer
                const ox = layerIdx * (isoX * 0.7)
                const oy = layerIdx * (isoY * 0.7)
                const lOpacity = 0.4 + (layer / (r4Layers - 1)) * 0.6
                return (
                  <g key={`r4-${batchIdx}-layer-${layerIdx}`} opacity={lOpacity}>
                    {Array.from({ length: r4Size }).map((_, row) =>
                      Array.from({ length: r4Size }).map((_, col) => (
                        <rect
                          key={`r4-${batchIdx}-${layerIdx}-${row}-${col}`}
                          x={bx + col * r4Cell + ox}
                          y={rank4Y + row * r4Cell + oy}
                          width={r4Cell}
                          height={r4Cell}
                          fill="var(--color-accent-subtle)"
                          stroke="var(--color-border-primary)"
                          strokeWidth="0.6"
                          rx="1"
                        />
                      ))
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}

        {/* Batch axis bracket */}
        <line
          x1={rank4X}
          y1={rank4Y + r4Size * r4Cell + 10}
          x2={rank4X + (r4BatchCount - 1) * r4Spacing + r4Size * r4Cell + (r4Layers - 1) * isoX * 0.7}
          y2={rank4Y + r4Size * r4Cell + 10}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          strokeDasharray="2,2"
        />
        <text
          x={rank4X + ((r4BatchCount - 1) * r4Spacing + r4Size * r4Cell) / 2}
          y={rank4Y + r4Size * r4Cell + 20}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          batch
        </text>

        {/* Label */}
        <text
          x={rank4X + ((r4BatchCount - 1) * r4Spacing + r4Size * r4Cell) / 2}
          y={rank4Y - 20}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          Rank-4
        </text>
        <text
          x={rank4X + ((r4BatchCount - 1) * r4Spacing + r4Size * r4Cell) / 2}
          y={rank4Y - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="7.5"
          fontFamily="var(--font-sans)"
        >
          4D Tensor
        </text>

        {/* Example label */}
        <text
          x={rank4X + ((r4BatchCount - 1) * r4Spacing + r4Size * r4Cell) / 2}
          y={rank4Y + r4Size * r4Cell + 34}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          fontFamily="var(--font-sans)"
        >
          &quot;Batch of Images&quot;
        </text>
        <text
          x={rank4X + ((r4BatchCount - 1) * r4Spacing + r4Size * r4Cell) / 2}
          y={rank4Y + r4Size * r4Cell + 46}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (32, 28, 28, 3)
        </text>
      </motion.g>

      {/* =========== Rank 5: Video Batch =========== */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.55 }}
      >
        {/* Grid of cubes: rows = batch, cols = time */}
        {Array.from({ length: r5BatchCount }).map((_, batchIdx) =>
          Array.from({ length: r5TimeSteps }).map((_, timeIdx) => {
            const bx = rank5X + timeIdx * r5SpacingX
            const by = rank5Y + batchIdx * r5SpacingY
            const combinedOpacity =
              (0.5 + ((batchIdx + 1) / r5BatchCount) * 0.5) *
              (0.5 + ((timeIdx + 1) / r5TimeSteps) * 0.5)
            return (
              <g key={`r5-${batchIdx}-${timeIdx}`} opacity={combinedOpacity}>
                {/* Each mini-cube has stacked layers */}
                {Array.from({ length: r5Layers }).map((_, layer) => {
                  const layerIdx = r5Layers - 1 - layer
                  const ox = layerIdx * (isoX * 0.5)
                  const oy = layerIdx * (isoY * 0.5)
                  const lOpacity = 0.4 + (layer / (r5Layers - 1)) * 0.6
                  return (
                    <g key={`r5-${batchIdx}-${timeIdx}-l${layerIdx}`} opacity={lOpacity}>
                      {Array.from({ length: r5Size }).map((_, row) =>
                        Array.from({ length: r5Size }).map((_, col) => (
                          <rect
                            key={`r5-${batchIdx}-${timeIdx}-${layerIdx}-${row}-${col}`}
                            x={bx + col * r5Cell + ox}
                            y={by + row * r5Cell + oy}
                            width={r5Cell}
                            height={r5Cell}
                            fill="var(--color-accent-subtle)"
                            stroke="var(--color-border-primary)"
                            strokeWidth="0.5"
                            rx="0.5"
                          />
                        ))
                      )}
                    </g>
                  )
                })}
              </g>
            )
          })
        )}

        {/* Time axis (horizontal, below cubes) */}
        <line
          x1={rank5X}
          y1={rank5Y + r5BatchCount * r5SpacingY + r5Size * r5Cell - r5SpacingY + 8}
          x2={rank5X + (r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell + (r5Layers - 1) * isoX * 0.5}
          y2={rank5Y + r5BatchCount * r5SpacingY + r5Size * r5Cell - r5SpacingY + 8}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          strokeDasharray="2,2"
        />
        <text
          x={rank5X + ((r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell) / 2}
          y={rank5Y + r5BatchCount * r5SpacingY + r5Size * r5Cell - r5SpacingY + 18}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          time
        </text>

        {/* Batch axis (vertical, left side) */}
        <line
          x1={rank5X - 6}
          y1={rank5Y + r5Size * r5Cell / 2}
          x2={rank5X - 6}
          y2={rank5Y + (r5BatchCount - 1) * r5SpacingY + r5Size * r5Cell / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          strokeDasharray="2,2"
        />
        <text
          x={rank5X - 10}
          y={rank5Y + ((r5BatchCount - 1) * r5SpacingY) / 2 + r5Size * r5Cell / 2}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
          transform={`rotate(-90, ${rank5X - 10}, ${rank5Y + ((r5BatchCount - 1) * r5SpacingY) / 2 + r5Size * r5Cell / 2})`}
        >
          batch
        </text>

        {/* Label */}
        <text
          x={rank5X + ((r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell) / 2}
          y={rank5Y - 14}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9.5"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          Rank-5
        </text>
        <text
          x={rank5X + ((r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell) / 2}
          y={rank5Y - 4}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="7.5"
          fontFamily="var(--font-sans)"
        >
          5D Tensor
        </text>

        {/* Example label */}
        <text
          x={rank5X + ((r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell) / 2}
          y={rank5Y + r5BatchCount * r5SpacingY + r5Size * r5Cell - r5SpacingY + 32}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          fontFamily="var(--font-sans)"
        >
          &quot;Video Batch&quot;
        </text>
        <text
          x={rank5X + ((r5TimeSteps - 1) * r5SpacingX + r5Size * r5Cell) / 2}
          y={rank5Y + r5BatchCount * r5SpacingY + r5Size * r5Cell - r5SpacingY + 44}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-sans)"
        >
          (8, 16, 28, 28, 3)
        </text>
      </motion.g>

      {/* =========== Connecting arrows between stages =========== */}
      <defs>
        <marker
          id="arrow-hrt"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
        <marker
          id="arrow-hrt-accent"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-accent)"
            opacity="0.5"
          />
        </marker>
      </defs>

      {/* Arrow: Rank 2 -> Rank 3 */}
      <motion.line
        x1={rank2X + r2Cols * r2Cell + 10}
        y1={rank2Y + (r2Rows * r2Cell) / 2}
        x2={rank3X - 10}
        y2={rank3Y + (r3Size * r3Cell) / 2}
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
        markerEnd="url(#arrow-hrt-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      />

      {/* Arrow: Rank 3 -> Rank 4 */}
      <motion.line
        x1={rank3X + r3Size * r3Cell + (r3Layers - 1) * isoX + 10}
        y1={rank3Y + (r3Size * r3Cell) / 2}
        x2={rank4X - 10}
        y2={rank4Y + (r4Size * r4Cell) / 2}
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
        markerEnd="url(#arrow-hrt-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.35 }}
      />

      {/* Arrow: Rank 4 -> Rank 5 */}
      <motion.line
        x1={rank4X + (r4BatchCount - 1) * r4Spacing + r4Size * r4Cell + (r4Layers - 1) * isoX * 0.7 + 6}
        y1={rank4Y + (r4Size * r4Cell) / 2}
        x2={rank5X - 8}
        y2={rank5Y + (r5BatchCount * r5SpacingY) / 2}
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
        markerEnd="url(#arrow-hrt-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      />

      {/* Bottom annotation */}
      <motion.text
        x="280"
        y="232"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      >
        Each rank adds a new axis -- higher ranks encode richer, structured data
      </motion.text>
    </svg>
  )
}
