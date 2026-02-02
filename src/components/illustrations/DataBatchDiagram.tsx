'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface DataBatchDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function DataBatchDiagram({ className }: DataBatchDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 200"
      role="img"
      aria-label="Diagram showing how individual data samples are organized into batches for training"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Left side: Stack of individual data samples */}
      <g>
        <text
          x="60"
          y="20"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
          textAnchor="middle"
        >
          Data Samples
        </text>

        {/* Individual data samples - thin rectangles stacked */}
        {[...Array(10)].map((_, i) => (
          <motion.rect
            key={i}
            x="30"
            y={35 + i * 14}
            width="60"
            height="12"
            rx="2"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{
              duration: 0.5,
              delay: i * 0.05,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Sample count label */}
        <motion.text
          x="60"
          y="190"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
        >
          (n samples)
        </motion.text>
      </g>

      {/* Arrow and label */}
      <g>
        <motion.path
          d="M 110 100 L 180 100"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-data-batch)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: PRODUCTIVE_EASE }}
        />

        <motion.text
          x="145"
          y="90"
          fontSize="10"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          split into
        </motion.text>
        <motion.text
          x="145"
          y="116"
          fontSize="10"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          batches
        </motion.text>
      </g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-data-batch"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Right side: Batches */}
      <g>
        <text
          x="340"
          y="20"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
          textAnchor="middle"
        >
          Batches
        </text>

        {/* Batch 1 */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          {/* Background highlight */}
          <rect
            x="195"
            y="38"
            width="70"
            height="48"
            rx="4"
            fill="var(--color-accent-subtle)"
            opacity="0.3"
          />

          {/* Stacked rectangles with offset for depth */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={i}
              x={200 + i * 2}
              y={42 + i * 10}
              width="55"
              height="10"
              rx="1.5"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
          ))}

          <text
            x="230"
            y="100"
            fontSize="10"
            fontWeight="500"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
          >
            Batch 1
          </text>
        </motion.g>

        {/* Batch 2 with batch_size callout */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          {/* Background highlight */}
          <rect
            x="285"
            y="38"
            width="70"
            height="48"
            rx="4"
            fill="var(--color-accent-subtle)"
            opacity="0.3"
          />

          {/* Stacked rectangles */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={i}
              x={290 + i * 2}
              y={42 + i * 10}
              width="55"
              height="10"
              rx="1.5"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
          ))}

          <text
            x="320"
            y="100"
            fontSize="10"
            fontWeight="500"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
          >
            Batch 2
          </text>

          {/* batch_size callout */}
          <rect
            x="365"
            y="50"
            width="90"
            height="22"
            rx="3"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text
            x="410"
            y="64"
            fontSize="11"
            fontWeight="600"
            fill="var(--color-accent)"
            textAnchor="middle"
          >
            batch_size = 32
          </text>

          {/* Callout line */}
          <path
            d="M 355 60 L 365 60"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
        </motion.g>

        {/* Batch 3 */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Background highlight */}
          <rect
            x="195"
            y="120"
            width="70"
            height="48"
            rx="4"
            fill="var(--color-accent-subtle)"
            opacity="0.3"
          />

          {/* Stacked rectangles */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={i}
              x={200 + i * 2}
              y={124 + i * 10}
              width="55"
              height="10"
              rx="1.5"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
          ))}

          <text
            x="230"
            y="182"
            fontSize="10"
            fontWeight="500"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
          >
            Batch 3
          </text>
        </motion.g>

        {/* Ellipsis to show more batches */}
        <motion.text
          x="340"
          y="145"
          fontSize="18"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
        >
          ...
        </motion.text>
      </g>
    </svg>
  )
}
