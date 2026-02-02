'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TFvsPyTorchDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TFvsPyTorchDiagram({ className = '' }: TFvsPyTorchDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const rows = [
    { label: 'Graph', tf: 'Static graph (tf.function)', pytorch: 'Dynamic graph (eager)' },
    { label: 'Gradients', tf: 'GradientTape', pytorch: 'backward()' },
    { label: 'Style', tf: 'Functional + OOP', pytorch: 'Pythonic OOP' },
    { label: 'Deploy', tf: 'TF Serving, TF Lite', pytorch: 'TorchServe, ONNX' }
  ]

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 480 220"
        role="img"
        aria-label="TensorFlow vs PyTorch framework comparison showing differences in graph execution, gradients, coding style, and deployment"
        style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
      >
        <defs>
          <filter id="tfpytorch-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="480" height="220" fill="var(--color-bg-elevated)" rx="8" />

        {/* VS Badge */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
        >
          <circle
            cx="240"
            cy="30"
            r="20"
            fill="var(--color-accent)"
            filter="url(#tfpytorch-glow)"
          />
          <text
            x="240"
            y="30"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="700"
            fill="var(--color-bg-primary)"
          >
            VS
          </text>
        </motion.g>

        {/* Center divider line */}
        <line
          x1="240"
          y1="60"
          x2="240"
          y2="200"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
          strokeDasharray="4,4"
          opacity="0.4"
        />

        {/* Column Headers */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          {/* TensorFlow header */}
          <rect
            x="20"
            y="60"
            width="200"
            height="30"
            fill="var(--color-bg-tertiary)"
            rx="4"
          />
          <text
            x="120"
            y="75"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="700"
            fill="var(--color-text-primary)"
          >
            TensorFlow
          </text>

          {/* PyTorch header */}
          <rect
            x="260"
            y="60"
            width="200"
            height="30"
            fill="var(--color-bg-tertiary)"
            rx="4"
          />
          <text
            x="360"
            y="75"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="14"
            fontWeight="700"
            fill="var(--color-text-primary)"
          >
            PyTorch
          </text>
        </motion.g>

        {/* Comparison Rows */}
        {rows.map((row, index) => (
          <motion.g
            key={row.label}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.4 + index * 0.1,
              ease: PRODUCTIVE_EASE
            }}
          >
            {/* Row background */}
            <rect
              x="20"
              y={100 + index * 30}
              width="440"
              height="28"
              fill={index % 2 === 0 ? 'var(--color-bg-elevated)' : 'var(--color-accent-subtle)'}
              opacity={index % 2 === 0 ? 0.3 : 0.15}
              rx="2"
            />

            {/* Row separator */}
            {index > 0 && (
              <line
                x1="20"
                y1={100 + index * 30}
                x2="460"
                y2={100 + index * 30}
                stroke="var(--color-border-primary)"
                strokeWidth="1"
                opacity="0.2"
              />
            )}

            {/* TensorFlow content */}
            <text
              x="30"
              y={114 + index * 30}
              dominantBaseline="central"
              fontSize="10"
              fontWeight="600"
              fill="var(--color-text-secondary)"
            >
              {row.label}:
            </text>
            <text
              x="150"
              y={114 + index * 30}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="var(--color-text-primary)"
            >
              {row.tf}
            </text>

            {/* PyTorch content */}
            <text
              x="360"
              y={114 + index * 30}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="11"
              fill="var(--color-text-primary)"
            >
              {row.pytorch}
            </text>
          </motion.g>
        ))}

        {/* Bottom note */}
        <motion.text
          x="240"
          y="205"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          Both frameworks are production-ready with strong ecosystems
        </motion.text>
      </svg>
    </div>
  )
}
