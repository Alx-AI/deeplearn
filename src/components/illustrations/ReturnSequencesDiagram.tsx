'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ReturnSequencesDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ReturnSequencesDiagram({ className }: ReturnSequencesDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ── layout constants ─────────────────────────────── */
  const steps = [0, 1, 2, 3]

  // Top section: return_sequences=False  (left)  vs  =True (right)
  const panelLeft = 10
  const panelRight = 268
  const panelW = 240

  // Vertical positions within each panel
  const outputY = 18
  const cellY = 54
  const cellH = 28
  const cellW = 36
  const inputY = 116
  const shapeY = 138

  // Horizontal spacing for 4 timesteps inside a panel
  const cellGap = (i: number, baseX: number) => baseX + 24 + i * 54

  // Stacking section
  const stackY = 170

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 336"
      className={className}
      role="img"
      aria-label="Diagram comparing return_sequences False (last state only) versus True (full sequence output) in RNNs, plus stacked LSTM example"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrowhead for hidden-state flow */}
        <marker
          id="arrowhead-return-seq"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-accent)" />
        </marker>

        {/* Arrowhead for i/o lines */}
        <marker
          id="arrowhead-return-seq-io"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="var(--color-text-secondary)" />
        </marker>

        {/* Arrowhead for ghosted (inactive) outputs */}
        <marker
          id="arrowhead-return-seq-ghost"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 6 3, 0 6" fill="var(--color-border-primary)" />
        </marker>

        {/* Arrowhead for stacking flow */}
        <marker
          id="arrowhead-return-seq-stack"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* ════════════════════════════════════════════════
          SECTION TITLES
          ════════════════════════════════════════════════ */}

      {/* Panel separator */}
      <motion.line
        x1="258"
        y1="4"
        x2="258"
        y2="152"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      />

      {/* ════════════════════════════════════════════════
          LEFT PANEL  ─  return_sequences=False
          ════════════════════════════════════════════════ */}

      {/* Panel title */}
      <motion.text
        x={panelLeft + panelW / 2}
        y={8}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-mono, monospace)"
        initial={{ opacity: 0, y: -4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.4, delay: 0.05, ease: PRODUCTIVE_EASE }}
      >
        return_sequences=False
      </motion.text>

      {/* RNN cells */}
      {steps.map((i) => {
        const cx = cellGap(i, panelLeft)
        const delay = 0.15 + i * 0.1
        const isLast = i === 3

        return (
          <motion.g
            key={`left-cell-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.45, delay, ease: PRODUCTIVE_EASE }}
          >
            {/* Cell box */}
            <rect
              x={cx}
              y={cellY}
              width={cellW}
              height={cellH}
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <text
              x={cx + cellW / 2}
              y={cellY + cellH / 2 + 4}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              RNN
            </text>

            {/* Input arrow x_i */}
            <line
              x1={cx + cellW / 2}
              y1={inputY - 8}
              x2={cx + cellW / 2}
              y2={cellY + cellH}
              stroke="var(--color-text-secondary)"
              strokeWidth="1.2"
              markerEnd="url(#arrowhead-return-seq-io)"
            />
            <text
              x={cx + cellW / 2}
              y={inputY}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="10"
            >
              x<tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
            </text>

            {/* Output arrow h_i  ─  ghosted unless last */}
            <line
              x1={cx + cellW / 2}
              y1={cellY}
              x2={cx + cellW / 2}
              y2={outputY + 8}
              stroke={isLast ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              strokeWidth={isLast ? 1.8 : 1}
              strokeDasharray={isLast ? 'none' : '3 3'}
              markerEnd={isLast ? 'url(#arrowhead-return-seq)' : 'url(#arrowhead-return-seq-ghost)'}
            />
            <text
              x={cx + cellW / 2}
              y={outputY}
              textAnchor="middle"
              fill={isLast ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              fontSize="10"
              fontWeight={isLast ? 600 : 400}
            >
              h<tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
            </text>
          </motion.g>
        )
      })}

      {/* Hidden-state arrows between cells (left panel) */}
      {[0, 1, 2].map((i) => {
        const x1 = cellGap(i, panelLeft) + cellW
        const x2 = cellGap(i + 1, panelLeft)
        const y = cellY + cellH / 2
        const delay = 0.7 + i * 0.1

        return (
          <motion.line
            key={`left-arrow-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="var(--color-accent)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-return-seq)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
          />
        )
      })}

      {/* Highlight bracket around last output */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={cellGap(3, panelLeft) - 2}
          y={outputY - 6}
          width={cellW + 4}
          height={14}
          rx="3"
          fill="var(--color-accent)"
          fillOpacity="0.12"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </motion.g>

      {/* Shape label */}
      <motion.text
        x={panelLeft + panelW / 2}
        y={shapeY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontFamily="var(--font-mono, monospace)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Output: (batch, features)
      </motion.text>

      {/* Sub-label */}
      <motion.text
        x={panelLeft + panelW / 2}
        y={shapeY + 12}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Last state only
      </motion.text>

      {/* ════════════════════════════════════════════════
          RIGHT PANEL  ─  return_sequences=True
          ════════════════════════════════════════════════ */}

      {/* Panel title */}
      <motion.text
        x={panelRight + panelW / 2}
        y={8}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="10"
        fontWeight="700"
        fontFamily="var(--font-mono, monospace)"
        initial={{ opacity: 0, y: -4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
        transition={{ duration: 0.4, delay: 0.05, ease: PRODUCTIVE_EASE }}
      >
        return_sequences=True
      </motion.text>

      {/* RNN cells */}
      {steps.map((i) => {
        const cx = cellGap(i, panelRight)
        const delay = 0.15 + i * 0.1

        return (
          <motion.g
            key={`right-cell-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.45, delay, ease: PRODUCTIVE_EASE }}
          >
            {/* Cell box */}
            <rect
              x={cx}
              y={cellY}
              width={cellW}
              height={cellH}
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <text
              x={cx + cellW / 2}
              y={cellY + cellH / 2 + 4}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              RNN
            </text>

            {/* Input arrow x_i */}
            <line
              x1={cx + cellW / 2}
              y1={inputY - 8}
              x2={cx + cellW / 2}
              y2={cellY + cellH}
              stroke="var(--color-text-secondary)"
              strokeWidth="1.2"
              markerEnd="url(#arrowhead-return-seq-io)"
            />
            <text
              x={cx + cellW / 2}
              y={inputY}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="10"
            >
              x<tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
            </text>

            {/* Output arrow h_i  ─  ALL highlighted */}
            <line
              x1={cx + cellW / 2}
              y1={cellY}
              x2={cx + cellW / 2}
              y2={outputY + 8}
              stroke="var(--color-accent)"
              strokeWidth="1.8"
              markerEnd="url(#arrowhead-return-seq)"
            />
            <text
              x={cx + cellW / 2}
              y={outputY}
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="10"
              fontWeight="600"
            >
              h<tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
            </text>
          </motion.g>
        )
      })}

      {/* Hidden-state arrows between cells (right panel) */}
      {[0, 1, 2].map((i) => {
        const x1 = cellGap(i, panelRight) + cellW
        const x2 = cellGap(i + 1, panelRight)
        const y = cellY + cellH / 2
        const delay = 0.7 + i * 0.1

        return (
          <motion.line
            key={`right-arrow-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="var(--color-accent)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-return-seq)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
          />
        )
      })}

      {/* Highlight bracket across all outputs */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={cellGap(0, panelRight) - 2}
          y={outputY - 6}
          width={cellGap(3, panelRight) + cellW + 2 - (cellGap(0, panelRight) - 2)}
          height={14}
          rx="3"
          fill="var(--color-accent)"
          fillOpacity="0.12"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
      </motion.g>

      {/* Shape label */}
      <motion.text
        x={panelRight + panelW / 2}
        y={shapeY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontFamily="var(--font-mono, monospace)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Output: (batch, timesteps, features)
      </motion.text>

      {/* Sub-label */}
      <motion.text
        x={panelRight + panelW / 2}
        y={shapeY + 12}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Full sequence output
      </motion.text>

      {/* ════════════════════════════════════════════════
          HORIZONTAL RULE between sections
          ════════════════════════════════════════════════ */}
      <motion.line
        x1="20"
        y1={stackY - 6}
        x2="500"
        y2={stackY - 6}
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      />

      {/* ════════════════════════════════════════════════
          STACKING SECTION
          ════════════════════════════════════════════════ */}

      {/* Section title */}
      <motion.text
        x="260"
        y={stackY + 8}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="700"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Stacking: LSTM layers
      </motion.text>

      {/* ── Layout for stacking ── */}
      {(() => {
        const sInputY = stackY + 120
        const sRow1Y = stackY + 82   // first LSTM row
        const sRow2Y = stackY + 40   // second LSTM row
        const sFinalY = stackY + 18  // final output
        const sCellW = 36
        const sCellH = 24
        const sBaseX = 150
        const sGap = 80

        return (
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
          >
            {/* ── First LSTM row (return_sequences=True) ── */}
            {steps.map((i) => {
              const cx = sBaseX + i * sGap
              return (
                <g key={`stack-row1-${i}`}>
                  {/* Cell */}
                  <motion.rect
                    x={cx}
                    y={sRow1Y}
                    width={sCellW}
                    height={sCellH}
                    rx="3"
                    fill="var(--color-accent-subtle)"
                    stroke="var(--color-accent)"
                    strokeWidth="1.5"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4, delay: 1.6 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  />
                  <motion.text
                    x={cx + sCellW / 2}
                    y={sRow1Y + sCellH / 2 + 3.5}
                    textAnchor="middle"
                    fill="var(--color-accent)"
                    fontSize="9"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 1.65 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  >
                    LSTM
                  </motion.text>

                  {/* Input arrows to row 1 */}
                  <motion.line
                    x1={cx + sCellW / 2}
                    y1={sInputY - 4}
                    x2={cx + sCellW / 2}
                    y2={sRow1Y + sCellH}
                    stroke="var(--color-text-secondary)"
                    strokeWidth="1"
                    markerEnd="url(#arrowhead-return-seq-io)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 1.7 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  />
                  <motion.text
                    x={cx + sCellW / 2}
                    y={sInputY + 4}
                    textAnchor="middle"
                    fill="var(--color-text-secondary)"
                    fontSize="9"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 1.7 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  >
                    x<tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
                  </motion.text>

                  {/* Output arrows from row 1 to row 2  ─  all active (return_sequences=True) */}
                  <motion.line
                    x1={cx + sCellW / 2}
                    y1={sRow1Y}
                    x2={cx + sCellW / 2}
                    y2={sRow2Y + sCellH}
                    stroke="var(--color-accent)"
                    strokeWidth="1.2"
                    markerEnd="url(#arrowhead-return-seq)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 1.9 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  />

                  {/* Hidden-state arrows (row 1) */}
                  {i < 3 && (
                    <motion.line
                      x1={cx + sCellW}
                      y1={sRow1Y + sCellH / 2}
                      x2={cx + sGap}
                      y2={sRow1Y + sCellH / 2}
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-return-seq)"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.3, delay: 1.85 + i * 0.08, ease: PRODUCTIVE_EASE }}
                    />
                  )}
                </g>
              )
            })}

            {/* ── Second LSTM row (return_sequences=False) ── */}
            {steps.map((i) => {
              const cx = sBaseX + i * sGap
              const isLast = i === 3

              return (
                <g key={`stack-row2-${i}`}>
                  {/* Cell */}
                  <motion.rect
                    x={cx}
                    y={sRow2Y}
                    width={sCellW}
                    height={sCellH}
                    rx="3"
                    fill="var(--color-bg-elevated)"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1.5"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4, delay: 2.0 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  />
                  <motion.text
                    x={cx + sCellW / 2}
                    y={sRow2Y + sCellH / 2 + 3.5}
                    textAnchor="middle"
                    fill="var(--color-text-primary)"
                    fontSize="9"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 2.05 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  >
                    LSTM
                  </motion.text>

                  {/* Output arrow from row 2  ─  only last is active */}
                  <motion.line
                    x1={cx + sCellW / 2}
                    y1={sRow2Y}
                    x2={cx + sCellW / 2}
                    y2={sFinalY + 6}
                    stroke={isLast ? 'var(--color-accent)' : 'var(--color-border-primary)'}
                    strokeWidth={isLast ? 1.5 : 0.8}
                    strokeDasharray={isLast ? 'none' : '3 3'}
                    markerEnd={isLast ? 'url(#arrowhead-return-seq)' : 'url(#arrowhead-return-seq-ghost)'}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: isLast ? 1 : 0.5 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: 2.2 + i * 0.08, ease: PRODUCTIVE_EASE }}
                  />

                  {/* Hidden-state arrows (row 2) */}
                  {i < 3 && (
                    <motion.line
                      x1={cx + sCellW}
                      y1={sRow2Y + sCellH / 2}
                      x2={cx + sGap}
                      y2={sRow2Y + sCellH / 2}
                      stroke="var(--color-border-primary)"
                      strokeWidth="1.5"
                      markerEnd="url(#arrowhead-return-seq-ghost)"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
                      transition={{ duration: 0.3, delay: 2.15 + i * 0.08, ease: PRODUCTIVE_EASE }}
                    />
                  )}
                </g>
              )
            })}

            {/* ── Row labels (left side) ── */}
            <motion.text
              x={sBaseX - 6}
              y={sRow1Y + sCellH / 2 + 3}
              textAnchor="end"
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono, monospace)"
              initial={{ opacity: 0, x: -4 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
              transition={{ duration: 0.4, delay: 2.3, ease: PRODUCTIVE_EASE }}
            >
              return_sequences=True
            </motion.text>

            <motion.text
              x={sBaseX - 6}
              y={sRow2Y + sCellH / 2 + 3}
              textAnchor="end"
              fill="var(--color-text-secondary)"
              fontSize="9"
              fontWeight="600"
              fontFamily="var(--font-mono, monospace)"
              initial={{ opacity: 0, x: -4 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
              transition={{ duration: 0.4, delay: 2.35, ease: PRODUCTIVE_EASE }}
            >
              return_sequences=False
            </motion.text>

            {/* Final output label */}
            <motion.text
              x={sBaseX + 3 * sGap + sCellW + 10}
              y={sFinalY + 8}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 2.45, ease: PRODUCTIVE_EASE }}
            >
              output
            </motion.text>

            {/* Annotation: full sequence feeds next layer */}
            <motion.text
              x="260"
              y={stackY + 130}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              fontStyle="italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 2.5, ease: PRODUCTIVE_EASE }}
            >
              First LSTM emits full sequence so the second LSTM receives input at every step
            </motion.text>
          </motion.g>
        )
      })()}
    </svg>
  )
}
