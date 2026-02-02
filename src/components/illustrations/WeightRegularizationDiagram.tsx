'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WeightRegularizationDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function WeightRegularizationDiagram({
  className,
}: WeightRegularizationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ------------------------------------------------------------------ */
  /* Pre-computed SVG paths for three weight distributions               */
  /* Each distribution sits inside a 150 x 160 panel.                   */
  /* The baseline (x-axis) is at y = 175; the peak varies per shape.    */
  /* ------------------------------------------------------------------ */

  // Panel 1 - No Regularization: wide, fat Gaussian
  // Broad bell curve spanning most of the panel width
  const noRegOutline =
    'M 12 175 C 12 175, 20 172, 30 165 C 40 155, 50 130, 60 100 C 65 82, 70 65, 78 55 C 83 50, 86 48, 90 48 C 94 48, 97 50, 102 55 C 110 65, 115 82, 120 100 C 130 130, 140 155, 150 165 C 160 172, 168 175, 168 175'
  const noRegFill =
    'M 12 175 C 12 175, 20 172, 30 165 C 40 155, 50 130, 60 100 C 65 82, 70 65, 78 55 C 83 50, 86 48, 90 48 C 94 48, 97 50, 102 55 C 110 65, 115 82, 120 100 C 130 130, 140 155, 150 165 C 160 172, 168 175, 168 175 Z'

  // Panel 2 - L2 (Weight Decay): narrower, taller Gaussian centred at 0
  const l2Outline =
    'M 30 175 C 30 175, 38 173, 48 168 C 55 162, 62 148, 68 125 C 72 110, 76 85, 80 65 C 83 52, 86 40, 90 36 C 94 40, 97 52, 100 65 C 104 85, 108 110, 112 125 C 118 148, 125 162, 132 168 C 142 173, 150 175, 150 175'
  const l2Fill =
    'M 30 175 C 30 175, 38 173, 48 168 C 55 162, 62 148, 68 125 C 72 110, 76 85, 80 65 C 83 52, 86 40, 90 36 C 94 40, 97 52, 100 65 C 104 85, 108 110, 112 125 C 118 148, 125 162, 132 168 C 142 173, 150 175, 150 175 Z'

  // Panel 3 - L1 (Lasso): sharp spike at 0 with small exponential tails
  const l1Outline =
    'M 15 175 C 15 175, 25 174, 35 172 C 45 170, 55 168, 62 165 C 68 162, 73 158, 78 148 C 82 138, 85 115, 87 85 C 88 65, 89 42, 90 28 C 91 42, 92 65, 93 85 C 95 115, 98 138, 102 148 C 107 158, 112 162, 118 165 C 125 168, 135 170, 145 172 C 155 174, 165 175, 165 175'
  const l1Fill =
    'M 15 175 C 15 175, 25 174, 35 172 C 45 170, 55 168, 62 165 C 68 162, 73 158, 78 148 C 82 138, 85 115, 87 85 C 88 65, 89 42, 90 28 C 91 42, 92 65, 93 85 C 95 115, 98 138, 102 148 C 107 158, 112 162, 118 165 C 125 168, 135 170, 145 172 C 155 174, 165 175, 165 175 Z'

  /* Panel layout helpers */
  const panelWidth = 160
  const panelGap = 15
  const panelOffsets = [10, 10 + panelWidth + panelGap, 10 + 2 * (panelWidth + panelGap)]

  const panels: {
    title: string
    outlinePath: string
    fillPath: string
    annotation: string | null
    accent: boolean
    offset: number
  }[] = [
    {
      title: 'No Regularization',
      outlinePath: noRegOutline,
      fillPath: noRegFill,
      annotation: null,
      accent: false,
      offset: panelOffsets[0],
    },
    {
      title: 'L2 (Weight Decay)',
      outlinePath: l2Outline,
      fillPath: l2Fill,
      annotation: 'Shrinks all weights',
      accent: true,
      offset: panelOffsets[1],
    },
    {
      title: 'L1 (Lasso)',
      outlinePath: l1Outline,
      fillPath: l1Fill,
      annotation: 'Drives weights to zero (sparse)',
      accent: true,
      offset: panelOffsets[2],
    },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 240"
      role="img"
      aria-label="Diagram comparing weight distributions under no regularization, L2 regularization, and L1 regularization"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {panels.map((panel, panelIdx) => (
        <motion.g
          key={panel.title}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: panelIdx * 0.18,
            ease: PRODUCTIVE_EASE,
          }}
          transform={`translate(${panel.offset}, 0)`}
        >
          {/* Panel background */}
          <rect
            x="0"
            y="14"
            width={panelWidth}
            height="176"
            fill={panel.accent ? 'var(--color-accent)' : 'var(--color-bg-elevated)'}
            opacity={panel.accent ? 0.04 : 1}
            stroke={panel.accent ? 'var(--color-accent)' : 'var(--color-border-primary)'}
            strokeWidth={panel.accent ? 1.5 : 1}
            rx="6"
            strokeOpacity={panel.accent ? 0.35 : 1}
          />
          {/* If accent, draw a second opaque fill underneath so border shows */}
          {panel.accent && (
            <rect
              x="0"
              y="14"
              width={panelWidth}
              height="176"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              rx="6"
              opacity="0.35"
            />
          )}

          {/* Panel title */}
          <text
            x={panelWidth / 2}
            y="32"
            textAnchor="middle"
            fill={panel.accent ? 'var(--color-accent)' : 'var(--color-text-primary)'}
            fontSize="11.5"
            fontWeight="600"
          >
            {panel.title}
          </text>

          {/* Y-axis */}
          <line
            x1="18"
            y1="44"
            x2="18"
            y2="175"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Y-axis label */}
          <text
            x="10"
            y="110"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            transform={`rotate(-90, 10, 110)`}
          >
            Frequency
          </text>

          {/* X-axis */}
          <line
            x1="18"
            y1="175"
            x2={panelWidth - 8}
            y2="175"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* X-axis label */}
          <text
            x={panelWidth / 2}
            y="186"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            Weight value
          </text>

          {/* Zero tick mark on x-axis */}
          <line
            x1={panelWidth / 2}
            y1="175"
            x2={panelWidth / 2}
            y2="178"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            opacity="0.4"
          />
          <text
            x={panelWidth / 2}
            y="184"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            opacity="0.6"
          >
            0
          </text>

          {/* Filled area under distribution curve */}
          <motion.path
            d={panel.fillPath}
            fill={panel.accent ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}
            opacity={0}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: panel.accent ? 0.1 : 0.06 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.4 + panelIdx * 0.35,
              ease: PRODUCTIVE_EASE,
            }}
          />

          {/* Distribution outline path with pathLength animation */}
          <motion.path
            d={panel.outlinePath}
            fill="none"
            stroke={panel.accent ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{
              duration: 1,
              delay: 0.4 + panelIdx * 0.35,
              ease: PRODUCTIVE_EASE,
            }}
          />

          {/* Annotation text beneath the panel */}
          {panel.annotation && (
            <motion.text
              x={panelWidth / 2}
              y="199"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="500"
              fontStyle="italic"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.85 } : {}}
              transition={{
                duration: 0.5,
                delay: 1.1 + panelIdx * 0.35,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {panel.annotation}
            </motion.text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}
