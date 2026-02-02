'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RNNUnrolledDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function RNNUnrolledDiagram({ className }: RNNUnrolledDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 220"
      className={className}
      role="img"
      aria-label="RNN unrolled through time showing sequential processing with hidden state flow"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrowhead for hidden state arrows */}
        <marker
          id="arrowhead-hidden"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 8 4, 0 8"
            fill="var(--color-accent)"
          />
        </marker>

        {/* Arrowhead for input/output arrows */}
        <marker
          id="arrowhead-io"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* Time axis arrow at bottom */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="40"
          y1="195"
          x2="460"
          y2="195"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-io)"
        />
        <text
          x="470"
          y="198"
          fill="var(--color-text-tertiary)"
          fontSize="12"
          fontStyle="italic"
        >
          time
        </text>
      </motion.g>

      {/* RNN cells at time steps t1, t2, t3, t4 */}
      {[0, 1, 2, 3].map((i) => {
        const x = 50 + i * 110
        const y = 85
        const delay = i * 0.15

        return (
          <motion.g
            key={`cell-${i}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
          >
            {/* RNN cell box */}
            <rect
              x={x}
              y={y}
              width="60"
              height="45"
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="2"
            />
            <text
              x={x + 30}
              y={y + 28}
              fill="var(--color-text-primary)"
              fontSize="16"
              fontWeight="600"
              textAnchor="middle"
            >
              RNN
            </text>

            {/* Time step label below */}
            <text
              x={x + 30}
              y={185}
              fill="var(--color-text-secondary)"
              fontSize="14"
              textAnchor="middle"
            >
              t
              <tspan fontSize="10" baselineShift="sub">{i + 1}</tspan>
            </text>

            {/* Input arrow from below (x_i) */}
            <motion.g
              initial={{ opacity: 0, pathLength: 0 }}
              animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + delay, ease: PRODUCTIVE_EASE }}
            >
              <line
                x1={x + 30}
                y1={165}
                x2={x + 30}
                y2={135}
                stroke="var(--color-text-secondary)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead-io)"
              />
              <text
                x={x + 30}
                y={177}
                fill="var(--color-text-secondary)"
                fontSize="13"
                textAnchor="middle"
              >
                x
                <tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
              </text>
            </motion.g>

            {/* Output arrow going up (h_i) */}
            <motion.g
              initial={{ opacity: 0, pathLength: 0 }}
              animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + delay, ease: PRODUCTIVE_EASE }}
            >
              <line
                x1={x + 30}
                y1={80}
                x2={x + 30}
                y2={50}
                stroke="var(--color-text-secondary)"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead-io)"
              />
              <text
                x={x + 30}
                y={42}
                fill="var(--color-text-secondary)"
                fontSize="13"
                textAnchor="middle"
              >
                h
                <tspan fontSize="9" baselineShift="sub">{i + 1}</tspan>
              </text>
            </motion.g>
          </motion.g>
        )
      })}

      {/* Hidden state arrows between cells */}
      {[0, 1, 2].map((i) => {
        const x1 = 110 + i * 110
        const x2 = 160 + i * 110
        const y = 107.5
        const delay = 1.0 + i * 0.15

        return (
          <motion.g
            key={`arrow-${i}`}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
            transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
          >
            <motion.line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              markerEnd="url(#arrowhead-hidden)"
            />
            {/* Hidden state label on first arrow */}
            {i === 1 && (
              <text
                x={(x1 + x2) / 2}
                y={y - 8}
                fill="var(--color-accent)"
                fontSize="11"
                textAnchor="middle"
                fontStyle="italic"
              >
                hidden state
              </text>
            )}
          </motion.g>
        )
      })}
    </svg>
  )
}
