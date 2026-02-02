'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ManifoldInterpolationDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function ManifoldInterpolationDiagram({ className }: ManifoldInterpolationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Curved manifold path -- a smooth S-curve band flowing through the space
  const manifoldPath = 'M 50 210 Q 110 190, 150 160 T 240 120 Q 280 100, 330 110 T 440 140'

  // Training data points scattered along the manifold
  const trainingPoints = [
    { x: 65, y: 205 },
    { x: 100, y: 190 },
    { x: 135, y: 168 },
    { x: 175, y: 145 },
    { x: 210, y: 128 },
    { x: 260, y: 108 },
    { x: 310, y: 108 },
    { x: 355, y: 118 },
    { x: 400, y: 128 },
    { x: 430, y: 138 },
  ]

  // Interpolation point: between training points on the manifold
  const interpolationPoint = { x: 235, y: 116 }

  // Extrapolation point: off the manifold, floating in ambient space
  const extrapolationPoint = { x: 310, y: 48 }

  // Light grid dots suggesting high-dimensional ambient space
  const ambientDots: { x: number; y: number }[] = []
  for (let gx = 40; gx <= 460; gx += 30) {
    for (let gy = 30; gy <= 260; gy += 30) {
      ambientDots.push({ x: gx, y: gy })
    }
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 280"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
      role="img"
      aria-label="Manifold interpolation diagram showing how models generalize reliably by interpolating on the data manifold, versus unreliable extrapolation off the manifold"
    >
      <defs>
        {/* Gradient for manifold surface ribbon */}
        <linearGradient id="manifoldInterpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
          <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Ambient space: faint grid dots suggesting high-dimensional space */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {ambientDots.map((dot, i) => (
          <circle
            key={`ambient-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="0.8"
            fill="var(--color-border-primary)"
            opacity="0.2"
          />
        ))}
      </motion.g>

      {/* Ambient space label */}
      <motion.text
        x="468"
        y="268"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        textAnchor="end"
        opacity="0.6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        High-dimensional ambient space
      </motion.text>

      {/* Manifold surface ribbon (thick translucent band) */}
      <motion.path
        d={manifoldPath}
        fill="none"
        stroke="url(#manifoldInterpGrad)"
        strokeWidth="40"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Manifold curve outline */}
      <motion.path
        d={manifoldPath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Training data points on the manifold */}
      {trainingPoints.map((point, i) => (
        <motion.circle
          key={`train-${i}`}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 0.85 } : { scale: 0, opacity: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.9 + i * 0.06,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Interpolation point on the manifold */}
      <motion.circle
        cx={interpolationPoint.x}
        cy={interpolationPoint.y}
        r="6"
        fill="var(--color-accent)"
        stroke="var(--color-bg-elevated)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
      />

      {/* Interpolation label with connector */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.9, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={interpolationPoint.x}
          y1={interpolationPoint.y + 8}
          x2={interpolationPoint.x}
          y2={interpolationPoint.y + 30}
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.5"
        />
        <text
          x={interpolationPoint.x}
          y={interpolationPoint.y + 44}
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
          textAnchor="middle"
        >
          Interpolation
        </text>
        <text
          x={interpolationPoint.x}
          y={interpolationPoint.y + 57}
          fontSize="10"
          fill="var(--color-accent)"
          textAnchor="middle"
          opacity="0.8"
        >
          (reliable)
        </text>
      </motion.g>

      {/* Extrapolation point off the manifold */}
      <motion.circle
        cx={extrapolationPoint.x}
        cy={extrapolationPoint.y}
        r="5"
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="3,2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.7 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Dashed line from manifold to extrapolation point */}
      <motion.line
        x1={extrapolationPoint.x}
        y1={extrapolationPoint.y + 7}
        x2={extrapolationPoint.x}
        y2={108 - 5}
        stroke="var(--color-text-tertiary)"
        strokeWidth="1"
        strokeDasharray="3,3"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Extrapolation label */}
      <motion.g
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: 2.3, ease: PRODUCTIVE_EASE }}
      >
        <text
          x={extrapolationPoint.x}
          y={extrapolationPoint.y - 14}
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
        >
          Extrapolation
        </text>
        <text
          x={extrapolationPoint.x}
          y={extrapolationPoint.y - 2}
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          opacity="0.7"
        >
          (unreliable)
        </text>
      </motion.g>

      {/* Data manifold label */}
      <motion.text
        x="90"
        y="235"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        Data manifold
      </motion.text>

      {/* Connector from manifold label to curve */}
      <motion.line
        x1="100"
        y1="228"
        x2="100"
        y2="198"
        stroke="var(--color-accent)"
        strokeWidth="1"
        opacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Bottom annotation */}
      <motion.text
        x="240"
        y="20"
        fontSize="12"
        fontWeight="600"
        fill="var(--color-text-primary)"
        textAnchor="middle"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 2.5, ease: PRODUCTIVE_EASE }}
      >
        Models generalize by interpolating on the data manifold
      </motion.text>
    </svg>
  )
}
