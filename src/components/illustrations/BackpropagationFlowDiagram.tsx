'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BackpropagationFlowDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function BackpropagationFlowDiagram({ className = '' }: BackpropagationFlowDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layer boxes: x, y, width, height, label, sublabel
  const layers = [
    { x: 16, y: 80, w: 64, h: 48, label: 'Input', sublabel: 'x' },
    { x: 118, y: 80, w: 72, h: 48, label: 'Layer 1', sublabel: 'W\u2081, b\u2081' },
    { x: 228, y: 80, w: 72, h: 48, label: 'Layer 2', sublabel: 'W\u2082, b\u2082' },
    { x: 338, y: 80, w: 72, h: 48, label: 'Layer 3', sublabel: 'W\u2083, b\u2083' },
    { x: 448, y: 80, w: 56, h: 48, label: 'Loss', sublabel: 'L' },
  ]

  // Forward arrows between layers (left-to-right)
  const forwardArrows = [
    { x1: 80, x2: 118 },
    { x1: 190, x2: 228 },
    { x1: 300, x2: 338 },
    { x1: 410, x2: 448 },
  ]

  // Backward arrows between layers (right-to-left)
  const backwardArrows = [
    { x1: 448, x2: 410 },
    { x1: 338, x2: 300 },
    { x1: 228, x2: 190 },
    { x1: 118, x2: 80 },
  ]

  // Gradient labels for backward pass at each junction
  const gradientLabels = [
    { x: 429, label: '\u2202L/\u2202a\u2083' },
    { x: 319, label: '\u2202L/\u2202a\u2082' },
    { x: 209, label: '\u2202L/\u2202a\u2081' },
    { x: 99, label: '\u2202L/\u2202x' },
  ]

  // Chain rule multiplication symbols between backward arrows
  const chainRuleMarkers = [
    { x: 429, y: 172 },
    { x: 319, y: 172 },
    { x: 209, y: 172 },
  ]

  const fwdArrowY = 72
  const bwdArrowY = 164

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 260"
      role="img"
      aria-label="Backpropagation flow diagram showing the forward pass computing activations left to right and the backward pass propagating gradients right to left through each layer"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Forward arrow marker (accent color) */}
        <marker
          id="arrowhead-backprop-fwd"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L7,3 z" fill="var(--color-accent)" />
        </marker>

        {/* Backward arrow marker (text-secondary color) */}
        <marker
          id="arrowhead-backprop-bwd"
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
      {/* "Forward Pass" label     */}
      {/* ======================== */}
      <motion.text
        x="260"
        y="24"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        Forward Pass
      </motion.text>

      {/* Small forward arrow icon next to label */}
      <motion.path
        d="M 310 20 L 330 20"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrowhead-backprop-fwd)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
      />

      {/* ======================== */}
      {/* "Backward Pass" label    */}
      {/* ======================== */}
      <motion.text
        x="260"
        y="248"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        Backward Pass
      </motion.text>

      {/* Small backward arrow icon next to label */}
      <motion.path
        d="M 210 244 L 190 244"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrowhead-backprop-bwd)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* ======================== */}
      {/* Separator line           */}
      {/* ======================== */}
      <motion.line
        x1="16"
        y1="138"
        x2="504"
        y2="138"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4,4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.4 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* ======================== */}
      {/* Layer boxes               */}
      {/* ======================== */}
      {layers.map((layer, i) => (
        <motion.g
          key={`layer-${i}`}
          initial={{ opacity: 0, y: -12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: PRODUCTIVE_EASE }}
        >
          {/* Box background */}
          <rect
            x={layer.x}
            y={layer.y}
            width={layer.w}
            height={layer.h}
            rx="6"
            fill="var(--color-bg-elevated)"
            stroke={i === layers.length - 1 ? 'var(--color-accent)' : 'var(--color-border-primary)'}
            strokeWidth={i === layers.length - 1 ? 2 : 1.5}
          />

          {/* Layer label */}
          <text
            x={layer.x + layer.w / 2}
            y={layer.y + 19}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill={i === layers.length - 1 ? 'var(--color-accent)' : 'var(--color-text-primary)'}
          >
            {layer.label}
          </text>

          {/* Layer sublabel */}
          <text
            x={layer.x + layer.w / 2}
            y={layer.y + 34}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-tertiary)"
          >
            {layer.sublabel}
          </text>
        </motion.g>
      ))}

      {/* ======================== */}
      {/* Forward pass arrows       */}
      {/* ======================== */}
      {forwardArrows.map((arrow, i) => (
        <motion.line
          key={`fwd-${i}`}
          x1={arrow.x1}
          y1={fwdArrowY}
          x2={arrow.x2}
          y2={fwdArrowY}
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-backprop-fwd)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.15, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* Forward pass activations labels */}
      {['a\u2080', 'a\u2081', 'a\u2082', 'a\u2083'].map((label, i) => (
        <motion.text
          key={`fwd-label-${i}`}
          x={forwardArrows[i].x1 + (forwardArrows[i].x2 - forwardArrows[i].x1) / 2}
          y={fwdArrowY - 8}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-accent)"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : {}}
          transition={{ duration: 0.3, delay: 0.3 + i * 0.15, ease: PRODUCTIVE_EASE }}
        >
          {label}
        </motion.text>
      ))}

      {/* ======================== */}
      {/* Mirror layer boxes below  */}
      {/* (backward pass context)   */}
      {/* ======================== */}
      {layers.map((layer, i) => (
        <motion.g
          key={`layer-bwd-${i}`}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9 + i * 0.1, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={layer.x}
            y={layer.y + 72}
            width={layer.w}
            height={layer.h}
            rx="6"
            fill="var(--color-bg-tertiary)"
            stroke={i === layers.length - 1 ? 'var(--color-text-secondary)' : 'var(--color-border-primary)'}
            strokeWidth={i === layers.length - 1 ? 2 : 1.5}
            opacity="0.7"
          />

          <text
            x={layer.x + layer.w / 2}
            y={layer.y + 72 + 19}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill={i === layers.length - 1 ? 'var(--color-text-secondary)' : 'var(--color-text-primary)'}
            opacity="0.8"
          >
            {layer.label}
          </text>

          <text
            x={layer.x + layer.w / 2}
            y={layer.y + 72 + 34}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-tertiary)"
            opacity="0.7"
          >
            {layer.sublabel}
          </text>
        </motion.g>
      ))}

      {/* ======================== */}
      {/* Backward pass arrows      */}
      {/* ======================== */}
      {backwardArrows.map((arrow, i) => (
        <motion.line
          key={`bwd-${i}`}
          x1={arrow.x1}
          y1={bwdArrowY}
          x2={arrow.x2}
          y2={bwdArrowY}
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-backprop-bwd)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.0 + i * 0.15, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* Gradient labels along backward arrows */}
      {gradientLabels.map((gl, i) => (
        <motion.text
          key={`grad-${i}`}
          x={gl.x}
          y={bwdArrowY - 8}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.85 } : {}}
          transition={{ duration: 0.3, delay: 1.1 + i * 0.15, ease: PRODUCTIVE_EASE }}
        >
          {gl.label}
        </motion.text>
      ))}

      {/* ======================== */}
      {/* Chain rule markers        */}
      {/* ======================== */}
      {chainRuleMarkers.map((marker, i) => (
        <motion.g
          key={`chain-${i}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.2 + i * 0.15, ease: PRODUCTIVE_EASE }}
        >
          {/* Multiplication circle */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r="7"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-text-secondary)"
            strokeWidth="1"
          />
          {/* Cross symbol for multiplication */}
          <text
            x={marker.x}
            y={marker.y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="600"
            fill="var(--color-text-secondary)"
          >
            {'\u00D7'}
          </text>
        </motion.g>
      ))}

      {/* Chain rule annotation */}
      <motion.text
        x="430"
        y="198"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        chain rule
      </motion.text>

      {/* Weight gradient annotations inside backward-pass layer boxes */}
      {[
        { x: 154, label: '\u2202L/\u2202W\u2081' },
        { x: 264, label: '\u2202L/\u2202W\u2082' },
        { x: 374, label: '\u2202L/\u2202W\u2083' },
      ].map((wg, i) => (
        <motion.g
          key={`wgrad-${i}`}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: 1.3 + i * 0.1, ease: PRODUCTIVE_EASE }}
        >
          {/* Small downward arrow from backward arrow into the layer box */}
          <line
            x1={wg.x}
            y1={bwdArrowY + 4}
            x2={wg.x}
            y2={bwdArrowY + 14}
            stroke="var(--color-text-secondary)"
            strokeWidth="1"
            opacity="0.5"
          />
          <text
            x={wg.x}
            y={bwdArrowY + 24}
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-secondary)"
            fontStyle="italic"
            opacity="0.8"
          >
            {wg.label}
          </text>
        </motion.g>
      ))}
    </svg>
  )
}
