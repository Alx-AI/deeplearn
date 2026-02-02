'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SpatialHierarchyDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

/**
 * Levels of the spatial feature hierarchy learned by ConvNets.
 * Each level shows a representative visual pattern, a label, and
 * its approximate receptive-field size.
 */
const levels = [
  { label: 'Layer 1: Edges', receptive: '3\u00d73', x: 18 },
  { label: 'Layer 2: Textures', receptive: '5\u00d75', x: 150 },
  { label: 'Layer 3: Parts', receptive: 'larger', x: 282 },
  { label: 'Layer 4: Objects', receptive: 'full image', x: 414 },
] as const

export default function SpatialHierarchyDiagram({
  className,
}: SpatialHierarchyDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const boxW = 108
  const boxH = 110
  const boxY = 50
  const boxRx = 6

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Spatial feature hierarchy diagram showing how ConvNets learn edges, textures, parts, and objects across successive layers with growing receptive fields"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-spatial-hierarchy"
          markerWidth="7"
          markerHeight="5"
          refX="6"
          refY="2.5"
          orient="auto"
        >
          <polygon
            points="0 0, 7 2.5, 0 5"
            fill="var(--color-text-tertiary)"
            opacity="0.6"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x={280}
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
        Spatial Feature Hierarchy
      </motion.text>

      {/* "Increasing Abstraction" dashed arrow across top */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={levels[0].x + boxW / 2}
          y1={38}
          x2={levels[3].x + boxW / 2}
          y2={38}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          markerEnd="url(#arrowhead-spatial-hierarchy)"
        />
        <text
          x={280}
          y={34}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-tertiary)"
          letterSpacing="0.06em"
        >
          Increasing Abstraction
        </text>
      </motion.g>

      {/* Level boxes */}
      {levels.map((level, i) => (
        <motion.rect
          key={`box-${i}`}
          x={level.x}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={boxRx}
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: 0.5,
            delay: i * 0.22,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* ---- Level 1: Edges ---- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {/* Horizontal edge */}
        <line
          x1={levels[0].x + 16}
          y1={boxY + 20}
          x2={levels[0].x + 52}
          y2={boxY + 20}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Vertical edge */}
        <line
          x1={levels[0].x + 64}
          y1={boxY + 14}
          x2={levels[0].x + 64}
          y2={boxY + 50}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Diagonal edge (top-left to bottom-right) */}
        <line
          x1={levels[0].x + 18}
          y1={boxY + 38}
          x2={levels[0].x + 50}
          y2={boxY + 60}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Diagonal edge (bottom-left to top-right) */}
        <line
          x1={levels[0].x + 56}
          y1={boxY + 60}
          x2={levels[0].x + 88}
          y2={boxY + 38}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Short horizontal */}
        <line
          x1={levels[0].x + 22}
          y1={boxY + 76}
          x2={levels[0].x + 48}
          y2={boxY + 76}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Short vertical */}
        <line
          x1={levels[0].x + 80}
          y1={boxY + 60}
          x2={levels[0].x + 80}
          y2={boxY + 86}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Another thin diagonal */}
        <line
          x1={levels[0].x + 56}
          y1={boxY + 72}
          x2={levels[0].x + 72}
          y2={boxY + 88}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
      </motion.g>

      {/* ---- Level 2: Textures (crosshatch / grid patterns) ---- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.37, ease: PRODUCTIVE_EASE }}
      >
        {/* Crosshatch block - top left */}
        {/* Horizontal lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`tex-h1-${i}`}
            x1={levels[1].x + 14}
            y1={boxY + 14 + i * 8}
            x2={levels[1].x + 50}
            y2={boxY + 14 + i * 8}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />
        ))}
        {/* Vertical lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`tex-v1-${i}`}
            x1={levels[1].x + 14 + i * 9}
            y1={boxY + 14}
            x2={levels[1].x + 14 + i * 9}
            y2={boxY + 46}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />
        ))}

        {/* Diagonal crosshatch block - top right */}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`tex-d1-${i}`}
            x1={levels[1].x + 58}
            y1={boxY + 14 + i * 10}
            x2={levels[1].x + 58 + 34}
            y2={boxY + 24 + i * 10}
            stroke="var(--color-text-secondary)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <line
            key={`tex-d2-${i}`}
            x1={levels[1].x + 58}
            y1={boxY + 24 + i * 10}
            x2={levels[1].x + 58 + 34}
            y2={boxY + 14 + i * 10}
            stroke="var(--color-text-secondary)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.5"
          />
        ))}

        {/* Dotted/stippled pattern - bottom section */}
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
            <circle
              key={`tex-dot-${r}-${c}`}
              cx={levels[1].x + 16 + c * 10}
              cy={boxY + 58 + r * 7}
              r="1.5"
              fill="var(--color-accent)"
              opacity={(r + c) % 3 === 0 ? 0.7 : 0.3}
            />
          ))
        )}
      </motion.g>

      {/* ---- Level 3: Parts (circles, curves, composite shapes) ---- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.59, ease: PRODUCTIVE_EASE }}
      >
        {/* Circle */}
        <circle
          cx={levels[2].x + 30}
          cy={boxY + 28}
          r="13"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          opacity="0.75"
        />
        {/* Arc / curve (eye-like shape) */}
        <path
          d={`M ${levels[2].x + 58} ${boxY + 18} Q ${levels[2].x + 78} ${boxY + 32} ${levels[2].x + 58} ${boxY + 42}`}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Opposite curve to form an eye shape */}
        <path
          d={`M ${levels[2].x + 58} ${boxY + 18} Q ${levels[2].x + 94} ${boxY + 30} ${levels[2].x + 58} ${boxY + 42}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Ellipse */}
        <ellipse
          cx={levels[2].x + 34}
          cy={boxY + 66}
          rx="16"
          ry="10"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* S-curve */}
        <path
          d={`M ${levels[2].x + 62} ${boxY + 54} Q ${levels[2].x + 76} ${boxY + 62} ${levels[2].x + 62} ${boxY + 72} Q ${levels[2].x + 48} ${boxY + 82} ${levels[2].x + 62} ${boxY + 92}`}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Small half-circle / arch */}
        <path
          d={`M ${levels[2].x + 78} ${boxY + 68} A 10 10 0 0 1 ${levels[2].x + 98} ${boxY + 68}`}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Small closed curve */}
        <path
          d={`M ${levels[2].x + 80} ${boxY + 80} Q ${levels[2].x + 90} ${boxY + 74} ${levels[2].x + 96} ${boxY + 82} Q ${levels[2].x + 90} ${boxY + 94} ${levels[2].x + 80} ${boxY + 88} Z`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          opacity="0.45"
        />
      </motion.g>

      {/* ---- Level 4: Objects (recognizable outlines: face, car) ---- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.81, ease: PRODUCTIVE_EASE }}
      >
        {/* Face outline (head) */}
        <ellipse
          cx={levels[3].x + 30}
          cy={boxY + 34}
          rx="16"
          ry="20"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          opacity="0.75"
        />
        {/* Left eye */}
        <circle
          cx={levels[3].x + 24}
          cy={boxY + 28}
          r="2.5"
          fill="var(--color-accent)"
          opacity="0.6"
        />
        {/* Right eye */}
        <circle
          cx={levels[3].x + 36}
          cy={boxY + 28}
          r="2.5"
          fill="var(--color-accent)"
          opacity="0.6"
        />
        {/* Nose */}
        <line
          x1={levels[3].x + 30}
          y1={boxY + 32}
          x2={levels[3].x + 30}
          y2={boxY + 38}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Mouth / smile */}
        <path
          d={`M ${levels[3].x + 24} ${boxY + 42} Q ${levels[3].x + 30} ${boxY + 48} ${levels[3].x + 36} ${boxY + 42}`}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Car outline */}
        {/* Body */}
        <path
          d={`M ${levels[3].x + 56} ${boxY + 80}
              L ${levels[3].x + 56} ${boxY + 70}
              L ${levels[3].x + 64} ${boxY + 62}
              L ${levels[3].x + 84} ${boxY + 62}
              L ${levels[3].x + 94} ${boxY + 70}
              L ${levels[3].x + 94} ${boxY + 80}
              Z`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity="0.7"
        />
        {/* Windshield */}
        <line
          x1={levels[3].x + 64}
          y1={boxY + 62}
          x2={levels[3].x + 68}
          y2={boxY + 70}
          stroke="var(--color-text-secondary)"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Rear window */}
        <line
          x1={levels[3].x + 84}
          y1={boxY + 62}
          x2={levels[3].x + 82}
          y2={boxY + 70}
          stroke="var(--color-text-secondary)"
          strokeWidth="1"
          opacity="0.5"
        />
        {/* Front wheel */}
        <circle
          cx={levels[3].x + 64}
          cy={boxY + 82}
          r="4"
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Rear wheel */}
        <circle
          cx={levels[3].x + 86}
          cy={boxY + 82}
          r="4"
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Ground line */}
        <line
          x1={levels[3].x + 52}
          y1={boxY + 86}
          x2={levels[3].x + 98}
          y2={boxY + 86}
          stroke="var(--color-border-primary)"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </motion.g>

      {/* Level labels below boxes */}
      {levels.map((level, i) => (
        <motion.text
          key={`label-${i}`}
          x={level.x + boxW / 2}
          y={boxY + boxH + 16}
          textAnchor="middle"
          fontSize="9.5"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-text-primary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.22 + 0.15,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {level.label}
        </motion.text>
      ))}

      {/* Receptive field annotations below labels */}
      {levels.map((level, i) => (
        <motion.text
          key={`rf-${i}`}
          x={level.x + boxW / 2}
          y={boxY + boxH + 30}
          textAnchor="middle"
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-tertiary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.22 + 0.25,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {level.receptive}
        </motion.text>
      ))}

      {/* Arrows between levels */}
      {[0, 1, 2].map((i) => {
        const x1 = levels[i].x + boxW + 2
        const x2 = levels[i + 1].x - 2
        const arrowY = boxY + boxH / 2
        const midX = (x1 + x2) / 2

        return (
          <g key={`arrow-${i}`}>
            <motion.line
              x1={x1}
              y1={arrowY}
              x2={x2}
              y2={arrowY}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.2"
              markerEnd="url(#arrowhead-spatial-hierarchy)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 0.6 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: i * 0.22 + 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            />
            {/* Receptive field growth annotation on the arrow */}
            <motion.text
              x={midX}
              y={arrowY - 8}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-sans)"
              fill="var(--color-text-tertiary)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.65 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.22 + 0.45,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {i === 0
                ? '3\u00d73 \u2192 5\u00d75'
                : i === 1
                  ? '5\u00d75 \u2192 larger'
                  : 'larger \u2192 full'}
            </motion.text>
          </g>
        )
      })}

      {/* Bottom summary label */}
      <motion.text
        x={280}
        y={228}
        textAnchor="middle"
        fontSize="10"
        fontWeight={500}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-secondary)"
        letterSpacing="0.04em"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Each layer combines features from the previous layer
      </motion.text>
    </svg>
  )
}
