'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ScaleUpToOverfitDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ScaleUpToOverfitDiagram({
  className,
}: ScaleUpToOverfitDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // --- Layout constants ---
  const plotW = 180
  const plotH = 120
  const plotY = 28
  const leftPlotX = 20
  const rightPlotX = 310
  const arrowCenterX = (leftPlotX + plotW + rightPlotX) / 2

  // --- Small Model curves ---
  // Both training and validation plateau at high loss (can't overfit)
  const smallTrainPath =
    'M 0 60 Q 25 55, 50 52 Q 75 50, 100 49 Q 125 48.5, 150 48 L 160 47.8'
  const smallValPath =
    'M 0 65 Q 25 60, 50 57 Q 75 55.5, 100 54.5 Q 125 54, 150 53.5 L 160 53.2'

  // --- Larger Model curves ---
  // Training loss drops low; validation loss diverges upward (overfitting)
  const largeTrainPath =
    'M 0 70 Q 25 35, 50 18 Q 75 10, 100 6 Q 125 4, 150 3 L 160 2.5'
  const largeValPath =
    'M 0 72 Q 25 45, 50 35 Q 75 34, 100 40 Q 125 52, 150 66 L 160 72'

  // Scale raw path coordinates into a plot's coordinate system
  const scalePath = (
    raw: string,
    plotX: number,
    pY: number,
    scaleX: number,
    scaleY: number
  ): string => {
    return raw.replace(
      /(\d+\.?\d*)\s+(\d+\.?\d*)/g,
      (_match, xStr: string, yStr: string) => {
        const x = parseFloat(xStr) * scaleX + plotX + 12
        const y = parseFloat(yStr) * scaleY + pY + 10
        return `${x.toFixed(1)} ${y.toFixed(1)}`
      }
    )
  }

  const sX = (plotW - 24) / 160
  const sY = (plotH - 20) / 80

  // Scaled paths
  const smallTrainScaled = scalePath(smallTrainPath, leftPlotX, plotY, sX, sY)
  const smallValScaled = scalePath(smallValPath, leftPlotX, plotY, sX, sY)
  const largeTrainScaled = scalePath(largeTrainPath, rightPlotX, plotY, sX, sY)
  const largeValScaled = scalePath(largeValPath, rightPlotX, plotY, sX, sY)

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 260"
      role="img"
      aria-label="Diagram comparing a small model that cannot overfit with a larger model that successfully overfits, illustrating the scale-up-to-overfit training strategy"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Shared legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="150"
          y1="12"
          x2="172"
          y2="12"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="177"
          y="16"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Train Loss
        </text>

        <line
          x1="248"
          y1="12"
          x2="270"
          y2="12"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3"
        />
        <text
          x="275"
          y="16"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Val Loss
        </text>
      </motion.g>

      {/* ========== Plot 1: Small Model ========== */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Plot background */}
        <rect
          x={leftPlotX}
          y={plotY}
          width={plotW}
          height={plotH}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1={leftPlotX + 12}
          y1={plotY + plotH - 10}
          x2={leftPlotX + plotW - 6}
          y2={plotY + plotH - 10}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.35"
        />
        <line
          x1={leftPlotX + 12}
          y1={plotY + 6}
          x2={leftPlotX + 12}
          y2={plotY + plotH - 10}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Axis labels */}
        <text
          x={leftPlotX + plotW / 2}
          y={plotY + plotH - 1}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          opacity="0.6"
        >
          Epochs
        </text>
        <text
          x={leftPlotX + 5}
          y={plotY + plotH / 2}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          opacity="0.6"
          transform={`rotate(-90, ${leftPlotX + 5}, ${plotY + plotH / 2})`}
        >
          Loss
        </text>

        {/* Training loss curve */}
        <motion.path
          d={smallTrainScaled}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.0, delay: 0.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Validation loss curve (dashed) */}
        <motion.path
          d={smallValScaled}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.0, delay: 0.45, ease: PRODUCTIVE_EASE }}
        />

        {/* Title */}
        <motion.text
          x={leftPlotX + plotW / 2}
          y={plotY + plotH + 20}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="13"
          fontWeight="600"
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          Small Model
        </motion.text>

        {/* Subtitle */}
        <motion.text
          x={leftPlotX + plotW / 2}
          y={plotY + plotH + 35}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          {"Can\u2019t overfit \u2192 needs more capacity"}
        </motion.text>
      </motion.g>

      {/* ========== Arrow between plots ========== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <defs>
          <marker
            id="scale-up-arrowhead"
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

        {/* Arrow line */}
        <motion.line
          x1={leftPlotX + plotW + 10}
          y1={plotY + plotH / 2}
          x2={rightPlotX - 10}
          y2={plotY + plotH / 2}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#scale-up-arrowhead)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Arrow label */}
        <motion.text
          x={arrowCenterX}
          y={plotY + plotH / 2 - 10}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          Add layers/units
        </motion.text>
      </motion.g>

      {/* ========== Plot 2: Larger Model ========== */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {/* Plot background with accent highlight */}
        <rect
          x={rightPlotX}
          y={plotY}
          width={plotW}
          height={plotH}
          fill="var(--color-accent)"
          opacity="0.05"
          rx="4"
        />
        <rect
          x={rightPlotX}
          y={plotY}
          width={plotW}
          height={plotH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          rx="4"
          opacity="0.4"
        />

        {/* Axes */}
        <line
          x1={rightPlotX + 12}
          y1={plotY + plotH - 10}
          x2={rightPlotX + plotW - 6}
          y2={plotY + plotH - 10}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.35"
        />
        <line
          x1={rightPlotX + 12}
          y1={plotY + 6}
          x2={rightPlotX + 12}
          y2={plotY + plotH - 10}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Axis labels */}
        <text
          x={rightPlotX + plotW / 2}
          y={plotY + plotH - 1}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          opacity="0.6"
        >
          Epochs
        </text>
        <text
          x={rightPlotX + 5}
          y={plotY + plotH / 2}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          opacity="0.6"
          transform={`rotate(-90, ${rightPlotX + 5}, ${plotY + plotH / 2})`}
        >
          Loss
        </text>

        {/* Training loss curve - drops low */}
        <motion.path
          d={largeTrainScaled}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.0, delay: 0.5, ease: PRODUCTIVE_EASE }}
        />

        {/* Validation loss curve - diverges upward (dashed) */}
        <motion.path
          d={largeValScaled}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.0, delay: 0.65, ease: PRODUCTIVE_EASE }}
        />

        {/* Divergence indicator - gap annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Small double-headed arrow showing the gap */}
          <line
            x1={rightPlotX + plotW - 22}
            y1={plotY + 14}
            x2={rightPlotX + plotW - 22}
            y2={plotY + plotH - 20}
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            opacity="0.5"
          />
          <text
            x={rightPlotX + plotW - 12}
            y={plotY + plotH / 2 + 2}
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="600"
            opacity="0.6"
          >
            gap
          </text>
        </motion.g>

        {/* Title */}
        <motion.text
          x={rightPlotX + plotW / 2}
          y={plotY + plotH + 20}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="13"
          fontWeight="700"
          initial={{ opacity: 0, y: 4 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          Larger Model
        </motion.text>

        {/* Subtitle */}
        <motion.text
          x={rightPlotX + plotW / 2}
          y={plotY + plotH + 35}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          {"Successfully overfitting \u2192 ready for regularization"}
        </motion.text>
      </motion.g>

      {/* ========== Bottom annotation ========== */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Background pill */}
        <rect
          x="75"
          y="218"
          width="370"
          height="30"
          rx="15"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Step 1 */}
        <text
          x="155"
          y="237"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="600"
        >
          Step 1: Prove you can overfit.
        </text>

        {/* Separator */}
        <text
          x="270"
          y="237"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          fontWeight="400"
        >
          |
        </text>

        {/* Step 2 */}
        <text
          x="370"
          y="237"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
        >
          Step 2: Then regularize.
        </text>
      </motion.g>
    </svg>
  )
}
