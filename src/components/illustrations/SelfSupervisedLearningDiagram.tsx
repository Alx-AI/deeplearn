'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SelfSupervisedLearningDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function SelfSupervisedLearningDiagram({
  className = '',
}: SelfSupervisedLearningDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ── Layout constants ─────────────────────────────────────── */
  const sentenceY = 30
  const modelY = 88
  const predictionY = 152

  const tokens = ['The', 'cat', 'sat', 'on', 'the']
  const maskToken = '[MASK]'
  const tokenW = 40
  const maskW = 52
  const tokenH = 24
  const tokenGap = 6
  const sentenceStartX = 28

  /* Probability bars for prediction output */
  const probBars = [
    { label: 'mat', prob: 0.82 },
    { label: 'rug', prob: 0.09 },
    { label: 'bed', prob: 0.05 },
    { label: '...', prob: 0.04 },
  ]
  const probBarMaxW = 80
  const probBarH = 10
  const probBarGap = 3

  /* ── Supervised side-panel constants ─────────────────────── */
  const panelX = 370
  const panelY = 22
  const panelW = 120
  const panelH = 140

  /* ── Animation variants ─────────────────────────────────── */
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    transition: { duration: 0.5, delay, ease: PRODUCTIVE_EASE },
  })

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0 },
    animate: isInView ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.5, delay, ease: PRODUCTIVE_EASE },
  })

  /* ── Helpers ──────────────────────────────────────────────── */
  const tokenX = (i: number) => {
    let x = sentenceStartX
    for (let j = 0; j < i; j++) {
      x += tokenW + tokenGap
    }
    return x
  }

  const maskX = tokenX(tokens.length)
  const sentenceTotalW =
    tokens.length * (tokenW + tokenGap) + maskW

  const sentenceCenterX = sentenceStartX + sentenceTotalW / 2

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 240"
      className={className}
      role="img"
      aria-label="Self-supervised learning diagram showing how a model predicts a masked word using labels derived from the data itself, contrasted with supervised learning that requires human labels"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="ssl-arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
        <marker
          id="ssl-arrowhead-accent"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* ── Main Flow (left side, 0..360) ───────────────────── */}

      {/* Section label: Input */}
      <motion.text
        x="8"
        y={sentenceY + tokenH / 2 + 1}
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontWeight="500"
        dominantBaseline="middle"
        {...fadeIn(0)}
      >
        Input
      </motion.text>

      {/* Regular tokens */}
      {tokens.map((token, i) => (
        <motion.g key={`tok-${i}`} {...fadeUp(0.1 + i * 0.06)}>
          <rect
            x={tokenX(i)}
            y={sentenceY}
            width={tokenW}
            height={tokenH}
            rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x={tokenX(i) + tokenW / 2}
            y={sentenceY + tokenH / 2 + 1}
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="500"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {token}
          </text>
        </motion.g>
      ))}

      {/* [MASK] token -- highlighted */}
      <motion.g {...fadeUp(0.4)}>
        <rect
          x={maskX}
          y={sentenceY}
          width={maskW}
          height={tokenH}
          rx="3"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x={maskX + maskW / 2}
          y={sentenceY + tokenH / 2 + 1}
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {maskToken}
        </text>
      </motion.g>

      {/* Arrow: sentence -> model */}
      <motion.line
        x1={sentenceCenterX}
        y1={sentenceY + tokenH + 2}
        x2={sentenceCenterX}
        y2={modelY - 2}
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#ssl-arrowhead)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Model box */}
      <motion.g {...fadeUp(0.6)}>
        <rect
          x={sentenceCenterX - 70}
          y={modelY}
          width={140}
          height={36}
          rx="5"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x={sentenceCenterX}
          y={modelY + 14}
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          Language Model
        </text>
        <text
          x={sentenceCenterX}
          y={modelY + 27}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          (Transformer)
        </text>
      </motion.g>

      {/* Arrow: model -> prediction */}
      <motion.line
        x1={sentenceCenterX}
        y1={modelY + 38}
        x2={sentenceCenterX}
        y2={predictionY - 2}
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#ssl-arrowhead)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.4, delay: 0.75, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Prediction output area ──────────────────────────── */}
      <motion.g {...fadeUp(0.9)}>
        {/* Background panel for predictions */}
        <rect
          x={sentenceCenterX - 90}
          y={predictionY}
          width={180}
          height={probBars.length * (probBarH + probBarGap) + 18}
          rx="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* "Prediction" label */}
        <text
          x={sentenceCenterX - 82}
          y={predictionY + 12}
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="500"
        >
          P(masked word)
        </text>

        {/* Probability bars */}
        {probBars.map((bar, i) => {
          const barY = predictionY + 20 + i * (probBarH + probBarGap)
          const labelX = sentenceCenterX - 82
          const barStartX = sentenceCenterX - 42
          const isTop = i === 0

          return (
            <g key={`prob-${i}`}>
              {/* Word label */}
              <text
                x={labelX}
                y={barY + probBarH / 2 + 1}
                fill={
                  isTop
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)'
                }
                fontSize="9"
                fontWeight={isTop ? '600' : '400'}
                dominantBaseline="middle"
              >
                {bar.label}
              </text>

              {/* Bar background */}
              <rect
                x={barStartX}
                y={barY}
                width={probBarMaxW}
                height={probBarH}
                rx="2"
                fill="var(--color-bg-tertiary)"
              />

              {/* Filled bar */}
              <motion.rect
                x={barStartX}
                y={barY}
                height={probBarH}
                rx="2"
                fill={
                  isTop
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)'
                }
                opacity={isTop ? 0.85 : 0.25}
                initial={{ width: 0 }}
                animate={
                  isInView
                    ? { width: bar.prob * probBarMaxW }
                    : { width: 0 }
                }
                transition={{
                  duration: 0.6,
                  delay: 1.0 + i * 0.08,
                  ease: PRODUCTIVE_EASE,
                }}
              />

              {/* Percentage */}
              <text
                x={barStartX + probBarMaxW + 6}
                y={barY + probBarH / 2 + 1}
                fill={
                  isTop
                    ? 'var(--color-accent)'
                    : 'var(--color-text-tertiary)'
                }
                fontSize="9"
                fontWeight={isTop ? '600' : '400'}
                dominantBaseline="middle"
              >
                {Math.round(bar.prob * 100)}%
              </text>
            </g>
          )
        })}
      </motion.g>

      {/* ── Key insight: curving arrow from mask back to prediction ─ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Curved arrow from the original word position to the label area */}
        <motion.path
          d={`M ${maskX + maskW + 4} ${sentenceY + tokenH / 2}
              Q ${maskX + maskW + 30} ${sentenceY + tokenH / 2}, ${maskX + maskW + 30} ${predictionY - 8}
              L ${maskX + maskW + 30} ${predictionY + 18}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#ssl-arrowhead-accent)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.7, delay: 1.5, ease: PRODUCTIVE_EASE }}
        />

        {/* Annotation: label comes from data */}
        <text
          x={maskX + maskW + 26}
          y={sentenceY + tokenH / 2 + 18}
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
          textAnchor="end"
        >
          Label = original
        </text>
        <text
          x={maskX + maskW + 26}
          y={sentenceY + tokenH / 2 + 28}
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
          textAnchor="end"
        >
          word (&quot;mat&quot;)
        </text>
        <text
          x={maskX + maskW + 26}
          y={sentenceY + tokenH / 2 + 40}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
          textAnchor="end"
        >
          from data itself
        </text>
      </motion.g>

      {/* ── Supervised Learning contrast panel ─────────────── */}

      {/* Dashed vertical divider */}
      <motion.line
        x1={panelX - 10}
        y1={panelY - 6}
        x2={panelX - 10}
        y2={panelY + panelH + 30}
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 3"
        {...fadeIn(1.6)}
      />

      {/* Panel background */}
      <motion.rect
        x={panelX}
        y={panelY}
        width={panelW}
        height={panelH}
        rx="5"
        fill="var(--color-bg-tertiary)"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        opacity="0.7"
        {...fadeIn(1.7)}
      />

      {/* Panel title */}
      <motion.text
        x={panelX + panelW / 2}
        y={panelY + 14}
        fill="var(--color-text-secondary)"
        fontSize="9"
        fontWeight="600"
        textAnchor="middle"
        {...fadeIn(1.7)}
      >
        Supervised
      </motion.text>

      {/* Input box */}
      <motion.g {...fadeIn(1.85)}>
        <rect
          x={panelX + 10}
          y={panelY + 26}
          width={panelW - 20}
          height={20}
          rx="3"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x={panelX + panelW / 2}
          y={panelY + 37}
          fill="var(--color-text-primary)"
          fontSize="9"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          image of a cat
        </text>
      </motion.g>

      {/* Small arrow */}
      <motion.line
        x1={panelX + panelW / 2}
        y1={panelY + 48}
        x2={panelX + panelW / 2}
        y2={panelY + 56}
        stroke="var(--color-text-tertiary)"
        strokeWidth="1"
        markerEnd="url(#ssl-arrowhead)"
        {...fadeIn(1.95)}
      />

      {/* Human label box */}
      <motion.g {...fadeIn(2.0)}>
        <rect
          x={panelX + 10}
          y={panelY + 58}
          width={panelW - 20}
          height={20}
          rx="3"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />
        <text
          x={panelX + panelW / 2}
          y={panelY + 69}
          fill="var(--color-text-secondary)"
          fontSize="9"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          label: "cat"
        </text>
      </motion.g>

      {/* Human annotator icon (simple person silhouette) */}
      <motion.g {...fadeIn(2.1)}>
        {/* Head */}
        <circle
          cx={panelX + panelW / 2}
          cy={panelY + 96}
          r="5"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
        />
        {/* Body */}
        <line
          x1={panelX + panelW / 2}
          y1={panelY + 101}
          x2={panelX + panelW / 2}
          y2={panelY + 112}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
        />
        {/* Arms */}
        <line
          x1={panelX + panelW / 2 - 7}
          y1={panelY + 105}
          x2={panelX + panelW / 2 + 7}
          y2={panelY + 105}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
        />

        {/* Arrow from human to label */}
        <line
          x1={panelX + panelW / 2}
          y1={panelY + 90}
          x2={panelX + panelW / 2}
          y2={panelY + 80}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          markerEnd="url(#ssl-arrowhead)"
        />

        <text
          x={panelX + panelW / 2}
          y={panelY + 124}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          textAnchor="middle"
          fontStyle="italic"
        >
          human annotator
        </text>
      </motion.g>

      {/* Cost callout */}
      <motion.text
        x={panelX + panelW / 2}
        y={panelY + panelH + 4}
        fill="var(--color-text-tertiary)"
        fontSize="9"
        textAnchor="middle"
        fontWeight="500"
        {...fadeIn(2.2)}
      >
        Expensive + slow
      </motion.text>

      {/* ── Bottom label ─────────────────────────────────────── */}
      <motion.text
        x="250"
        y="232"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="600"
        {...fadeIn(2.3)}
      >
        Self-Supervised: Labels come from the data
      </motion.text>
    </svg>
  )
}
