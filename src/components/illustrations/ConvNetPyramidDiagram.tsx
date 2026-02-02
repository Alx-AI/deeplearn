'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ConvNetPyramidDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

/**
 * Each stage of the ConvNet pyramid.
 * - `w` represents spatial dimensions (visual width of the rectangle)
 * - `h` represents channel depth (visual height of the rectangle)
 * - `label` is the dimension annotation shown below
 * - `opLabel` is the operation label shown on the arrow leading to this stage
 */
const stages = [
  { label: '28\u00d728\u00d71', w: 100, h: 16, opLabel: '' },
  { label: '13\u00d713\u00d764', w: 72, h: 48, opLabel: 'Conv1+Pool' },
  { label: '5\u00d75\u00d7128', w: 48, h: 76, opLabel: 'Conv2+Pool' },
  { label: '3\u00d73\u00d7256', w: 32, h: 108, opLabel: 'Conv3' },
  { label: '256', w: 10, h: 108, opLabel: 'GlobalAvgPool' },
  { label: '10', w: 18, h: 24, opLabel: 'Dense' },
] as const

export default function ConvNetPyramidDiagram({
  className,
}: ConvNetPyramidDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const baselineY = 185 // bottom edge of the tallest rectangle
  const gapBetween = 18 // horizontal gap between stages (edge to edge)
  const arrowPad = 4 // padding from rect edge to arrow start/end

  // Compute x positions so everything is nicely centered
  const totalContentWidth =
    stages.reduce((acc, s) => acc + s.w, 0) +
    (stages.length - 1) * gapBetween
  const startX = (540 - totalContentWidth) / 2

  // Pre-compute each stage's x position and center
  const stagePositions = stages.map((stage, i) => {
    let x = startX
    for (let j = 0; j < i; j++) {
      x += stages[j].w + gapBetween
    }
    return {
      x,
      cx: x + stage.w / 2,
      y: baselineY - stage.h,
      w: stage.w,
      h: stage.h,
    }
  })

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ConvNet pyramid diagram showing how spatial dimensions shrink while filter depth increases through successive convolution and pooling stages"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-convnet-pyramid"
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
      </defs>

      {/* Title */}
      <motion.text
        x={270}
        y={22}
        textAnchor="middle"
        fontSize="13"
        fontWeight={600}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0, y: 4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        ConvNet Architecture: The Pyramid Pattern
      </motion.text>

      {/* Stage rectangles */}
      {stages.map((stage, i) => {
        const pos = stagePositions[i]
        // Accent color for early conv stages, secondary for later stages
        const isConvStage = i <= 3
        const fillColor = isConvStage
          ? 'var(--color-accent-subtle)'
          : 'var(--color-bg-tertiary)'
        const strokeColor = isConvStage
          ? 'var(--color-accent)'
          : 'var(--color-border-primary)'

        return (
          <motion.rect
            key={`stage-rect-${i}`}
            x={pos.x}
            y={pos.y}
            width={pos.w}
            height={pos.h}
            rx={3}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.5,
              delay: i * 0.18,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* Inner grid lines for conv stages to suggest spatial structure */}
      {stages.slice(0, 4).map((stage, i) => {
        const pos = stagePositions[i]
        const gridCount = Math.max(1, Math.floor(stage.w / 16))
        return (
          <motion.g
            key={`grid-${i}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.18 + 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Vertical grid lines */}
            {Array.from({ length: gridCount - 1 }, (_, j) => {
              const lineX =
                pos.x + ((j + 1) * pos.w) / gridCount
              return (
                <line
                  key={`v-${i}-${j}`}
                  x1={lineX}
                  y1={pos.y + 2}
                  x2={lineX}
                  y2={pos.y + pos.h - 2}
                  stroke="var(--color-accent)"
                  strokeWidth="0.6"
                />
              )
            })}
            {/* Horizontal grid lines */}
            {Array.from(
              { length: Math.max(1, Math.floor(stage.h / 18)) - 1 },
              (_, j) => {
                const lineY =
                  pos.y +
                  ((j + 1) * pos.h) /
                    Math.max(1, Math.floor(stage.h / 18))
                return (
                  <line
                    key={`h-${i}-${j}`}
                    x1={pos.x + 2}
                    y1={lineY}
                    x2={pos.x + pos.w - 2}
                    y2={lineY}
                    stroke="var(--color-accent)"
                    strokeWidth="0.6"
                  />
                )
              }
            )}
          </motion.g>
        )
      })}

      {/* Dimension labels below each stage */}
      {stages.map((stage, i) => {
        const pos = stagePositions[i]
        return (
          <motion.text
            key={`label-${i}`}
            x={pos.cx}
            y={baselineY + 14}
            textAnchor="middle"
            fontSize="9"
            fontWeight={500}
            fontFamily="var(--font-sans)"
            fill="var(--color-text-primary)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.18 + 0.12,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {stage.label}
          </motion.text>
        )
      })}

      {/* Stage name labels above each rectangle */}
      {[
        'Input',
        'Conv1+Pool',
        'Conv2+Pool',
        'Conv3',
        'GAP',
        'Output',
      ].map((name, i) => {
        const pos = stagePositions[i]
        return (
          <motion.text
            key={`name-${i}`}
            x={pos.cx}
            y={pos.y - 6}
            textAnchor="middle"
            fontSize="9"
            fontWeight={600}
            fontFamily="var(--font-sans)"
            fill="var(--color-text-secondary)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.18 + 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {name}
          </motion.text>
        )
      })}

      {/* Arrows between stages with operation labels */}
      {stages.slice(1).map((stage, i) => {
        const from = stagePositions[i]
        const to = stagePositions[i + 1]
        const x1 = from.x + from.w + arrowPad
        const x2 = to.x - arrowPad
        const midX = (x1 + x2) / 2
        // Arrow sits at the vertical midpoint between the two stages
        const arrowY =
          (Math.max(from.y, to.y) + baselineY) / 2

        return (
          <motion.g
            key={`arrow-${i}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.18 + 0.25,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <line
              x1={x1}
              y1={arrowY}
              x2={x2}
              y2={arrowY}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.2"
              markerEnd="url(#arrowhead-convnet-pyramid)"
            />
            {/* Operation label above the arrow */}
            <text
              x={midX}
              y={arrowY - 5}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-sans)"
              fill="var(--color-text-tertiary)"
            >
              {stage.opLabel}
            </text>
          </motion.g>
        )
      })}

      {/* Annotation: "Spatial down, Depth up" */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Spatial shrink arrow (top) */}
        <line
          x1={stagePositions[0].cx}
          y1={38}
          x2={stagePositions[3].cx}
          y2={38}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          markerEnd="url(#arrowhead-convnet-pyramid)"
          opacity="0.5"
        />
        <text
          x={(stagePositions[0].cx + stagePositions[3].cx) / 2}
          y={34}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
          fontStyle="italic"
        >
          {'Spatial \u2193  Depth \u2191'}
        </text>
      </motion.g>

      {/* Bottom summary annotation */}
      <motion.text
        x={270}
        y={228}
        textAnchor="middle"
        fontSize="9"
        fontWeight={500}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-tertiary)"
        letterSpacing="0.03em"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        Width encodes spatial resolution, height encodes channel depth
      </motion.text>

      {/* Vertical depth annotation on the right side */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.55 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Vertical dashed line showing increasing height */}
        <line
          x1={stagePositions[3].x + stagePositions[3].w + 8}
          y1={stagePositions[0].y}
          x2={stagePositions[3].x + stagePositions[3].w + 8}
          y2={baselineY}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        {/* Top tick */}
        <line
          x1={stagePositions[3].x + stagePositions[3].w + 5}
          y1={stagePositions[0].y}
          x2={stagePositions[3].x + stagePositions[3].w + 11}
          y2={stagePositions[0].y}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
        {/* Bottom tick */}
        <line
          x1={stagePositions[3].x + stagePositions[3].w + 5}
          y1={baselineY}
          x2={stagePositions[3].x + stagePositions[3].w + 11}
          y2={baselineY}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
        <text
          x={stagePositions[3].x + stagePositions[3].w + 14}
          y={(stagePositions[0].y + baselineY) / 2 + 3}
          textAnchor="start"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-tertiary)"
          letterSpacing="0.04em"
        >
          depth
        </text>
      </motion.g>

      {/* Horizontal width annotation below input stage */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.55 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={stagePositions[0].x}
          y1={baselineY + 24}
          x2={stagePositions[0].x + stagePositions[0].w}
          y2={baselineY + 24}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
        {/* Left tick */}
        <line
          x1={stagePositions[0].x}
          y1={baselineY + 21}
          x2={stagePositions[0].x}
          y2={baselineY + 27}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
        {/* Right tick */}
        <line
          x1={stagePositions[0].x + stagePositions[0].w}
          y1={baselineY + 21}
          x2={stagePositions[0].x + stagePositions[0].w}
          y2={baselineY + 27}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
        <text
          x={stagePositions[0].cx}
          y={baselineY + 35}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-tertiary)"
          letterSpacing="0.04em"
        >
          spatial
        </text>
      </motion.g>
    </svg>
  )
}
