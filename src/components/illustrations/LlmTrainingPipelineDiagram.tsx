'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LlmTrainingPipelineDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function LlmTrainingPipelineDiagram({
  className = '',
}: LlmTrainingPipelineDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ── layout constants ───────────────────────────────── */
  const stageW = 148
  const stageGap = 42
  const stageX = (i: number) => 14 + i * (stageW + stageGap)

  /* vertical progression: each stage sits slightly higher */
  const stageY = (i: number) => 58 - i * 8

  /* animation delays per stage */
  const stageDelay = (i: number) => 0.25 + i * 0.55

  /* ── stage data ─────────────────────────────────────── */
  const stages = [
    {
      title: 'Pretraining',
      result: 'Base LLM',
      label: 'Next-token prediction on internet text',
      example: 'Completes text randomly',
    },
    {
      title: 'Instruction Tuning',
      result: 'Instruct LLM',
      label: 'Learn to follow instructions',
      example: 'Follows instructions',
    },
    {
      title: 'RLHF',
      result: 'Aligned Assistant',
      label: 'Human preference alignment',
      example: 'Helpful and safe',
    },
  ]

  /* ── icon renderers (per-stage) ─────────────────────── */
  const renderCorpusIcon = (cx: number, cy: number) => (
    <g transform={`translate(${cx},${cy})`}>
      {/* stack of text pages */}
      <rect x={-12} y={-10} width={24} height={20} rx={2}
        fill="var(--color-bg-tertiary)" stroke="var(--color-border-primary)" strokeWidth={1} />
      <rect x={-10} y={-12} width={24} height={20} rx={2}
        fill="var(--color-bg-tertiary)" stroke="var(--color-border-primary)" strokeWidth={1} />
      <rect x={-8} y={-14} width={24} height={20} rx={2}
        fill="var(--color-bg-elevated)" stroke="var(--color-border-primary)" strokeWidth={1.2} />
      {/* text lines */}
      <line x1={-4} y1={-9} x2={12} y2={-9} stroke="var(--color-text-tertiary)" strokeWidth={1} />
      <line x1={-4} y1={-5} x2={10} y2={-5} stroke="var(--color-text-tertiary)" strokeWidth={1} />
      <line x1={-4} y1={-1} x2={12} y2={-1} stroke="var(--color-text-tertiary)" strokeWidth={1} />
      <line x1={-4} y1={3} x2={8} y2={3} stroke="var(--color-text-tertiary)" strokeWidth={1} />
    </g>
  )

  const renderPromptPairsIcon = (cx: number, cy: number) => (
    <g transform={`translate(${cx},${cy})`}>
      {/* prompt bubble */}
      <rect x={-14} y={-12} width={18} height={10} rx={3}
        fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth={1.2} />
      <text x={-5} y={-5} textAnchor="middle" fontSize={9}
        fill="var(--color-accent)" fontWeight={600}>Q</text>
      {/* response bubble */}
      <rect x={-4} y={2} width={18} height={10} rx={3}
        fill="var(--color-accent-subtle)" stroke="var(--color-accent)" strokeWidth={1.2} />
      <text x={5} y={9} textAnchor="middle" fontSize={9}
        fill="var(--color-accent)" fontWeight={600}>A</text>
      {/* arrow between */}
      <line x1={-2} y1={-1} x2={2} y2={2} stroke="var(--color-text-tertiary)" strokeWidth={0.8} />
    </g>
  )

  const renderHumanRankingIcon = (cx: number, cy: number) => (
    <g transform={`translate(${cx},${cy})`}>
      {/* person silhouette */}
      <circle cx={0} cy={-9} r={4} fill="var(--color-text-secondary)" />
      <path d="M -6,-3 Q 0,3 6,-3" fill="var(--color-text-secondary)" />
      {/* ranking: thumbs up / thumbs down */}
      <text x={-9} y={9} fontSize={9} fill="var(--color-accent)">&#x25B2;</text>
      <text x={3} y={9} fontSize={9} fill="var(--color-text-tertiary)">&#x25BC;</text>
    </g>
  )

  const stageIcons = [renderCorpusIcon, renderPromptPairsIcon, renderHumanRankingIcon]

  /* ── connector arrows between stages ────────────────── */
  const renderConnector = (fromStage: number, delay: number) => {
    const x1 = stageX(fromStage) + stageW
    const x2 = stageX(fromStage + 1)
    const y1 = stageY(fromStage) + 34
    const y2 = stageY(fromStage + 1) + 34
    const mx = (x1 + x2) / 2
    return (
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
      >
        <motion.path
          d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 6} ${y2}`}
          stroke="var(--color-text-secondary)"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrowhead-llm-pipeline)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.1, ease: PRODUCTIVE_EASE }}
        />
      </motion.g>
    )
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 580 260"
      className={className}
      role="img"
      aria-label="LLM training pipeline showing three stages: pretraining, instruction tuning, and RLHF leading to an aligned assistant"
      style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
    >
      <defs>
        <marker
          id="arrowhead-llm-pipeline"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* ── Title ──────────────────────────────────────── */}
      <motion.text
        x={290}
        y={20}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize={14}
        fontWeight={700}
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        LLM Training Pipeline
      </motion.text>

      {/* ── Three stages ───────────────────────────────── */}
      {stages.map((stage, i) => {
        const x = stageX(i)
        const y = stageY(i)
        const d = stageDelay(i)
        const iconX = x + 28
        const iconY = y + 34

        /* inner arrow from icon to result box */
        const arrowFromX = x + 56
        const arrowToX = x + 76
        const arrowY = y + 34

        return (
          <motion.g
            key={stage.title}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: d, ease: PRODUCTIVE_EASE }}
          >
            {/* ── stage container ─────────────────────── */}
            <rect
              x={x}
              y={y}
              width={stageW}
              height={68}
              rx={8}
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth={1.5}
            />

            {/* ── stage title ─────────────────────────── */}
            <text
              x={x + stageW / 2}
              y={y + 14}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="var(--color-text-primary)"
            >
              {stage.title}
            </text>

            {/* ── icon area ───────────────────────────── */}
            {stageIcons[i](iconX, iconY)}

            {/* ── inner arrow icon -> result ──────────── */}
            <line
              x1={x + 44}
              y1={arrowY}
              x2={x + 54}
              y2={arrowY}
              stroke="var(--color-text-tertiary)"
              strokeWidth={1.2}
              markerEnd="url(#arrowhead-llm-pipeline)"
            />

            {/* ── result box ──────────────────────────── */}
            <rect
              x={x + 56}
              y={y + 24}
              width={86}
              height={20}
              rx={4}
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth={1.2}
            />
            <text
              x={x + 99}
              y={y + 37}
              textAnchor="middle"
              fontSize={8}
              fontWeight={600}
              fill="var(--color-accent)"
            >
              {stage.result}
            </text>

            {/* ── description label below stage ──────── */}
            <text
              x={x + stageW / 2}
              y={y + 58}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-text-tertiary)"
              fontStyle="italic"
            >
              {stage.label}
            </text>
          </motion.g>
        )
      })}

      {/* ── Connector arrows between stages ────────────── */}
      {renderConnector(0, stageDelay(1) - 0.15)}
      {renderConnector(1, stageDelay(2) - 0.15)}

      {/* ── Stage number badges ────────────────────────── */}
      {stages.map((_, i) => {
        const cx = stageX(i) + 10
        const cy = stageY(i) - 1
        return (
          <motion.g
            key={`badge-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, delay: stageDelay(i) + 0.15, ease: PRODUCTIVE_EASE }}
          >
            <circle cx={cx} cy={cy} r={8} fill="var(--color-accent)" />
            <text
              x={cx}
              y={cy + 3.5}
              textAnchor="middle"
              fontSize={9}
              fontWeight={700}
              fill="var(--color-bg-primary)"
            >
              {i + 1}
            </text>
          </motion.g>
        )
      })}

      {/* ── Visual progression line (ascending) ────────── */}
      <motion.line
        x1={stageX(0) + stageW / 2}
        y1={stageY(0) + 72}
        x2={stageX(2) + stageW / 2}
        y2={stageY(2) + 72}
        stroke="var(--color-border-primary)"
        strokeWidth={1}
        strokeDasharray="4 3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 2.0, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Example outputs row ────────────────────────── */}
      {stages.map((stage, i) => {
        const x = stageX(i)
        const baseY = stageY(0) + 82
        return (
          <motion.g
            key={`example-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay: stageDelay(i) + 0.35, ease: PRODUCTIVE_EASE }}
          >
            {/* example pill */}
            <rect
              x={x + 8}
              y={baseY}
              width={stageW - 16}
              height={18}
              rx={9}
              fill="var(--color-bg-tertiary)"
              stroke="var(--color-border-primary)"
              strokeWidth={1}
            />
            <text
              x={x + stageW / 2}
              y={baseY + 12}
              textAnchor="middle"
              fontSize={9}
              fill="var(--color-text-secondary)"
              fontWeight={500}
            >
              {stage.example}
            </text>
          </motion.g>
        )
      })}

      {/* ── "Output Quality" ascending label ──────────── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.3, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={stageX(2) + stageW + 8}
          y={stageY(1) + 30}
          fontSize={9}
          fill="var(--color-text-tertiary)"
          fontWeight={500}
          writingMode="tb"
        >
          Quality
        </text>
        {/* upward arrow */}
        <line
          x1={stageX(2) + stageW + 12}
          y1={stageY(1) + 20}
          x2={stageX(2) + stageW + 12}
          y2={stageY(2) + 40}
          stroke="var(--color-text-tertiary)"
          strokeWidth={1}
        />
        <polygon
          points={`${stageX(2) + stageW + 9},${stageY(2) + 42} ${stageX(2) + stageW + 12},${stageY(2) + 36} ${stageX(2) + stageW + 15},${stageY(2) + 42}`}
          fill="var(--color-text-tertiary)"
        />
      </motion.g>
    </svg>
  )
}
