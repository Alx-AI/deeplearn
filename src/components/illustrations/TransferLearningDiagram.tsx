'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TransferLearningDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TransferLearningDiagram({ className }: TransferLearningDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 200"
      role="img"
      aria-label="Transfer learning diagram showing pretrained ImageNet model with frozen base layers and new custom classifier layers"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Pretrained ImageNet Model */}
      <g>
        {/* Model container */}
        <motion.rect
          x="10"
          y="30"
          width="120"
          height="140"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <motion.text
          x="70"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          ImageNet Model
        </motion.text>

        {/* Stacked layers - getting progressively smaller */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const width = 100 - i * 8
          const height = 12
          const x = 20 + i * 4
          const y = 45 + i * 18

          return (
            <motion.rect
              key={i}
              x={x}
              y={y}
              width={width}
              height={height}
              rx="3"
              fill={i < 3 ? 'var(--color-bg-tertiary)' : 'var(--color-text-tertiary)'}
              stroke={i < 3 ? 'var(--color-border-primary)' : 'var(--color-text-secondary)'}
              strokeWidth="1"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: PRODUCTIVE_EASE }}
            />
          )
        })}

        {/* Layer labels */}
        <motion.text
          x="75"
          y="155"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: PRODUCTIVE_EASE }}
        >
          Pretrained Layers
        </motion.text>
      </g>

      {/* Arrow and Cut Line */}
      <g>
        {/* Arrow from pretrained to your task */}
        <motion.path
          d="M 140 100 L 190 100"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0, ease: PRODUCTIVE_EASE }}
        />

        {/* Scissor/cut symbol */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          {/* Scissor icon */}
          <circle cx="165" cy="95" r="10" fill="var(--color-bg-elevated)" stroke="var(--color-accent)" strokeWidth="2" />
          <path
            d="M 162 92 L 168 98 M 162 98 L 168 92"
            stroke="var(--color-accent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* "Freeze" label */}
        <motion.text
          x="165"
          y="85"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
        >
          Freeze
        </motion.text>
      </g>

      {/* Your Task - Modified Model */}
      <g>
        {/* Model container */}
        <motion.rect
          x="200"
          y="30"
          width="280"
          height="140"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <motion.text
          x="340"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          Your Task
        </motion.text>

        {/* Frozen base layers (grayed out) */}
        <g>
          {[0, 1, 2, 3].map((i) => {
            const width = 100
            const height = 12
            const x = 215
            const y = 45 + i * 18

            return (
              <motion.rect
                key={`frozen-${i}`}
                x={x}
                y={y}
                width={width}
                height={height}
                rx="3"
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border-primary)"
                strokeWidth="1"
                opacity="0.4"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 0.4, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.5 + i * 0.1, ease: PRODUCTIVE_EASE }}
              />
            )
          })}

          {/* Lock icon */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 0.5, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.9, ease: PRODUCTIVE_EASE }}
          >
            <rect x="323" y="60" width="10" height="12" rx="2" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" />
            <path d="M 325 60 V 56 a 3 3 0 0 1 6 0 v 4" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" />
          </motion.g>

          {/* Frozen label */}
          <motion.text
            x="265"
            y="132"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.0, ease: PRODUCTIVE_EASE }}
          >
            Pretrained Base (frozen)
          </motion.text>
        </g>

        {/* Dashed cut line between sections */}
        <motion.line
          x1="210"
          y1="120"
          x2="475"
          y2="120"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
          transition={{ duration: 0.8, delay: 2.1, ease: PRODUCTIVE_EASE }}
        />

        {/* New classifier layers (accent colored) */}
        <g>
          {[0, 1].map((i) => {
            const width = 120
            const height = 14
            const x = 350
            const y = 45 + i * 20

            return (
              <motion.rect
                key={`new-${i}`}
                x={x}
                y={y}
                width={width}
                height={height}
                rx="4"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.2 + i * 0.15, ease: PRODUCTIVE_EASE }}
              />
            )
          })}

          {/* New classifier label */}
          <motion.text
            x="410"
            y="98"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="10"
            fontWeight="600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.5, ease: PRODUCTIVE_EASE }}
          >
            New Classifier
          </motion.text>

          <motion.text
            x="410"
            y="110"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.6, ease: PRODUCTIVE_EASE }}
          >
            (trainable)
          </motion.text>
        </g>
      </g>

      {/* Bottom flow indicators */}
      <g>
        {/* Input */}
        <motion.text
          x="70"
          y="190"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.7, ease: PRODUCTIVE_EASE }}
        >
          ImageNet
        </motion.text>

        {/* Process arrow */}
        <motion.path
          d="M 130 185 L 200 185"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-transfer-learning)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ duration: 0.8, delay: 2.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Output */}
        <motion.text
          x="340"
          y="190"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.9, ease: PRODUCTIVE_EASE }}
        >
          Your Custom Task
        </motion.text>
      </g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-transfer-learning"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-tertiary)"
            opacity="0.6"
          />
        </marker>
      </defs>
    </svg>
  )
}
