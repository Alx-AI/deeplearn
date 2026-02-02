'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LocalVsExtremeGenDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function LocalVsExtremeGenDiagram({ className }: LocalVsExtremeGenDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Training data cluster (centered around ~160, 150)
  const trainingPoints = [
    { x: 130, y: 130 },
    { x: 155, y: 120 },
    { x: 145, y: 150 },
    { x: 170, y: 140 },
    { x: 160, y: 160 },
    { x: 180, y: 155 },
    { x: 140, y: 170 },
    { x: 165, y: 175 },
    { x: 185, y: 130 },
    { x: 150, y: 140 },
    { x: 175, y: 165 },
    { x: 195, y: 150 },
  ]

  // Local generalization test points (within the distribution, interpolated)
  const localTestPoints = [
    { x: 152, y: 145 },
    { x: 168, y: 152 },
    { x: 178, y: 142 },
  ]

  // Extreme generalization point (far outside the cluster)
  const extremePoint = { x: 390, y: 80 }

  // Boundary path around the training cluster (organic, slightly irregular ellipse)
  const clusterBoundary =
    'M 115,115 Q 135,95 170,100 Q 210,100 210,130 Q 215,160 205,180 Q 190,200 160,195 Q 130,195 118,175 Q 108,155 115,115 Z'

  // Local generalization zone (slightly larger than the cluster boundary)
  const localZone =
    'M 100,100 Q 130,75 175,80 Q 225,82 228,125 Q 235,165 220,195 Q 200,220 160,215 Q 120,215 102,190 Q 85,160 100,100 Z'

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 300"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
      role="img"
      aria-label="Diagram contrasting local generalization (interpolation within training distribution) with extreme generalization (novel reasoning outside training distribution)"
    >
      <defs>
        {/* Arrowhead for accent-colored arrows */}
        <marker
          id="arrow-local-gen"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <path
            d="M 0 0 L 8 3 L 0 6 Z"
            fill="var(--color-accent)"
          />
        </marker>

        {/* Arrowhead for muted arrows */}
        <marker
          id="arrow-extreme-gen"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <path
            d="M 0 0 L 8 3 L 0 6 Z"
            fill="var(--color-text-tertiary)"
          />
        </marker>

        {/* Gradient for local generalization zone */}
        <radialGradient id="local-zone-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.04" />
        </radialGradient>

        {/* Dashed pattern for uncertainty ring around extreme point */}
        <radialGradient id="uncertain-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-text-tertiary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--color-text-tertiary)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Faint coordinate grid ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {[80, 120, 160, 200, 240].map((y) => (
          <line
            key={`grid-h-${y}`}
            x1="40"
            y1={y}
            x2="460"
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.15"
          />
        ))}
        {[80, 140, 200, 260, 320, 380, 440].map((x) => (
          <line
            key={`grid-v-${x}`}
            x1={x}
            y1="50"
            x2={x}
            y2="260"
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.15"
          />
        ))}
      </motion.g>

      {/* ── Title ── */}
      <motion.text
        x="240"
        y="28"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        Local vs. Extreme Generalization
      </motion.text>

      {/* ── Local generalization shaded zone ── */}
      <motion.path
        d={localZone}
        fill="url(#local-zone-gradient)"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: '160px 150px' }}
      />

      {/* ── Cluster boundary (dashed border around training data) ── */}
      <motion.path
        d={clusterBoundary}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="5,4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.7 } : {}}
        transition={{ duration: 1.2, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Training data points ── */}
      {trainingPoints.map((point, i) => (
        <motion.circle
          key={`train-${i}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="var(--color-text-secondary)"
          stroke="var(--color-bg-elevated)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.35,
            delay: 0.6 + i * 0.04,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* ── Local test points (confident predictions within zone) ── */}
      {localTestPoints.map((point, i) => (
        <g key={`local-test-${i}`}>
          {/* Confidence ring */}
          <motion.circle
            cx={point.x}
            cy={point.y}
            r="8"
            fill="var(--color-accent)"
            opacity="0.1"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.1 } : {}}
            transition={{
              duration: 0.4,
              delay: 1.2 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
          {/* Point */}
          <motion.circle
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="var(--color-accent)"
            stroke="var(--color-bg-elevated)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 1.2 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
          {/* Checkmark */}
          <motion.path
            d={`M ${point.x - 3} ${point.y} L ${point.x - 1} ${point.y + 2.5} L ${point.x + 3} ${point.y - 2.5}`}
            fill="none"
            stroke="var(--color-bg-elevated)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.3,
              delay: 1.4 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
        </g>
      ))}

      {/* ── Extreme generalization point (far outside cluster) ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Uncertainty halo (pulsing) */}
        <motion.circle
          cx={extremePoint.x}
          cy={extremePoint.y}
          r="22"
          fill="url(#uncertain-gradient)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeDasharray="3,3"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.5 } : {}}
          transition={{ duration: 0.6, delay: 1.7, ease: PRODUCTIVE_EASE }}
        />

        {/* The extreme point itself */}
        <motion.circle
          cx={extremePoint.x}
          cy={extremePoint.y}
          r="5"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Question mark inside the point */}
        <motion.text
          x={extremePoint.x}
          y={extremePoint.y + 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="var(--color-text-tertiary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 2.0, ease: PRODUCTIVE_EASE }}
        >
          ?
        </motion.text>
      </motion.g>

      {/* ── Dashed line connecting cluster to extreme point ── */}
      <motion.line
        x1="220"
        y1="135"
        x2="365"
        y2="85"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.35"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.35 } : {}}
        transition={{ duration: 0.8, delay: 1.5, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Distance label on the connecting line ── */}
      <motion.text
        x="295"
        y="100"
        textAnchor="middle"
        fontSize="9"
        fontStyle="italic"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        large distance
      </motion.text>

      {/* ── Arrow: "What DL does well" pointing to local zone ── */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        <motion.path
          d="M 68,230 Q 90,210 115,195"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          markerEnd="url(#arrow-local-gen)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.3, ease: PRODUCTIVE_EASE }}
        />
        <text
          x="65"
          y="246"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
          textAnchor="start"
        >
          What DL does well
        </text>
      </motion.g>

      {/* ── Arrow: "Still requires human reasoning" pointing to extreme zone ── */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 2.5, ease: PRODUCTIVE_EASE }}
      >
        <motion.path
          d="M 420,135 Q 415,115 400,100"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          markerEnd="url(#arrow-extreme-gen)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.6, ease: PRODUCTIVE_EASE }}
        />
        <text
          x="460"
          y="148"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="end"
        >
          Still requires
        </text>
        <text
          x="460"
          y="161"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="end"
        >
          human reasoning
        </text>
      </motion.g>

      {/* ── Zone labels ── */}

      {/* Local generalization zone label */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="160"
          y="58"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Local Generalization
        </text>
        <text
          x="160"
          y="72"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          Interpolation within training distribution
        </text>
      </motion.g>

      {/* Extreme generalization label */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 2.1, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={extremePoint.x}
          y={extremePoint.y - 32}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Extreme Generalization
        </text>
        <text
          x={extremePoint.x}
          y={extremePoint.y - 18}
          textAnchor="middle"
          fontSize="8"
          fill="var(--color-text-tertiary)"
        >
          Novel reasoning beyond training data
        </text>
      </motion.g>

      {/* ── Legend at the bottom ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 2.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Training data legend entry */}
        <circle
          cx="110"
          cy="285"
          r="3.5"
          fill="var(--color-text-secondary)"
        />
        <text
          x="118"
          y="288"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Training data
        </text>

        {/* Confident prediction legend entry */}
        <circle
          cx="200"
          cy="285"
          r="3.5"
          fill="var(--color-accent)"
        />
        <text
          x="208"
          y="288"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Confident prediction
        </text>

        {/* Uncertain prediction legend entry */}
        <circle
          cx="328"
          cy="285"
          r="3.5"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
        />
        <text
          x="336"
          y="288"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Uncertain / wrong
        </text>
      </motion.g>
    </svg>
  )
}
