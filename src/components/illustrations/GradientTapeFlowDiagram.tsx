'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GradientTapeFlowDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function GradientTapeFlowDiagram({ className = '' }: GradientTapeFlowDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* Computation step boxes inside the tape */
  const steps = [
    { x: 68, y: 68, w: 56, h: 34, label: 'x', sublabel: 'input' },
    { x: 156, y: 68, w: 56, h: 34, label: 'x\u00B2', sublabel: 'square' },
    { x: 244, y: 68, w: 56, h: 34, label: 'x\u00B2+c', sublabel: 'add' },
    { x: 332, y: 68, w: 56, h: 34, label: 'y', sublabel: 'result' },
  ]

  /* Arrows between computation steps */
  const stepArrows = [
    { x1: 124, x2: 156 },
    { x1: 212, x2: 244 },
    { x1: 300, x2: 332 },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 240"
      className={className}
      role="img"
      aria-label="GradientTape flow diagram showing how TensorFlow records operations on watched variables for automatic differentiation, then computes gradients"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrow marker for computation flow */}
        <marker
          id="arrowhead-gradient-tape"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L7,3 z" fill="var(--color-accent)" />
        </marker>

        {/* Arrow marker for gradient output */}
        <marker
          id="arrowhead-gradient-tape-out"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L7,3 z" fill="var(--color-text-secondary)" />
        </marker>
      </defs>

      {/* ======================== */}
      {/* GradientTape outer box   */}
      {/* ======================== */}
      <motion.g
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Tape background */}
        <rect
          x="30"
          y="28"
          width="396"
          height="96"
          rx="10"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="6,3"
        />

        {/* Tape label */}
        <text
          x="42"
          y="48"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          GradientTape
        </text>

        {/* Tape reel icons (left) */}
        <circle
          cx="408"
          cy="44"
          r="6"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          opacity="0.5"
        />
        <circle
          cx="408"
          cy="44"
          r="2"
          fill="var(--color-accent)"
          opacity="0.5"
        />
      </motion.g>

      {/* ======================== */}
      {/* Watched variable badge   */}
      {/* (eye icon + highlight)   */}
      {/* ======================== */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Highlight glow behind x */}
        <rect
          x="64"
          y="64"
          width="64"
          height="42"
          rx="8"
          fill="var(--color-accent)"
          opacity="0.08"
        />

        {/* Eye icon above the input */}
        <g transform="translate(84, 58)">
          {/* Eye outline */}
          <path
            d="M-8,0 Q0,-6 8,0 Q0,6 -8,0 Z"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.2"
          />
          {/* Pupil */}
          <circle cx="0" cy="0" r="2" fill="var(--color-accent)" />
        </g>

        {/* "watched" label */}
        <text
          x="96"
          y="56"
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          fill="var(--color-accent)"
          opacity="0.85"
        >
          watched
        </text>
      </motion.g>

      {/* ======================== */}
      {/* Computation step boxes   */}
      {/* ======================== */}
      {steps.map((step, i) => (
        <motion.g
          key={`step-${i}`}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.4 + i * 0.12, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={step.x}
            y={step.y}
            width={step.w}
            height={step.h}
            rx="6"
            fill="var(--color-bg-elevated)"
            stroke={i === 0 ? 'var(--color-accent)' : 'var(--color-border-primary)'}
            strokeWidth={i === 0 ? 1.8 : 1.5}
          />
          <text
            x={step.x + step.w / 2}
            y={step.y + 14}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="600"
            fill={i === 0 ? 'var(--color-accent)' : 'var(--color-text-primary)'}
          >
            {step.label}
          </text>
          <text
            x={step.x + step.w / 2}
            y={step.y + 27}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="var(--color-text-tertiary)"
          >
            {step.sublabel}
          </text>
        </motion.g>
      ))}

      {/* ======================== */}
      {/* Arrows between steps     */}
      {/* ======================== */}
      {stepArrows.map((arrow, i) => (
        <motion.line
          key={`arrow-${i}`}
          x1={arrow.x1}
          y1={85}
          x2={arrow.x2}
          y2={85}
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          markerEnd="url(#arrowhead-gradient-tape)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.55 + i * 0.12, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* Operation labels on arrows */}
      {['square', 'add c'].map((label, i) => (
        <motion.text
          key={`op-${i}`}
          x={stepArrows[i].x1 + (stepArrows[i].x2 - stepArrows[i].x1) / 2}
          y={78}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : {}}
          transition={{ duration: 0.3, delay: 0.65 + i * 0.12, ease: PRODUCTIVE_EASE }}
        >
          {label}
        </motion.text>
      ))}

      {/* ======================== */}
      {/* Tape records annotation  */}
      {/* ======================== */}
      <motion.text
        x="228"
        y="140"
        textAnchor="middle"
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.85 } : {}}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        Tape records operations on watched variables
      </motion.text>

      {/* ======================== */}
      {/* Gradient call section    */}
      {/* ======================== */}

      {/* Downward arrow from tape to gradient call */}
      <motion.path
        d="M 250 124 L 250 160 L 170 160 L 170 172"
        fill="none"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.8"
        markerEnd="url(#arrowhead-gradient-tape-out)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.15, ease: PRODUCTIVE_EASE }}
      />

      {/* "Compute gradient" label on the arrow */}
      <motion.text
        x="262"
        y="157"
        fontSize="9"
        fontWeight="500"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.9 } : {}}
        transition={{ duration: 0.4, delay: 1.35, ease: PRODUCTIVE_EASE }}
      >
        Compute gradient
      </motion.text>

      {/* tape.gradient() call box */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="80"
          y="174"
          width="180"
          height="36"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="170"
          y="190"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10.5"
          fontWeight="600"
          fontFamily="var(--font-mono, monospace)"
          fill="var(--color-text-primary)"
        >
          tape.gradient(y, x)
        </text>
        <text
          x="170"
          y="203"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          dy/dx
        </text>
      </motion.g>

      {/* Arrow from gradient call to output */}
      <motion.line
        x1="260"
        y1="192"
        x2="318"
        y2="192"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.8"
        markerEnd="url(#arrowhead-gradient-tape-out)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.65, ease: PRODUCTIVE_EASE }}
      />

      {/* Gradient output value box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Glow behind output */}
        <rect
          x="320"
          y="176"
          width="100"
          height="32"
          rx="6"
          fill="var(--color-accent)"
          opacity="0.08"
        />
        <rect
          x="320"
          y="176"
          width="100"
          height="32"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="370"
          y="189"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          2x = 6.0
        </text>
        <text
          x="370"
          y="202"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          gradient value
        </text>
      </motion.g>

      {/* ======================== */}
      {/* Context note: x = 3.0   */}
      {/* ======================== */}
      <motion.text
        x="470"
        y="192"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        x = 3.0
      </motion.text>
    </svg>
  )
}
