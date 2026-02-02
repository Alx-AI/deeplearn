'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FeatureEngineeringDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function FeatureEngineeringDiagram({
  className = '',
}: FeatureEngineeringDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Clock hand endpoints for the coordinates column
  // Hour hand tip and minute hand tip (relative to clock center)
  const hourHandTip = { x: 226, y: 72 }
  const minuteHandTip = { x: 243, y: 60 }

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 540 260"
        role="img"
        aria-label="Feature engineering diagram showing how converting raw clock face pixels to coordinates to angles progressively simplifies the learning problem"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-feat-eng"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-accent)"
            />
          </marker>
          <marker
            id="arrowhead-feat-eng-muted"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>

        {/* ===== Column 1: Raw Pixels (Clock Face) ===== */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Column title */}
          <text
            x="75"
            y="18"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            Raw Pixels
          </text>

          {/* Clock face background */}
          <rect
            x="25"
            y="30"
            width="100"
            height="100"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />

          {/* Clock circle */}
          <circle
            cx="75"
            cy="80"
            r="38"
            fill="none"
            stroke="var(--color-text-primary)"
            strokeWidth="1.5"
          />

          {/* Clock tick marks (12 positions) */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const outerR = 38
            const innerR = i % 3 === 0 ? 32 : 34
            return (
              <line
                key={`tick-${i}`}
                x1={75 + Math.cos(angle) * innerR}
                y1={80 + Math.sin(angle) * innerR}
                x2={75 + Math.cos(angle) * outerR}
                y2={80 + Math.sin(angle) * outerR}
                stroke="var(--color-text-secondary)"
                strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
              />
            )
          })}

          {/* Hour hand (pointing roughly at 10 o'clock) */}
          <line
            x1="75"
            y1="80"
            x2="58"
            y2="62"
            stroke="var(--color-text-primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Minute hand (pointing roughly at 2 o'clock) */}
          <line
            x1="75"
            y1="80"
            x2="100"
            y2="56"
            stroke="var(--color-text-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle
            cx="75"
            cy="80"
            r="2.5"
            fill="var(--color-text-primary)"
          />

          {/* Pixel grid overlay to suggest raster */}
          {[...Array(9)].map((_, i) => (
            <g key={`grid-${i}`}>
              <line
                x1="25"
                y1={30 + (i + 1) * 10}
                x2="125"
                y2={30 + (i + 1) * 10}
                stroke="var(--color-border-primary)"
                strokeWidth="0.3"
                opacity="0.25"
              />
              <line
                x1={25 + (i + 1) * 10}
                y1="30"
                x2={25 + (i + 1) * 10}
                y2="130"
                stroke="var(--color-border-primary)"
                strokeWidth="0.3"
                opacity="0.25"
              />
            </g>
          ))}

          {/* Difficulty label */}
          <text
            x="75"
            y="148"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            Hard - model must
          </text>
          <text
            x="75"
            y="158"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            learn everything
          </text>
        </motion.g>

        {/* ===== Arrow 1: Raw Pixels -> Coordinates ===== */}
        <motion.g
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="132"
            y1="80"
            x2="172"
            y2="80"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-feat-eng)"
          />
          <text
            x="152"
            y="72"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Feature
          </text>
          <text
            x="152"
            y="94"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Eng.
          </text>
        </motion.g>

        {/* ===== Column 2: Coordinates ===== */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
        >
          {/* Column title */}
          <text
            x="235"
            y="18"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            Coordinates
          </text>

          {/* Coordinate space background */}
          <rect
            x="185"
            y="30"
            width="100"
            height="100"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />

          {/* Faint axes within the box */}
          <line
            x1="195"
            y1="120"
            x2="275"
            y2="120"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            opacity="0.4"
          />
          <line
            x1="195"
            y1="40"
            x2="195"
            y2="120"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            opacity="0.4"
          />

          {/* Axis labels */}
          <text
            x="276"
            y="118"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            opacity="0.6"
          >
            x
          </text>
          <text
            x="197"
            y="39"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            opacity="0.6"
          >
            y
          </text>

          {/* Hour hand tip point */}
          <motion.circle
            cx={hourHandTip.x}
            cy={hourHandTip.y}
            r="4"
            fill="var(--color-accent)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
          />

          {/* Minute hand tip point */}
          <motion.circle
            cx={minuteHandTip.x}
            cy={minuteHandTip.y}
            r="4"
            fill="var(--color-accent)"
            opacity="0.6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
          />

          {/* Coordinate annotations */}
          <text
            x={hourHandTip.x - 2}
            y={hourHandTip.y + 14}
            fill="var(--color-text-secondary)"
            fontSize="9"
            textAnchor="middle"
          >
            (x₁, y₁)
          </text>
          <text
            x={minuteHandTip.x + 2}
            y={minuteHandTip.y - 6}
            fill="var(--color-text-secondary)"
            fontSize="9"
            textAnchor="middle"
          >
            (x₂, y₂)
          </text>

          {/* Dashed lines from origin to points to suggest spatial position */}
          <line
            x1="195"
            y1="120"
            x2={hourHandTip.x}
            y2={hourHandTip.y}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.4"
          />
          <line
            x1="195"
            y1="120"
            x2={minuteHandTip.x}
            y2={minuteHandTip.y}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.4"
          />

          {/* Difficulty label */}
          <text
            x="235"
            y="148"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            Easier - spatial
          </text>
          <text
            x="235"
            y="158"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            info extracted
          </text>
        </motion.g>

        {/* ===== Arrow 2: Coordinates -> Angles ===== */}
        <motion.g
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="292"
            y1="80"
            x2="332"
            y2="80"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-feat-eng)"
          />
          <text
            x="312"
            y="72"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Feature
          </text>
          <text
            x="312"
            y="94"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Eng.
          </text>
        </motion.g>

        {/* ===== Column 3: Angles ===== */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          {/* Column title */}
          <text
            x="395"
            y="18"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            Angles
          </text>

          {/* Angle representation background */}
          <rect
            x="345"
            y="30"
            width="100"
            height="100"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />

          {/* Angle arc for theta 1 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
          >
            {/* Reference line (horizontal from center) */}
            <line
              x1="380"
              y1="70"
              x2="420"
              y2="70"
              stroke="var(--color-text-tertiary)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.5"
            />

            {/* Angle arc for theta 1 */}
            <path
              d="M 400 70 A 20 20 0 0 0 385 55"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />

            {/* Theta 1 label */}
            <text
              x="406"
              y="60"
              fill="var(--color-accent)"
              fontSize="10"
              fontWeight="600"
            >
              {'θ₁'}
            </text>

            {/* Angle line for theta 1 (going to ~10 o'clock direction) */}
            <line
              x1="380"
              y1="70"
              x2="366"
              y2="52"
              stroke="var(--color-text-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Angle arc for theta 2 */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.35, ease: PRODUCTIVE_EASE }}
          >
            {/* Reference line */}
            <line
              x1="380"
              y1="105"
              x2="420"
              y2="105"
              stroke="var(--color-text-tertiary)"
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.5"
            />

            {/* Angle arc for theta 2 */}
            <path
              d="M 400 105 A 20 20 0 0 1 410 88"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              opacity="0.7"
            />

            {/* Theta 2 label */}
            <text
              x="412"
              y="96"
              fill="var(--color-accent)"
              fontSize="10"
              fontWeight="600"
              opacity="0.8"
            >
              {'θ₂'}
            </text>

            {/* Angle line for theta 2 (going to ~2 o'clock direction) */}
            <line
              x1="380"
              y1="105"
              x2="408"
              y2="88"
              stroke="var(--color-text-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Equals sign and value hint */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
          >
            <text
              x="370"
              y="60"
              fill="var(--color-text-secondary)"
              fontSize="9"
              textAnchor="end"
            >
              {'θ₁ = 300°'}
            </text>
            <text
              x="370"
              y="100"
              fill="var(--color-text-secondary)"
              fontSize="9"
              textAnchor="end"
            >
              {'θ₂ = 60°'}
            </text>
          </motion.g>

          {/* Difficulty label */}
          <text
            x="395"
            y="148"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            Trivial - direct
          </text>
          <text
            x="395"
            y="158"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            encoding
          </text>
        </motion.g>

        {/* ===== Bottom Section: Model Complexity ===== */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          {/* Horizontal line separating top and bottom */}
          <line
            x1="20"
            y1="175"
            x2="450"
            y2="175"
            stroke="var(--color-border-primary)"
            strokeWidth="0.8"
            opacity="0.3"
          />

          {/* Section label */}
          <text
            x="235"
            y="192"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="600"
          >
            Model Complexity Required
          </text>
        </motion.g>

        {/* Complex Model box */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="30"
            y="202"
            width="90"
            height="32"
            rx="4"
            fill="var(--color-accent)"
            opacity="0.15"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <text
            x="75"
            y="220"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontWeight="600"
          >
            Complex Model
          </text>
          <text
            x="75"
            y="230"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            (deep network)
          </text>
        </motion.g>

        {/* Arrow: Complex -> Simpler */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="126"
            y1="218"
            x2="178"
            y2="218"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            markerEnd="url(#arrowhead-feat-eng-muted)"
          />
        </motion.g>

        {/* Simpler Model box */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.9, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="184"
            y="202"
            width="100"
            height="32"
            rx="4"
            fill="var(--color-accent)"
            opacity="0.1"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="4 2"
          />
          <text
            x="234"
            y="220"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontWeight="600"
          >
            Simpler Model
          </text>
          <text
            x="234"
            y="230"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            (shallow network)
          </text>
        </motion.g>

        {/* Arrow: Simpler -> Linear */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 2.1, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="290"
            y1="218"
            x2="342"
            y2="218"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            markerEnd="url(#arrowhead-feat-eng-muted)"
          />
        </motion.g>

        {/* Linear Model box */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="348"
            y="202"
            width="92"
            height="32"
            rx="4"
            fill="var(--color-accent)"
            opacity="0.06"
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x="394"
            y="220"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontWeight="600"
          >
            Linear Model
          </text>
          <text
            x="394"
            y="230"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            (regression)
          </text>
        </motion.g>

        {/* Decreasing complexity arrow annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.4, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="235"
            y="253"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            Better features → simpler model needed
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
