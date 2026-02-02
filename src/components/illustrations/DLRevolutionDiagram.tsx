'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface DLRevolutionDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function DLRevolutionDiagram({ className }: DLRevolutionDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const rows = [
    {
      id: 'vision',
      icon: (
        // Eye icon
        <>
          <circle cx="14" cy="14" r="8" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="3" fill="var(--color-text-secondary)" />
        </>
      ),
      before: 'Hand-crafted features',
      after: 'End-to-end learning',
      y: 40,
    },
    {
      id: 'speech',
      icon: (
        // Waveform icon
        <>
          <path d="M8 14 L10 10 L12 16 L14 8 L16 18 L18 12 L20 14" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
      before: 'Rule-based',
      after: 'Neural speech recognition',
      y: 92,
    },
    {
      id: 'translation',
      icon: (
        // Globe icon
        <>
          <circle cx="14" cy="14" r="8" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
          <path d="M14 6 Q10 14 14 22 M14 6 Q18 14 14 22 M6 14 L22 14" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
        </>
      ),
      before: 'Phrase-based',
      after: 'Neural machine translation',
      y: 144,
    },
    {
      id: 'generation',
      icon: (
        // Sparkle icon
        <>
          <path d="M14 6 L15 12 L21 14 L15 16 L14 22 L13 16 L7 14 L13 12 Z" fill="var(--color-text-secondary)" />
        </>
      ),
      before: 'Templates',
      after: 'Creative generation',
      y: 196,
    },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 240"
      role="img"
      aria-label="Comparison of traditional machine learning versus deep learning approaches across vision, speech, translation, and generation tasks"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Column headers */}
      <motion.text
        x="120"
        y="20"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Traditional
      </motion.text>
      <motion.text
        x="360"
        y="20"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.1 }}
      >
        Deep Learning
      </motion.text>

      {/* Capability rows */}
      {rows.map((row, index) => (
        <g key={row.id}>
          {/* Icon */}
          <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.2 + index * 0.1 }}
          >
            <g transform={`translate(20, ${row.y - 14})`}>
              {row.icon}
            </g>
          </motion.g>

          {/* Before approach */}
          <motion.g
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.3 + index * 0.1 }}
          >
            <rect
              x="50"
              y={row.y - 16}
              width="140"
              height="32"
              rx="4"
              fill="var(--color-bg-tertiary)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
            />
            <text
              x="120"
              y={row.y + 4}
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-text-primary)"
            >
              {row.before}
            </text>
          </motion.g>

          {/* Arrow */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.4 + index * 0.1 }}
          >
            <motion.path
              d={`M200 ${row.y} L280 ${row.y}`}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.5 + index * 0.1 }}
            />
            <motion.path
              d={`M280 ${row.y} L275 ${row.y - 4} M280 ${row.y} L275 ${row.y + 4}`}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.3, ease: PRODUCTIVE_EASE, delay: 0.8 + index * 0.1 }}
            />
          </motion.g>

          {/* After approach */}
          <motion.g
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.4 + index * 0.1 }}
          >
            <rect
              x="290"
              y={row.y - 16}
              width="170"
              height="32"
              rx="4"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <text
              x="375"
              y={row.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="var(--color-accent)"
            >
              {row.after}
            </text>
          </motion.g>
        </g>
      ))}

      {/* Bottom accent line */}
      <motion.line
        x1="50"
        y1="228"
        x2="460"
        y2="228"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.8 }}
      />
    </svg>
  )
}
