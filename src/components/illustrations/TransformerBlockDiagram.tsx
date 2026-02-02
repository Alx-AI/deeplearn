'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TransformerBlockDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TransformerBlockDiagram({ className }: TransformerBlockDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <svg
      ref={ref}
      viewBox="0 0 340 320"
      className={className}
      role="img"
      aria-label="Transformer encoder block diagram showing multi-head attention and feed-forward layers with residual connections"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-transformer"
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
        <marker
          id="arrowhead-flow"
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

      {/* Input label and arrow */}
      <motion.text
        x="170"
        y="305"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Input
      </motion.text>

      <motion.line
        x1="170"
        y1="290"
        x2="170"
        y2="268"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-flow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      />


      {/* Multi-Head Attention Block */}
      <motion.rect
        x="70"
        y="230"
        width="200"
        height="38"
        rx="6"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="170"
        y="254"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        Multi-Head Attention
      </motion.text>

      {/* First Add & Norm */}
      <motion.line
        x1="170"
        y1="230"
        x2="170"
        y2="198"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-flow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      <motion.rect
        x="95"
        y="170"
        width="150"
        height="28"
        rx="4"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="170"
        y="189"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Add &amp; Norm
      </motion.text>

      {/* Feed-Forward Network Block */}
      <motion.line
        x1="170"
        y1="170"
        x2="170"
        y2="138"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-flow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
      />

      <motion.rect
        x="70"
        y="100"
        width="200"
        height="38"
        rx="6"
        fill="var(--color-bg-tertiary)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="170"
        y="124"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        Feed-Forward Network
      </motion.text>

      {/* Second Add & Norm */}
      <motion.line
        x1="170"
        y1="100"
        x2="170"
        y2="68"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-flow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      <motion.rect
        x="95"
        y="40"
        width="150"
        height="28"
        rx="4"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="170"
        y="59"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Add &amp; Norm
      </motion.text>

      {/* Output */}
      <motion.line
        x1="170"
        y1="40"
        x2="170"
        y2="18"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-flow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="170"
        y="13"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Output
      </motion.text>

      {/* First Skip Connection (around Multi-Head Attention) */}
      <motion.path
        d="M 280 268 Q 300 249, 300 184 Q 300 184, 280 184"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-transformer)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.5, ease: PRODUCTIVE_EASE }}
      />

      {/* First Add circle */}
      <motion.circle
        cx="260"
        cy="184"
        r="8"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="260"
        y="188"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="12"
        fontWeight="700"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.7, ease: PRODUCTIVE_EASE }}
      >
        +
      </motion.text>

      {/* Second Skip Connection (around Feed-Forward) */}
      <motion.path
        d="M 280 138 Q 300 119, 300 54 Q 300 54, 280 54"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-transformer)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.8, ease: PRODUCTIVE_EASE }}
      />

      {/* Second Add circle */}
      <motion.circle
        cx="260"
        cy="54"
        r="8"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.9, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x="260"
        y="58"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="12"
        fontWeight="700"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        +
      </motion.text>
    </svg>
  )
}
