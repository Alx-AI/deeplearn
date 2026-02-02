'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ModelCapacitySpectrumDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ModelCapacitySpectrumDiagram({
  className,
}: ModelCapacitySpectrumDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // --- Mini-plot layout constants ---
  // Each mini-plot is 140w x 100h, with 20px gutters between
  const plotW = 140
  const plotH = 100
  const plotY = 24
  const gutter = 20
  const plotXs = [30, 30 + plotW + gutter, 30 + 2 * (plotW + gutter)]

  // --- Mini-plot curve generators ---
  // Underfitting: both train and val loss remain high and close together
  const underfitTrain =
    'M 0 70 Q 20 66, 40 63 Q 60 61, 80 59 Q 100 58, 120 57 L 130 56'
  const underfitVal =
    'M 0 74 Q 20 71, 40 68 Q 60 66, 80 65 Q 100 64, 120 63.5 L 130 63'

  // Sweet Spot: train loss goes low, val loss tracks but diverges gently late
  const sweetTrain =
    'M 0 70 Q 20 42, 40 28 Q 60 18, 80 13 Q 100 10, 120 8 L 130 7'
  const sweetVal =
    'M 0 74 Q 20 48, 40 34 Q 60 26, 80 22 Q 100 21, 120 23 L 130 25'

  // Overfitting: train loss drops to near zero, val loss diverges immediately
  const overfitTrain =
    'M 0 70 Q 20 30, 40 14 Q 60 7, 80 4 Q 100 2, 120 1.5 L 130 1'
  const overfitVal =
    'M 0 74 Q 20 52, 40 46 Q 60 48, 80 55 Q 100 65, 120 74 L 130 78'

  // Scale curves into each mini-plot coordinate system
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
        const x = parseFloat(xStr) * scaleX + plotX + 10
        const y = parseFloat(yStr) * scaleY + pY + 10
        return `${x.toFixed(1)} ${y.toFixed(1)}`
      }
    )
  }

  const sX = (plotW - 20) / 130
  const sY = (plotH - 20) / 80

  // Zone definitions
  const zones = [
    {
      label: 'Underfitting',
      subtitle: 'Too Little Capacity',
      trainPath: scalePath(underfitTrain, plotXs[0], plotY, sX, sY),
      valPath: scalePath(underfitVal, plotXs[0], plotY, sX, sY),
      highlight: false,
      plotX: plotXs[0],
    },
    {
      label: 'Sweet Spot',
      subtitle: 'Just Right',
      trainPath: scalePath(sweetTrain, plotXs[1], plotY, sX, sY),
      valPath: scalePath(sweetVal, plotXs[1], plotY, sX, sY),
      highlight: true,
      plotX: plotXs[1],
    },
    {
      label: 'Overfitting',
      subtitle: 'Too Much Capacity',
      trainPath: scalePath(overfitTrain, plotXs[2], plotY, sX, sY),
      valPath: scalePath(overfitVal, plotXs[2], plotY, sX, sY),
      highlight: false,
      plotX: plotXs[2],
    },
  ]

  // Bottom arrow Y positions
  const arrowY = 230
  const labelY = 195
  const sublabelY = 210

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 280"
      role="img"
      aria-label="Model capacity spectrum diagram showing training curves for underfitting, sweet spot, and overfitting scenarios along a model complexity axis"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Shared legend at top */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="170"
          y1="12"
          x2="192"
          y2="12"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="197"
          y="16"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Train Loss
        </text>

        <line
          x1="268"
          y1="12"
          x2="290"
          y2="12"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="5 3"
        />
        <text
          x="295"
          y="16"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="500"
        >
          Val Loss
        </text>
      </motion.g>

      {/* Three mini-plot zones */}
      {zones.map((zone, zoneIdx) => (
        <motion.g
          key={zone.label}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: 0.15 * zoneIdx,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {/* Plot background */}
          {zone.highlight ? (
            <>
              <rect
                x={zone.plotX}
                y={plotY}
                width={plotW}
                height={plotH}
                fill="var(--color-accent)"
                opacity="0.06"
                rx="4"
              />
              <rect
                x={zone.plotX}
                y={plotY}
                width={plotW}
                height={plotH}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                rx="4"
                opacity="0.4"
              />
            </>
          ) : (
            <rect
              x={zone.plotX}
              y={plotY}
              width={plotW}
              height={plotH}
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              rx="4"
            />
          )}

          {/* Axes */}
          <line
            x1={zone.plotX + 10}
            y1={plotY + plotH - 10}
            x2={zone.plotX + plotW - 6}
            y2={plotY + plotH - 10}
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            opacity="0.35"
          />
          <line
            x1={zone.plotX + 10}
            y1={plotY + 6}
            x2={zone.plotX + 10}
            y2={plotY + plotH - 10}
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            opacity="0.35"
          />

          {/* Axis labels */}
          <text
            x={zone.plotX + plotW / 2}
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
            x={zone.plotX + 4}
            y={plotY + plotH / 2}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
            opacity="0.6"
            transform={`rotate(-90, ${zone.plotX + 4}, ${plotY + plotH / 2})`}
          >
            Loss
          </text>

          {/* Training loss curve */}
          <motion.path
            d={zone.trainPath}
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
            transition={{
              duration: 1.0,
              delay: 0.4 + zoneIdx * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          />

          {/* Validation loss curve (dashed) */}
          <motion.path
            d={zone.valPath}
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
            transition={{
              duration: 1.0,
              delay: 0.55 + zoneIdx * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          />

          {/* Zone subtitle (above the zone label) */}
          <motion.text
            x={zone.plotX + plotW / 2}
            y={plotY + plotH + 24}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: 1.0 + zoneIdx * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {zone.subtitle}
          </motion.text>

          {/* Zone label */}
          <motion.text
            x={zone.plotX + plotW / 2}
            y={plotY + plotH + 40}
            textAnchor="middle"
            fill={
              zone.highlight
                ? 'var(--color-accent)'
                : 'var(--color-text-tertiary)'
            }
            fontSize="13"
            fontWeight={zone.highlight ? '700' : '600'}
            initial={{ opacity: 0, y: 4 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{
              duration: 0.4,
              delay: 1.1 + zoneIdx * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {zone.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Connecting gradient bar between zones */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <defs>
          <linearGradient
            id="capacity-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--color-text-tertiary)" stopOpacity="0.2" />
            <stop offset="40%" stopColor="var(--color-accent)" stopOpacity="0.5" />
            <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-text-tertiary)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect
          x={plotXs[0]}
          y={labelY + 24}
          width={plotXs[2] + plotW - plotXs[0]}
          height="3"
          rx="1.5"
          fill="url(#capacity-gradient)"
        />
      </motion.g>

      {/* Bottom arrow: "Model Complexity" */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        <defs>
          <marker
            id="capacity-arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-text-secondary)"
            />
          </marker>
        </defs>

        {/* Arrow line */}
        <motion.line
          x1={plotXs[0] + 10}
          y1={arrowY + 24}
          x2={plotXs[2] + plotW - 10}
          y2={arrowY + 24}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          markerEnd="url(#capacity-arrowhead)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1.7, ease: PRODUCTIVE_EASE }}
        />

        {/* Arrow label */}
        <motion.text
          x={270}
          y={arrowY + 44}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
        >
          {'Model Complexity \u2192'}
        </motion.text>
      </motion.g>
    </svg>
  )
}
