'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface PositionalEncodingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

// Simulated sine/cosine positional encoding values (5 positions x 8 dimensions)
// Values range 0..1 representing intensity for heatmap shading
// Even indices = sin, odd indices = cos at different frequencies
const PE_MATRIX = [
  [0.84, 0.54, 0.91, 0.42, 0.96, 0.28, 0.99, 0.14], // pos 0
  [0.42, 0.91, 0.14, 0.99, 0.07, 0.98, 0.03, 1.00], // pos 1
  [0.09, 0.60, 0.53, 0.85, 0.81, 0.59, 0.95, 0.31], // pos 2
  [0.72, 0.07, 0.84, 0.14, 0.53, 0.99, 0.28, 0.96], // pos 3
  [0.96, 0.65, 0.28, 0.76, 0.14, 0.49, 0.07, 0.87], // pos 4
]

export default function PositionalEncodingDiagram({
  className = '',
}: PositionalEncodingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const tokens = ['The', 'cat', 'sat', 'on', 'mat']
  const tokenCount = tokens.length
  const dimCount = 8

  // Layout: tokens are spaced evenly across the width
  const startX = 90
  const tokenSpacing = 76
  const tokenBoxW = 56
  const tokenBoxH = 22
  const embeddingH = 16

  // Heatmap: each position gets a horizontal row of 8 small dimension cells
  // aligned under its token, making 5 separate mini-grids
  const cellW = 6
  const cellGap = 1
  const stripW = dimCount * cellW + (dimCount - 1) * cellGap // 55px, fits in 56px tokenBoxW
  const stripH = 44 // total height for the heatmap strip area (8 rows of cells)
  const cellH = (stripH - (dimCount - 1) * cellGap) / dimCount // ~4.9px per row

  // Y positions for each section
  const tokenRowY = 14
  const embeddingRowY = 44
  const plusSignY = 68
  const heatmapY = 84
  const heatmapBottomY = heatmapY + stripH
  const equalsSignY = heatmapBottomY + 14
  const sumRowY = equalsSignY + 14
  const formulaY = sumRowY + embeddingH + 12
  const annotationY = formulaY + 14

  // Sequential animation phase delays
  const phase1Delay = 0
  const phase2Delay = 0.6
  const phase3Delay = 1.4
  const phase4Delay = 2.0

  // Per-token colors (CSS custom properties with fallbacks)
  const tokenColors = [
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
    'var(--color-info)',
    'var(--color-error)',
  ]

  const centerX = startX + ((tokenCount - 1) * tokenSpacing) / 2

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 316"
      className={className}
      role="img"
      aria-label="Positional encoding diagram showing how token embeddings are combined with positional encodings to produce position-aware input representations for a Transformer"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ============================================================
          SECTION 1: Token boxes + Token Embedding bars (phase 1)
          ============================================================ */}

      {/* Left label: Tokens */}
      <motion.text
        x="12"
        y={tokenRowY + tokenBoxH / 2 + 4}
        fontSize="9"
        fontWeight="600"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase1Delay, ease: PRODUCTIVE_EASE }}
      >
        Tokens
      </motion.text>

      {/* Token boxes */}
      {tokens.map((token, i) => {
        const cx = startX + i * tokenSpacing
        return (
          <motion.g
            key={`token-${i}`}
            initial={{ opacity: 0, y: -12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
            transition={{
              duration: 0.5,
              delay: phase1Delay + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <rect
              x={cx - tokenBoxW / 2}
              y={tokenRowY}
              width={tokenBoxW}
              height={tokenBoxH}
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
            />
            <text
              x={cx}
              y={tokenRowY + tokenBoxH / 2 + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--color-text-primary)"
            >
              {token}
            </text>
          </motion.g>
        )
      })}

      {/* Left label: Embed */}
      <motion.text
        x="12"
        y={embeddingRowY + embeddingH / 2 + 3}
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase1Delay + 0.3, ease: PRODUCTIVE_EASE }}
      >
        Embed
      </motion.text>

      {/* Token embedding colored bars */}
      {tokens.map((_, i) => {
        const cx = startX + i * tokenSpacing
        return (
          <motion.rect
            key={`embed-${i}`}
            x={cx - tokenBoxW / 2}
            y={embeddingRowY}
            width={tokenBoxW}
            height={embeddingH}
            rx="3"
            fill={tokenColors[i]}
            opacity="0.7"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 0.7, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{
              duration: 0.45,
              delay: phase1Delay + 0.3 + i * 0.06,
              ease: PRODUCTIVE_EASE,
            }}
            style={{ transformOrigin: `${cx}px ${embeddingRowY + embeddingH / 2}px` }}
          />
        )
      })}

      {/* ============================================================
          Plus sign between embeddings and positional encoding
          ============================================================ */}
      <motion.text
        x={centerX}
        y={plusSignY + 6}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: phase2Delay - 0.15, ease: PRODUCTIVE_EASE }}
      >
        +
      </motion.text>

      {/* ============================================================
          SECTION 2: Positional Encoding Heatmap (phase 2)
          Each position gets an 8-cell vertical strip aligned under its token.
          8 rows = 8 dimensions, with alternating sin/cos shading.
          ============================================================ */}

      {/* Left label: Pos Enc */}
      <motion.text
        x="12"
        y={heatmapY + stripH / 2 + 3}
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase2Delay, ease: PRODUCTIVE_EASE }}
      >
        Pos Enc
      </motion.text>

      {/* Per-position heatmap strips */}
      {tokens.map((_, posIdx) => {
        const cx = startX + posIdx * tokenSpacing
        const stripStartX = cx - stripW / 2

        return (
          <motion.g
            key={`heatmap-${posIdx}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{
              duration: 0.5,
              delay: phase2Delay + posIdx * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Background box for this position's encoding strip */}
            <rect
              x={stripStartX - 2}
              y={heatmapY - 2}
              width={stripW + 4}
              height={stripH + 4}
              rx="3"
              fill="var(--color-bg-tertiary)"
              stroke="var(--color-border-primary)"
              strokeWidth="0.75"
              opacity="0.4"
            />

            {/* 8 dimension cells in a vertical column within the strip width */}
            {PE_MATRIX[posIdx].map((value, dimIdx) => {
              const rowY = heatmapY + dimIdx * (cellH + cellGap)
              return (
                <rect
                  key={`cell-${posIdx}-${dimIdx}`}
                  x={stripStartX}
                  y={rowY}
                  width={stripW}
                  height={cellH}
                  rx="1"
                  fill="var(--color-accent)"
                  opacity={0.08 + value * 0.82}
                />
              )
            })}

            {/* Position label beneath */}
            <text
              x={cx}
              y={heatmapBottomY + 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-tertiary)"
            >
              pos {posIdx}
            </text>
          </motion.g>
        )
      })}

      {/* Dimension labels on the right side */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: phase2Delay + 0.3, ease: PRODUCTIVE_EASE }}
      >
        {Array.from({ length: dimCount }).map((_, d) => {
          const rowY = heatmapY + d * (cellH + cellGap) + cellH / 2 + 2
          const lastTokenCX = startX + (tokenCount - 1) * tokenSpacing
          return (
            <text
              key={`dim-label-${d}`}
              x={lastTokenCX + stripW / 2 + 8}
              y={rowY}
              fontSize="9"
              fill="var(--color-text-tertiary)"
            >
              {d % 2 === 0 ? 'sin' : 'cos'}
            </text>
          )
        })}
      </motion.g>

      {/* ============================================================
          Equals sign between heatmap and final sum
          ============================================================ */}
      <motion.text
        x={centerX}
        y={equalsSignY + 4}
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: phase3Delay - 0.15, ease: PRODUCTIVE_EASE }}
      >
        =
      </motion.text>

      {/* ============================================================
          SECTION 3: Final Input = embedding + positional (phase 3)
          ============================================================ */}

      {/* Left label: Input */}
      <motion.text
        x="12"
        y={sumRowY + embeddingH / 2 + 3}
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase3Delay, ease: PRODUCTIVE_EASE }}
      >
        Input
      </motion.text>

      {tokens.map((_, i) => {
        const cx = startX + i * tokenSpacing
        return (
          <motion.g
            key={`sum-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.5,
              delay: phase3Delay + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Combined representation bar */}
            <rect
              x={cx - tokenBoxW / 2}
              y={sumRowY}
              width={tokenBoxW}
              height={embeddingH}
              rx="3"
              fill={tokenColors[i]}
              opacity="0.85"
            />
            {/* Accent stripe overlay showing positional component */}
            <rect
              x={cx - tokenBoxW / 2}
              y={sumRowY}
              width={tokenBoxW}
              height={embeddingH / 3}
              rx="3"
              fill="var(--color-accent)"
              opacity="0.3"
            />
            {/* Label */}
            <text
              x={cx}
              y={sumRowY + embeddingH / 2 + 3}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--color-bg-primary)"
            >
              e{i} + p{i}
            </text>
          </motion.g>
        )
      })}

      {/* Formula text below sum row */}
      <motion.text
        x={centerX}
        y={formulaY}
        textAnchor="middle"
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase3Delay + 0.4, ease: PRODUCTIVE_EASE }}
      >
        token_embedding + positional_encoding = final_input
      </motion.text>

      {/* ============================================================
          SECTION 4: Key Insight Annotation (phase 4)
          ============================================================ */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: phase4Delay, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={startX - tokenBoxW / 2 - 14}
          y={annotationY}
          width={(tokenCount - 1) * tokenSpacing + tokenBoxW + 28}
          height={26}
          rx="5"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.6"
        />
        <text
          x={centerX}
          y={annotationY + 16}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Position 1 and Position 2 have different encodings, so the model knows word order
        </text>
      </motion.g>

      {/* ============================================================
          Dashed highlights around pos 1 and pos 2 heatmap strips
          ============================================================ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase4Delay + 0.2, ease: PRODUCTIVE_EASE }}
      >
        {[1, 2].map((posIdx) => {
          const cx = startX + posIdx * tokenSpacing
          const stripStartX = cx - stripW / 2
          return (
            <rect
              key={`highlight-${posIdx}`}
              x={stripStartX - 4}
              y={heatmapY - 4}
              width={stripW + 8}
              height={stripH + 8}
              rx="4"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          )
        })}

        {/* "different!" label between pos 1 and pos 2 */}
        <text
          x={startX + 1.5 * tokenSpacing}
          y={heatmapBottomY + 22}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          different!
        </text>
      </motion.g>
    </svg>
  )
}
