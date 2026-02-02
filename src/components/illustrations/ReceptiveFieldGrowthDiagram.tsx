'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ReceptiveFieldGrowthDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ReceptiveFieldGrowthDiagram({
  className,
}: ReceptiveFieldGrowthDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ── layout constants ─────────────────────────────── */
  const numTimesteps = 11
  const cellW = 28
  const cellH = 22
  const cellGap = 4
  const gridStartX = 60
  const timeAxisY = 264

  // Vertical positions for each layer (bottom = input, top = layer 3 output)
  const inputY = 210
  const layer1Y = 160
  const layer2Y = 110
  const layer3Y = 60

  // Centre X for a given timestep index
  const cx = (i: number) => gridStartX + i * (cellW + cellGap) + cellW / 2

  // Receptive-field definitions (kernel_size=3 for each layer)
  // Layer 1 output at timestep 5 depends on input timesteps 4,5,6 (rf=3)
  // Layer 2 output at timestep 5 depends on input timesteps 3..7   (rf=5)
  // Layer 3 output at timestep 5 depends on input timesteps 2..8   (rf=7)
  const focusIdx = 5 // the output unit we trace from

  const layers = [
    {
      label: 'Conv1D L1',
      y: layer1Y,
      rfStart: 4,
      rfEnd: 6,
      rfLabel: 'RF = 3',
      delay: 0.3,
    },
    {
      label: 'Conv1D L2',
      y: layer2Y,
      rfStart: 3,
      rfEnd: 7,
      rfLabel: 'RF = 5',
      delay: 0.7,
    },
    {
      label: 'Conv1D L3',
      y: layer3Y,
      rfStart: 2,
      rfEnd: 8,
      rfLabel: 'RF = 7',
      delay: 1.1,
    },
  ]

  // 365-day pattern zone (extends well beyond receptive field)
  const patternStartIdx = 0
  const patternEndIdx = numTimesteps - 1

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 280"
      className={className}
      role="img"
      aria-label="Diagram showing how receptive field grows as Conv1D layers are stacked: layer 1 sees 3 timesteps, layer 2 sees 5, layer 3 sees 7, while a 365-day seasonal pattern extends far beyond"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* ════════════════════════════════════════════════
          TIME AXIS
          ════════════════════════════════════════════════ */}
      <motion.line
        x1={gridStartX - 8}
        y1={timeAxisY}
        x2={gridStartX + numTimesteps * (cellW + cellGap) + 4}
        y2={timeAxisY}
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={gridStartX + (numTimesteps * (cellW + cellGap)) / 2}
        y={timeAxisY + 14}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        Time (input timesteps)
      </motion.text>

      {/* ════════════════════════════════════════════════
          365-DAY PATTERN BAND (background)
          ════════════════════════════════════════════════ */}
      <motion.rect
        x={cx(patternStartIdx) - cellW / 2 - 2}
        y={inputY - 2}
        width={cx(patternEndIdx) - cx(patternStartIdx) + cellW + 4}
        height={cellH + 4}
        rx="4"
        fill="var(--color-text-tertiary)"
        fillOpacity="0.06"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1"
        strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={cx(patternEndIdx) + cellW / 2 + 6}
        y={inputY + cellH / 2 + 3}
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0, x: -4 }}
        animate={isInView ? { opacity: 0.85, x: 0 } : { opacity: 0, x: -4 }}
        transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        365-day
      </motion.text>
      <motion.text
        x={cx(patternEndIdx) + cellW / 2 + 6}
        y={inputY + cellH / 2 + 13}
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0, x: -4 }}
        animate={isInView ? { opacity: 0.85, x: 0 } : { opacity: 0, x: -4 }}
        transition={{ duration: 0.4, delay: 2.05, ease: PRODUCTIVE_EASE }}
      >
        pattern
      </motion.text>

      {/* ════════════════════════════════════════════════
          INPUT TIMESTEP CELLS (bottom row)
          ════════════════════════════════════════════════ */}
      {Array.from({ length: numTimesteps }).map((_, i) => {
        const x = gridStartX + i * (cellW + cellGap)
        return (
          <motion.g
            key={`input-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: 0.35,
              delay: 0.05 + i * 0.03,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <rect
              x={x}
              y={inputY}
              width={cellW}
              height={cellH}
              rx="3"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
            <text
              x={x + cellW / 2}
              y={inputY + cellH / 2 + 3.5}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="9"
            >
              t<tspan fontSize="9" baselineShift="sub">{i}</tspan>
            </text>
          </motion.g>
        )
      })}

      {/* Input row label */}
      <motion.text
        x={gridStartX - 12}
        y={inputY + cellH / 2 + 3}
        textAnchor="end"
        fill="var(--color-text-secondary)"
        fontSize="9"
        fontWeight="500"
        initial={{ opacity: 0, x: -4 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
        transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        Input
      </motion.text>

      {/* ════════════════════════════════════════════════
          CONV1D LAYERS (3 rows, bottom to top)
          ════════════════════════════════════════════════ */}
      {layers.map((layer, li) => {
        // Each layer has as many output units as there are timesteps (same padding)
        return (
          <motion.g
            key={`layer-${li}`}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.5,
              delay: layer.delay,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Layer cells */}
            {Array.from({ length: numTimesteps }).map((_, i) => {
              const x = gridStartX + i * (cellW + cellGap)
              const inRF = i >= layer.rfStart && i <= layer.rfEnd
              const isFocus = i === focusIdx

              return (
                <rect
                  key={`layer-${li}-cell-${i}`}
                  x={x}
                  y={layer.y}
                  width={cellW}
                  height={cellH}
                  rx="3"
                  fill={
                    isFocus
                      ? 'var(--color-accent)'
                      : inRF
                        ? 'var(--color-accent-subtle)'
                        : 'var(--color-bg-elevated)'
                  }
                  fillOpacity={isFocus ? 0.25 : 1}
                  stroke={
                    isFocus
                      ? 'var(--color-accent)'
                      : inRF
                        ? 'var(--color-accent)'
                        : 'var(--color-border-primary)'
                  }
                  strokeWidth={isFocus ? 2 : inRF ? 1.5 : 1}
                />
              )
            })}

            {/* Layer label (left side) */}
            <text
              x={gridStartX - 12}
              y={layer.y + cellH / 2 + 3}
              textAnchor="end"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontWeight="600"
            >
              {layer.label}
            </text>

            {/* RF label (right side) */}
            <motion.text
              x={
                gridStartX +
                numTimesteps * (cellW + cellGap) +
                4
              }
              y={layer.y + cellH / 2 + 3}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono, monospace)"
              initial={{ opacity: 0, x: -4 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
              transition={{
                duration: 0.4,
                delay: layer.delay + 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {layer.rfLabel}
            </motion.text>
          </motion.g>
        )
      })}

      {/* ════════════════════════════════════════════════
          RECEPTIVE FIELD CONE (traced from output down to input)
          ════════════════════════════════════════════════ */}

      {/* Cone polygon: from focus unit at layer 3, widening to input */}
      <motion.polygon
        points={[
          // Top: single focus unit at layer 3
          `${cx(focusIdx) - cellW / 2 + 2},${layer3Y + cellH}`,
          `${cx(focusIdx) + cellW / 2 - 2},${layer3Y + cellH}`,
          // Expand through layer 2
          `${cx(layers[1].rfEnd) + cellW / 2},${layer2Y + cellH / 2}`,
          // Bottom-right: widest extent at input
          `${cx(layers[2].rfEnd) + cellW / 2 + 2},${inputY}`,
          // Bottom-left: widest extent at input
          `${cx(layers[2].rfStart) - cellW / 2 - 2},${inputY}`,
          // Expand through layer 2
          `${cx(layers[1].rfStart) - cellW / 2},${layer2Y + cellH / 2}`,
        ].join(' ')}
        fill="var(--color-accent)"
        fillOpacity="0.07"
        stroke="var(--color-accent)"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Vertical trace lines from focus unit down through each layer boundary */}
      {/* Left edge lines */}
      {[
        { x1: cx(focusIdx) - cellW / 2 + 2, y1: layer3Y + cellH, x2: cx(4) - cellW / 2, y2: layer2Y + cellH, d: 1.5 },
        { x1: cx(4) - cellW / 2, y1: layer2Y, x2: cx(3) - cellW / 2, y2: layer1Y + cellH, d: 1.55 },
        { x1: cx(3) - cellW / 2, y1: layer1Y, x2: cx(2) - cellW / 2 - 2, y2: inputY + cellH, d: 1.6 },
      ].map((line, i) => (
        <motion.line
          key={`trace-left-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="3 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: line.d, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* Right edge lines */}
      {[
        { x1: cx(focusIdx) + cellW / 2 - 2, y1: layer3Y + cellH, x2: cx(6) + cellW / 2, y2: layer2Y + cellH, d: 1.5 },
        { x1: cx(6) + cellW / 2, y1: layer2Y, x2: cx(7) + cellW / 2, y2: layer1Y + cellH, d: 1.55 },
        { x1: cx(7) + cellW / 2, y1: layer1Y, x2: cx(8) + cellW / 2 + 2, y2: inputY + cellH, d: 1.6 },
      ].map((line, i) => (
        <motion.line
          key={`trace-right-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeDasharray="3 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: line.d, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* ════════════════════════════════════════════════
          FOCUS UNIT MARKER (top layer)
          ════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Small arrow pointing down to the focus cell */}
        <polygon
          points={`${cx(focusIdx)},${layer3Y - 2} ${cx(focusIdx) - 4},${layer3Y - 8} ${cx(focusIdx) + 4},${layer3Y - 8}`}
          fill="var(--color-accent)"
        />
        <text
          x={cx(focusIdx)}
          y={layer3Y - 12}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Output unit
        </text>
      </motion.g>

      {/* ════════════════════════════════════════════════
          TITLE
          ════════════════════════════════════════════════ */}
      <motion.text
        x="240"
        y="14"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="700"
        initial={{ opacity: 0, y: -4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.4, delay: 0.05, ease: PRODUCTIVE_EASE }}
      >
        Receptive Field Growth in Stacked Conv1D
      </motion.text>

      {/* Subtitle / kernel size note */}
      <motion.text
        x="240"
        y="27"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontFamily="var(--font-mono, monospace)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        kernel_size=3, stride=1, same padding
      </motion.text>

      {/* ════════════════════════════════════════════════
          ANNOTATION
          ════════════════════════════════════════════════ */}
      <motion.text
        x="240"
        y={timeAxisY - 14}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.85 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        Receptive field grows with depth but may still miss long-range patterns
      </motion.text>
    </svg>
  )
}
