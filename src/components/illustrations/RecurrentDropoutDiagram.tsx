'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RecurrentDropoutDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function RecurrentDropoutDiagram({
  className,
}: RecurrentDropoutDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ── layout constants ─────────────────────────────── */
  const panelW = 230
  const panelLeftX = 10
  const panelRightX = 280

  const titleY = 16

  /* 3 timestep rows, each with 4 neurons across */
  const timesteps = 3
  const neurons = 4
  const neuronR = 7
  const neuronSpacingX = 24 // horizontal gap between neuron centers
  const rowSpacingY = 68 // vertical gap between timestep rows
  const firstRowY = 68 // y of first row of neurons

  /* Width occupied by 4 neurons */
  const neuronBlockW = (neurons - 1) * neuronSpacingX

  /* Center the neuron block within each panel */
  const neuronBlockLeftStart = panelLeftX + (panelW - neuronBlockW) / 2
  const neuronBlockRightStart = panelRightX + (panelW - neuronBlockW) / 2

  const neuronCX = (n: number, blockStart: number) =>
    blockStart + n * neuronSpacingX
  const neuronCY = (t: number) => firstRowY + t * rowSpacingY

  const labelY = 280

  /* ── dropout masks ─────────────────────────────────
     Standard dropout: different neurons dropped each timestep
     Recurrent dropout: same neurons dropped across all timesteps */

  const standardDropped: boolean[][] = [
    [false, true, false, true],
    [true, false, true, false],
    [false, false, true, true],
  ]

  const recurrentDroppedMask = [false, true, false, true]

  const isStandardDropped = (t: number, n: number) => standardDropped[t][n]
  const isRecurrentDropped = (_t: number, n: number) => recurrentDroppedMask[n]

  /* ── helper to render a neuron ──────────────────── */
  const renderNeuron = (
    panel: 'std' | 'rec',
    t: number,
    n: number,
    cx: number,
    cy: number,
    dropped: boolean,
    delay: number
  ) => (
    <motion.g
      key={`${panel}-neuron-${t}-${n}`}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={
        isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
      }
      transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
    >
      <circle
        cx={cx}
        cy={cy}
        r={neuronR}
        fill={
          dropped ? 'var(--color-bg-tertiary)' : 'var(--color-accent-subtle)'
        }
        stroke={
          dropped ? 'var(--color-border-primary)' : 'var(--color-accent)'
        }
        strokeWidth={dropped ? 1 : 1.5}
        opacity={dropped ? 0.4 : 1}
      />
      {dropped && (
        <>
          <line
            x1={cx - 4}
            y1={cy - 4}
            x2={cx + 4}
            y2={cy + 4}
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1={cx + 4}
            y1={cy - 4}
            x2={cx - 4}
            y2={cy + 4}
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      )}
    </motion.g>
  )

  /* ── helper to render hidden-state arrow between rows ── */
  const renderHiddenArrow = (
    panel: 'std' | 'rec',
    t: number,
    midX: number,
    delay: number
  ) => {
    const y1 = neuronCY(t) + neuronR + 6
    const y2 = neuronCY(t + 1) - neuronR - 6
    return (
      <motion.g
        key={`${panel}-arrow-${t}`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={midX}
          y1={y1}
          x2={midX}
          y2={y2}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-recurrent-dropout)"
        />
        <text
          x={midX + 12}
          y={(y1 + y2) / 2 + 3}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontFamily="var(--font-mono, monospace)"
        >
          h
          <tspan fontSize="9" baselineShift="sub">
            {t + 1}
          </tspan>
        </text>
      </motion.g>
    )
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 300"
      className={className}
      role="img"
      aria-label="Diagram comparing standard dropout with different masks per timestep versus recurrent dropout with the same mask preserved across all timesteps in RNNs"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-recurrent-dropout"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-accent)" />
        </marker>

        <marker
          id="arrowhead-recurrent-dropout-dim"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 7 3.5, 0 7"
            fill="var(--color-border-primary)"
          />
        </marker>
      </defs>

      {/* ════════════════════════════════════════════════
          PANEL SEPARATOR
          ════════════════════════════════════════════════ */}
      <motion.line
        x1="265"
        y1="4"
        x2="265"
        y2="296"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      />

      {/* ════════════════════════════════════════════════
          LEFT PANEL  ─  Standard Dropout
          ════════════════════════════════════════════════ */}

      <motion.text
        x={panelLeftX + panelW / 2}
        y={titleY}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="700"
        initial={{ opacity: 0, y: -4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.4, delay: 0.05, ease: PRODUCTIVE_EASE }}
      >
        Standard Dropout
      </motion.text>

      {/* Timestep row labels */}
      {Array.from({ length: timesteps }).map((_, t) => (
        <motion.text
          key={`std-t-label-${t}`}
          x={neuronBlockLeftStart - 18}
          y={neuronCY(t) + 3}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
          fontFamily="var(--font-mono, monospace)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1 + t * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {`t=${t + 1}`}
        </motion.text>
      ))}

      {/* Neurons */}
      {Array.from({ length: timesteps }).map((_, t) =>
        Array.from({ length: neurons }).map((__, n) =>
          renderNeuron(
            'std',
            t,
            n,
            neuronCX(n, neuronBlockLeftStart),
            neuronCY(t),
            isStandardDropped(t, n),
            0.15 + t * 0.2 + n * 0.04
          )
        )
      )}

      {/* Hidden-state arrows between timestep rows */}
      {Array.from({ length: timesteps - 1 }).map((_, t) =>
        renderHiddenArrow(
          'std',
          t,
          neuronBlockLeftStart + neuronBlockW / 2,
          0.7 + t * 0.15
        )
      )}

      {/* Per-timestep mask annotations (right of neurons) */}
      {Array.from({ length: timesteps }).map((_, t) => {
        const annotX = neuronCX(neurons - 1, neuronBlockLeftStart) + neuronR + 8
        return (
          <motion.text
            key={`std-mask-${t}`}
            x={annotX}
            y={neuronCY(t) + 3}
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
            initial={{ opacity: 0, x: 4 }}
            animate={
              isInView ? { opacity: 0.7, x: 0 } : { opacity: 0, x: 4 }
            }
            transition={{
              duration: 0.35,
              delay: 0.9 + t * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            mask {t + 1}
          </motion.text>
        )
      })}

      {/* Bottom caption */}
      <motion.text
        x={panelLeftX + panelW / 2}
        y={labelY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.9 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Different mask each timestep
      </motion.text>
      <motion.text
        x={panelLeftX + panelW / 2}
        y={labelY + 11}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.9 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        {'\u2192 breaks temporal patterns'}
      </motion.text>

      {/* ════════════════════════════════════════════════
          RIGHT PANEL  ─  Recurrent Dropout
          ════════════════════════════════════════════════ */}

      <motion.text
        x={panelRightX + panelW / 2}
        y={titleY}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="700"
        initial={{ opacity: 0, y: -4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.4, delay: 0.05, ease: PRODUCTIVE_EASE }}
      >
        Recurrent Dropout
      </motion.text>

      {/* Timestep row labels */}
      {Array.from({ length: timesteps }).map((_, t) => (
        <motion.text
          key={`rec-t-label-${t}`}
          x={neuronBlockRightStart - 18}
          y={neuronCY(t) + 3}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
          fontFamily="var(--font-mono, monospace)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.1 + t * 0.05,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {`t=${t + 1}`}
        </motion.text>
      ))}

      {/* Consistency highlight columns behind dropped neurons */}
      {Array.from({ length: neurons }).map((_, n) => {
        if (!recurrentDroppedMask[n]) return null
        const cx = neuronCX(n, neuronBlockRightStart)
        const topY = neuronCY(0) - neuronR - 5
        const bottomY = neuronCY(timesteps - 1) + neuronR + 5

        return (
          <motion.rect
            key={`rec-col-${n}`}
            x={cx - neuronR - 3}
            y={topY}
            width={neuronR * 2 + 6}
            height={bottomY - topY}
            rx="4"
            fill="var(--color-accent)"
            fillOpacity="0.07"
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            strokeDasharray="3 2"
            strokeOpacity="0.35"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.3, ease: PRODUCTIVE_EASE }}
          />
        )
      })}

      {/* Neurons */}
      {Array.from({ length: timesteps }).map((_, t) =>
        Array.from({ length: neurons }).map((__, n) =>
          renderNeuron(
            'rec',
            t,
            n,
            neuronCX(n, neuronBlockRightStart),
            neuronCY(t),
            isRecurrentDropped(t, n),
            0.15 + t * 0.2 + n * 0.04
          )
        )
      )}

      {/* Hidden-state arrows between timestep rows */}
      {Array.from({ length: timesteps - 1 }).map((_, t) =>
        renderHiddenArrow(
          'rec',
          t,
          neuronBlockRightStart + neuronBlockW / 2,
          0.7 + t * 0.15
        )
      )}

      {/* "Same mask" bracket annotation */}
      {(() => {
        const bracketX =
          neuronCX(neurons - 1, neuronBlockRightStart) + neuronR + 8
        const topY = neuronCY(0)
        const bottomY = neuronCY(timesteps - 1)
        const midY = (topY + bottomY) / 2

        return (
          <motion.g
            initial={{ opacity: 0, x: 4 }}
            animate={
              isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 4 }
            }
            transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
          >
            <path
              d={`M ${bracketX} ${topY - 8} L ${bracketX + 6} ${topY - 8} L ${bracketX + 6} ${bottomY + 8} L ${bracketX} ${bottomY + 8}`}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.6"
            />
            <text
              x={bracketX + 10}
              y={midY - 2}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
              fontStyle="italic"
            >
              same
            </text>
            <text
              x={bracketX + 10}
              y={midY + 8}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
              fontStyle="italic"
            >
              mask
            </text>
          </motion.g>
        )
      })()}

      {/* Bottom caption */}
      <motion.text
        x={panelRightX + panelW / 2}
        y={labelY}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Same mask every timestep
      </motion.text>
      <motion.text
        x={panelRightX + panelW / 2}
        y={labelY + 11}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        {'\u2192 preserves temporal continuity'}
      </motion.text>
    </svg>
  )
}
