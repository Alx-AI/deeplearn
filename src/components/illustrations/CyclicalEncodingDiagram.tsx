'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface CyclicalEncodingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function CyclicalEncodingDiagram({
  className = '',
}: CyclicalEncodingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const leftPanelCenterX = 125
  const rightPanelCenterX = 390
  const circleCenterY = 135
  const circleR = 72

  // The "highlighted" hour on the circle (e.g. hour 22 => 22/24 around)
  const highlightHour = 22
  const highlightAngle =
    (highlightHour / 24) * 2 * Math.PI - Math.PI / 2 // offset so 0h is at top
  const highlightX =
    rightPanelCenterX + circleR * Math.cos(highlightAngle)
  const highlightY = circleCenterY + circleR * Math.sin(highlightAngle)

  // Projection lines for sin/cos
  const cosProjectionX = highlightX
  const cosProjectionY = circleCenterY
  const sinProjectionX = rightPanelCenterX
  const sinProjectionY = highlightY

  // Animation phases
  const phase1 = 0 // left panel (linear encoding)
  const phase2 = 0.6 // right panel (circle + hours)
  const phase3 = 1.2 // projections (sin/cos)
  const phase4 = 1.8 // annotations

  // Hours to show as tick marks on the number line
  const numberLineHours = [0, 3, 6, 9, 12, 15, 18, 21, 23]
  const numberLineY = circleCenterY
  const numberLineLeft = 25
  const numberLineRight = 225

  // Hours to show on the circle
  const circleHours = [0, 3, 6, 9, 12, 15, 18, 21]

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 260"
      className={className}
      role="img"
      aria-label="Cyclical encoding diagram comparing linear hour representation where midnight and 23:59 are far apart versus cyclical sine-cosine encoding on a unit circle where they are naturally adjacent"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-cyc"
          markerWidth="8"
          markerHeight="8"
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
          id="arrowhead-cyc-accent"
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
      </defs>

      {/* ============================================================
          LEFT PANEL: Linear Encoding
          ============================================================ */}

      {/* Title */}
      <motion.text
        x={leftPanelCenterX}
        y="22"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: phase1, ease: PRODUCTIVE_EASE }}
      >
        Linear Encoding
      </motion.text>

      {/* Number line */}
      <motion.g
        initial={{ opacity: 0, x: -12 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
        transition={{ duration: 0.6, delay: phase1 + 0.1, ease: PRODUCTIVE_EASE }}
      >
        {/* Main line with arrowheads */}
        <line
          x1={numberLineLeft}
          y1={numberLineY}
          x2={numberLineRight}
          y2={numberLineY}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-cyc)"
        />

        {/* Tick marks and labels */}
        {numberLineHours.map((hour) => {
          const t = hour / 23
          const x = numberLineLeft + t * (numberLineRight - numberLineLeft - 10)
          return (
            <g key={`tick-${hour}`}>
              <line
                x1={x}
                y1={numberLineY - 5}
                x2={x}
                y2={numberLineY + 5}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={numberLineY + 16}
                textAnchor="middle"
                fill="var(--color-text-tertiary)"
                fontSize="9"
              >
                {hour}
              </text>
            </g>
          )
        })}
      </motion.g>

      {/* Highlight 0:00 and 23:59 on the line */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, delay: phase1 + 0.35, ease: PRODUCTIVE_EASE }}
      >
        {/* 0:00 dot */}
        <circle
          cx={numberLineLeft}
          cy={numberLineY}
          r="5"
          fill="var(--color-accent)"
          opacity="0.9"
        />
        <text
          x={numberLineLeft}
          y={numberLineY - 12}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          0:00
        </text>

        {/* 23:59 dot */}
        <circle
          cx={numberLineRight - 10}
          cy={numberLineY}
          r="5"
          fill="var(--color-accent)"
          opacity="0.9"
        />
        <text
          x={numberLineRight - 10}
          y={numberLineY - 12}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          23:59
        </text>
      </motion.g>

      {/* Double-headed arrow showing "far apart" distance */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: phase1 + 0.55, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={numberLineLeft + 12}
          y1={numberLineY + 30}
          x2={numberLineRight - 22}
          y2={numberLineY + 30}
          stroke="var(--color-error)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        {/* Left arrow cap */}
        <polygon
          points={`${numberLineLeft + 12},${numberLineY + 27} ${numberLineLeft + 12},${numberLineY + 33} ${numberLineLeft + 6},${numberLineY + 30}`}
          fill="var(--color-error)"
        />
        {/* Right arrow cap */}
        <polygon
          points={`${numberLineRight - 22},${numberLineY + 27} ${numberLineRight - 22},${numberLineY + 33} ${numberLineRight - 16},${numberLineY + 30}`}
          fill="var(--color-error)"
        />
      </motion.g>

      {/* Problem label */}
      <motion.text
        x={leftPanelCenterX}
        y={numberLineY + 52}
        textAnchor="middle"
        fill="var(--color-error)"
        fontSize="9"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase1 + 0.7, ease: PRODUCTIVE_EASE }}
      >
        Problem: 23:59 and 0:01 appear far apart
      </motion.text>

      {/* "hour = 17" raw value example */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase1 + 0.5, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={leftPanelCenterX}
          y={numberLineY - 32}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          feature = hour (0-23)
        </text>
      </motion.g>

      {/* ============================================================
          DIVIDER
          ============================================================ */}
      <motion.line
        x1="258"
        y1="15"
        x2="258"
        y2="245"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        opacity="0.3"
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.6, delay: phase2 - 0.1, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: '258px 130px' }}
      />

      {/* ============================================================
          RIGHT PANEL: Cyclical Encoding (Unit Circle)
          ============================================================ */}

      {/* Title */}
      <motion.text
        x={rightPanelCenterX}
        y="22"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: phase2, ease: PRODUCTIVE_EASE }}
      >
        Cyclical Encoding
      </motion.text>

      {/* Unit circle */}
      <motion.circle
        cx={rightPanelCenterX}
        cy={circleCenterY}
        r={circleR}
        fill="none"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.6, delay: phase2 + 0.1, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${rightPanelCenterX}px ${circleCenterY}px` }}
      />

      {/* Axes through center */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase2 + 0.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Horizontal axis */}
        <line
          x1={rightPanelCenterX - circleR - 12}
          y1={circleCenterY}
          x2={rightPanelCenterX + circleR + 12}
          y2={circleCenterY}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
        {/* Vertical axis */}
        <line
          x1={rightPanelCenterX}
          y1={circleCenterY - circleR - 12}
          x2={rightPanelCenterX}
          y2={circleCenterY + circleR + 12}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
        />
      </motion.g>

      {/* Axis labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase2 + 0.3, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={rightPanelCenterX + circleR + 16}
          y={circleCenterY + 3}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          cos
        </text>
        <text
          x={rightPanelCenterX + 4}
          y={circleCenterY - circleR - 14}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          sin
        </text>
      </motion.g>

      {/* Hour markers around the circle */}
      {circleHours.map((hour, i) => {
        const angle = (hour / 24) * 2 * Math.PI - Math.PI / 2
        const markerR = circleR + 1
        const labelR = circleR + 14
        const mx = rightPanelCenterX + markerR * Math.cos(angle)
        const my = circleCenterY + markerR * Math.sin(angle)
        const lx = rightPanelCenterX + labelR * Math.cos(angle)
        const ly = circleCenterY + labelR * Math.sin(angle)
        return (
          <motion.g
            key={`hour-marker-${hour}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: phase2 + 0.25 + i * 0.04,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <circle
              cx={mx}
              cy={my}
              r="2"
              fill="var(--color-text-tertiary)"
            />
            <text
              x={lx}
              y={ly + 3}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
            >
              {hour}
            </text>
          </motion.g>
        )
      })}

      {/* Highlight: 0:00 on the circle (top) */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.5, delay: phase2 + 0.55, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx={rightPanelCenterX}
          cy={circleCenterY - circleR}
          r="5"
          fill="var(--color-accent)"
          opacity="0.9"
        />
        <text
          x={rightPanelCenterX + 12}
          y={circleCenterY - circleR - 6}
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          0:00
        </text>
      </motion.g>

      {/* Highlight: 23:59 on the circle (just before top, going clockwise) */}
      {(() => {
        const lateAngle = (23.98 / 24) * 2 * Math.PI - Math.PI / 2
        const lx = rightPanelCenterX + circleR * Math.cos(lateAngle)
        const ly = circleCenterY + circleR * Math.sin(lateAngle)
        return (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{
              duration: 0.5,
              delay: phase2 + 0.65,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <circle cx={lx} cy={ly} r="5" fill="var(--color-accent)" opacity="0.9" />
            <text
              x={lx - 14}
              y={ly - 6}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="600"
            >
              23:59
            </text>
          </motion.g>
        )
      })()}

      {/* Small arc bracket between 23:59 and 0:00 showing adjacency */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: phase2 + 0.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Small green bracket arc outside the circle */}
        <path
          d={`M ${rightPanelCenterX - 6} ${circleCenterY - circleR - 6} A ${circleR + 6} ${circleR + 6} 0 0 1 ${rightPanelCenterX + 6} ${circleCenterY - circleR - 6}`}
          fill="none"
          stroke="var(--color-success)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.g>

      {/* Solution label */}
      <motion.text
        x={rightPanelCenterX}
        y={circleCenterY + circleR + 32}
        textAnchor="middle"
        fill="var(--color-success)"
        fontSize="9"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase2 + 0.9, ease: PRODUCTIVE_EASE }}
      >
        Solution: naturally adjacent
      </motion.text>

      {/* ============================================================
          PHASE 3: Sin/Cos Projections from the highlight point
          ============================================================ */}

      {/* Radius line from center to highlight point */}
      <motion.line
        x1={rightPanelCenterX}
        y1={circleCenterY}
        x2={highlightX}
        y2={highlightY}
        stroke="var(--color-text-primary)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 0.7 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay: phase3, ease: PRODUCTIVE_EASE }}
      />

      {/* Highlight point on circle */}
      <motion.circle
        cx={highlightX}
        cy={highlightY}
        r="4.5"
        fill="var(--color-warning)"
        stroke="var(--color-bg-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.4, delay: phase3 + 0.1, ease: PRODUCTIVE_EASE }}
      />

      {/* cos(theta) projection: horizontal dashed line from point down to x-axis */}
      <motion.line
        x1={highlightX}
        y1={highlightY}
        x2={cosProjectionX}
        y2={cosProjectionY}
        stroke="var(--color-info)"
        strokeWidth="1.2"
        strokeDasharray="3 2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: phase3 + 0.2, ease: PRODUCTIVE_EASE }}
      />

      {/* sin(theta) projection: vertical dashed line from point to y-axis */}
      <motion.line
        x1={highlightX}
        y1={highlightY}
        x2={sinProjectionX}
        y2={sinProjectionY}
        stroke="var(--color-error)"
        strokeWidth="1.2"
        strokeDasharray="3 2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: phase3 + 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* cos(theta) label on x-axis */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase3 + 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Small marker on x-axis for cos projection */}
        <line
          x1={cosProjectionX}
          y1={circleCenterY - 3}
          x2={cosProjectionX}
          y2={circleCenterY + 3}
          stroke="var(--color-info)"
          strokeWidth="2"
        />
        <text
          x={cosProjectionX}
          y={circleCenterY + 14}
          textAnchor="middle"
          fill="var(--color-info)"
          fontSize="9"
          fontWeight="600"
        >
          cos(θ)
        </text>
      </motion.g>

      {/* sin(theta) label on y-axis */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase3 + 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Small marker on y-axis for sin projection */}
        <line
          x1={rightPanelCenterX - 3}
          y1={sinProjectionY}
          x2={rightPanelCenterX + 3}
          y2={sinProjectionY}
          stroke="var(--color-error)"
          strokeWidth="2"
        />
        <text
          x={rightPanelCenterX - 14}
          y={sinProjectionY + 3}
          textAnchor="middle"
          fill="var(--color-error)"
          fontSize="9"
          fontWeight="600"
        >
          sin(θ)
        </text>
      </motion.g>

      {/* Angle arc from x-axis to radius line */}
      {(() => {
        const arcR = 18
        // The angle of the highlight point measured from positive x-axis
        const rawAngle = Math.atan2(
          highlightY - circleCenterY,
          highlightX - rightPanelCenterX
        )
        const endX = rightPanelCenterX + arcR * Math.cos(rawAngle)
        const endY = circleCenterY + arcR * Math.sin(rawAngle)
        // Arc from positive x-axis direction to the angle
        const startArcX = rightPanelCenterX + arcR
        const startArcY = circleCenterY
        // Determine sweep: raw angle is negative (above x-axis) so we need large arc
        const largeArc = rawAngle < 0 ? 1 : 0
        return (
          <motion.path
            d={`M ${startArcX} ${startArcY} A ${arcR} ${arcR} 0 ${largeArc} 0 ${endX} ${endY}`}
            fill="none"
            stroke="var(--color-warning)"
            strokeWidth="1.2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: phase3 + 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })()}

      {/* Theta label near the arc */}
      <motion.text
        x={rightPanelCenterX + 22}
        y={circleCenterY - 10}
        fill="var(--color-warning)"
        fontSize="9"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: phase3 + 0.25, ease: PRODUCTIVE_EASE }}
      >
        θ
      </motion.text>

      {/* ============================================================
          PHASE 4: Formula Annotation
          ============================================================ */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: phase4, ease: PRODUCTIVE_EASE }}
      >
        {/* Annotation background box spanning full width */}
        <rect
          x="30"
          y="232"
          width="460"
          height="22"
          rx="4"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.5"
        />
        <text
          x="260"
          y="247"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          sin(2π × hour / 24),  cos(2π × hour / 24)
        </text>
      </motion.g>
    </svg>
  )
}
