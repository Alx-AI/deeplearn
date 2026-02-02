'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface UnderfittingOverfittingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function UnderfittingOverfittingDiagram({
  className,
}: UnderfittingOverfittingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Chart layout
  const padding = { top: 38, right: 20, bottom: 40, left: 50 }
  const chartWidth = 480 - padding.left - padding.right
  const chartHeight = 300 - padding.top - padding.bottom

  // Divergence point where validation loss starts rising
  const totalEpochs = 50
  const divergeEpoch = 22

  // Loss functions
  const trainingLoss = (epoch: number): number => {
    return 0.92 * Math.exp(-0.065 * epoch) + 0.08
  }

  const validationLoss = (epoch: number): number => {
    const base = 0.95 * Math.exp(-0.07 * epoch) + 0.12
    const rise = Math.pow(Math.max(0, (epoch - divergeEpoch) / totalEpochs), 2) * 3.2
    return base + rise
  }

  // Map epoch/loss to SVG coordinates
  const toX = (epoch: number): number => padding.left + (epoch / totalEpochs) * chartWidth
  const toY = (loss: number): number => padding.top + chartHeight * (1 - loss)

  // Generate smooth cubic bezier path from a loss function
  const generateCurvePath = (lossFn: (e: number) => number): string => {
    const step = 1
    const points: { x: number; y: number }[] = []

    for (let e = 0; e <= totalEpochs; e += step) {
      points.push({ x: toX(e), y: toY(lossFn(e)) })
    }

    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const next = points[i + 1]

      if (next) {
        const cp1x = prev.x + (curr.x - prev.x) * 0.5
        const cp1y = prev.y + (curr.y - prev.y) * 0.5
        const cp2x = curr.x - (next.x - curr.x) * 0.5
        const cp2y = curr.y - (next.y - curr.y) * 0.5
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
      } else {
        d += ` L ${curr.x} ${curr.y}`
      }
    }

    return d
  }

  // Generate the fill path for the gap highlight between the two curves
  // in the overfitting zone (from divergeEpoch to totalEpochs)
  const generateGapFillPath = (): string => {
    const step = 1
    const valPoints: { x: number; y: number }[] = []
    const trainPoints: { x: number; y: number }[] = []

    for (let e = divergeEpoch; e <= totalEpochs; e += step) {
      valPoints.push({ x: toX(e), y: toY(validationLoss(e)) })
      trainPoints.push({ x: toX(e), y: toY(trainingLoss(e)) })
    }

    // Forward along validation curve, backward along training curve
    let d = `M ${valPoints[0].x} ${valPoints[0].y}`
    for (let i = 1; i < valPoints.length; i++) {
      d += ` L ${valPoints[i].x} ${valPoints[i].y}`
    }
    for (let i = trainPoints.length - 1; i >= 0; i--) {
      d += ` L ${trainPoints[i].x} ${trainPoints[i].y}`
    }
    d += ' Z'

    return d
  }

  const trainingPath = generateCurvePath(trainingLoss)
  const validationPath = generateCurvePath(validationLoss)
  const gapFillPath = generateGapFillPath()

  // Key coordinates
  const divergeX = toX(divergeEpoch)
  const underfitLabelX = padding.left + (divergeX - padding.left) / 2
  const overfitLabelX = divergeX + (padding.left + chartWidth - divergeX) / 2

  // X-axis ticks
  const xTicks = [0, 10, 20, 30, 40, 50]

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 300"
      role="img"
      aria-label="Loss curves diagram showing training and validation loss over epochs, illustrating underfitting and overfitting zones with an optimal stopping point at their divergence"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Underfitting zone background */}
      <motion.rect
        x={padding.left}
        y={padding.top}
        width={divergeX - padding.left}
        height={chartHeight}
        fill="var(--color-bg-tertiary)"
        rx="2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.35 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Overfitting zone background */}
      <motion.rect
        x={divergeX}
        y={padding.top}
        width={padding.left + chartWidth - divergeX}
        height={chartHeight}
        fill="var(--color-text-tertiary)"
        rx="2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.08 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Axes */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />

        {/* X-axis ticks */}
        {xTicks.map((tick) => {
          const x = toX(tick)
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 4}
                stroke="var(--color-border-primary)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 16}
                textAnchor="middle"
                fill="var(--color-text-tertiary)"
                fontSize="10"
                fontWeight="500"
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* X-axis label */}
        <text
          x={padding.left + chartWidth / 2}
          y={padding.top + chartHeight + 34}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="600"
        >
          Epochs
        </text>

        {/* Y-axis label */}
        <text
          x={14}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="600"
          transform={`rotate(-90, 14, ${padding.top + chartHeight / 2})`}
        >
          Loss
        </text>
      </motion.g>

      {/* Gap highlight fill between curves in overfitting zone */}
      <motion.path
        d={gapFillPath}
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.08 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Training loss curve (solid, accent color) */}
      <motion.path
        d={trainingPath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Validation loss curve (dashed, text-secondary) */}
      <motion.path
        d={validationPath}
        fill="none"
        stroke="var(--color-text-secondary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="8 5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Vertical dashed line at divergence / optimal stopping point */}
      <motion.line
        x1={divergeX}
        y1={padding.top}
        x2={divergeX}
        y2={padding.top + chartHeight}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={
          isInView ? { opacity: 0.7, pathLength: 1 } : { opacity: 0, pathLength: 0 }
        }
        transition={{ duration: 0.6, delay: 1.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Optimal stopping point label */}
      <motion.text
        x={divergeX}
        y={padding.top - 8}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="10"
        fontWeight="700"
        initial={{ opacity: 0, y: 5 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        Optimal Stopping Point
      </motion.text>

      {/* Dot at divergence on validation curve */}
      <motion.circle
        cx={divergeX}
        cy={toY(validationLoss(divergeEpoch))}
        r="4"
        fill="var(--color-accent)"
        stroke="var(--color-bg-elevated)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.7, ease: PRODUCTIVE_EASE }}
      />

      {/* Zone labels */}
      <motion.text
        x={underfitLabelX}
        y={padding.top + 16}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        Underfitting Zone
      </motion.text>

      <motion.text
        x={overfitLabelX}
        y={padding.top + 16}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        Overfitting Zone
      </motion.text>

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={padding.left + chartWidth - 152}
          y={padding.top + 6}
          width="148"
          height="42"
          rx="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          opacity="0.85"
        />

        {/* Training loss legend entry */}
        <line
          x1={padding.left + chartWidth - 142}
          y1={padding.top + 20}
          x2={padding.left + chartWidth - 120}
          y2={padding.top + 20}
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x={padding.left + chartWidth - 114}
          y={padding.top + 24}
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Training Loss
        </text>

        {/* Validation loss legend entry */}
        <line
          x1={padding.left + chartWidth - 142}
          y1={padding.top + 37}
          x2={padding.left + chartWidth - 120}
          y2={padding.top + 37}
          stroke="var(--color-text-secondary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="8 5"
        />
        <text
          x={padding.left + chartWidth - 114}
          y={padding.top + 41}
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Validation Loss
        </text>
      </motion.g>
    </svg>
  )
}
