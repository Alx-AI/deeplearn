'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface CallbacksDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function CallbacksDiagram({ className = '' }: CallbacksDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 260"
      className={className}
      role="img"
      aria-label="Diagram showing how callbacks hook into the training loop at different stages"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Training Loop - Circular flow */}
      <g>
        {/* Train step */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.1 }}
        >
          <rect
            x="140"
            y="20"
            width="120"
            height="50"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />
          <text
            x="200"
            y="50"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="14"
            fontWeight="600"
          >
            Train Batch
          </text>
        </motion.g>

        {/* Evaluate step */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.2 }}
        >
          <rect
            x="280"
            y="100"
            width="100"
            height="50"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />
          <text
            x="330"
            y="130"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="14"
            fontWeight="600"
          >
            Evaluate
          </text>
        </motion.g>

        {/* Check callbacks step */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.3 }}
        >
          <rect
            x="140"
            y="190"
            width="120"
            height="50"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />
          <text
            x="200"
            y="215"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="12.5"
            fontWeight="600"
          >
            Check Callbacks
          </text>
        </motion.g>

        {/* Next epoch step */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.4 }}
        >
          <rect
            x="20"
            y="100"
            width="100"
            height="50"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />
          <text
            x="70"
            y="130"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="14"
            fontWeight="600"
          >
            Next Epoch
          </text>
        </motion.g>

        {/* Connecting arrows */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.5 }}
        >
          {/* Train to Evaluate */}
          <path
            d="M 260 45 L 280 45 Q 290 45 290 55 L 290 100"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-callbacks)"
          />

          {/* Evaluate to Check */}
          <path
            d="M 330 150 L 330 170 Q 330 180 320 180 L 260 180 L 260 190"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-callbacks)"
          />

          {/* Check to Next */}
          <path
            d="M 140 215 L 120 215 Q 110 215 110 205 L 110 125 L 120 125"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-callbacks)"
          />

          {/* Next to Train */}
          <path
            d="M 70 100 L 70 80 Q 70 70 80 70 L 140 70 L 140 70"
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-callbacks)"
          />
        </motion.g>
      </g>

      {/* Callback 1: EarlyStopping */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      >
        {/* Connecting line */}
        <line
          x1="340"
          y1="195"
          x2="260"
          y2="210"
          stroke="var(--color-accent-subtle)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />

        {/* Badge */}
        <g>
          <rect
            x="340"
            y="180"
            width="50"
            height="30"
            rx="6"
            fill="var(--color-accent)"
            opacity="0.15"
          />
          <rect
            x="340"
            y="180"
            width="50"
            height="30"
            rx="6"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />

          {/* Pin icon */}
          <circle
            cx="350"
            cy="195"
            r="3"
            fill="var(--color-accent)"
          />
          <line
            x1="350"
            y1="195"
            x2="348"
            y2="200"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <text
            x="358"
            y="198"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Early
          </text>
        </g>
      </motion.g>

      {/* Callback 2: ModelCheckpoint */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.85 }}
      >
        {/* Connecting line */}
        <line
          x1="160"
          y1="165"
          x2="185"
          y2="190"
          stroke="var(--color-accent-subtle)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />

        {/* Badge */}
        <g>
          <rect
            x="100"
            y="150"
            width="60"
            height="30"
            rx="6"
            fill="var(--color-accent)"
            opacity="0.15"
          />
          <rect
            x="100"
            y="150"
            width="60"
            height="30"
            rx="6"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />

          {/* Pin icon */}
          <circle
            cx="110"
            cy="165"
            r="3"
            fill="var(--color-accent)"
          />
          <line
            x1="110"
            y1="165"
            x2="108"
            y2="170"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <text
            x="118"
            y="168"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            Save
          </text>
        </g>
      </motion.g>

      {/* Callback 3: ReduceLROnPlateau */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 1.0 }}
      >
        {/* Connecting line */}
        <line
          x1="30"
          y1="75"
          x2="60"
          y2="100"
          stroke="var(--color-accent-subtle)"
          strokeWidth="1.5"
          strokeDasharray="3,3"
        />

        {/* Badge */}
        <g>
          <rect
            x="10"
            y="60"
            width="50"
            height="30"
            rx="6"
            fill="var(--color-accent)"
            opacity="0.15"
          />
          <rect
            x="10"
            y="60"
            width="50"
            height="30"
            rx="6"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />

          {/* Pin icon */}
          <circle
            cx="20"
            cy="75"
            r="3"
            fill="var(--color-accent)"
          />
          <line
            x1="20"
            y1="75"
            x2="18"
            y2="80"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          <text
            x="28"
            y="78"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            LR↓
          </text>
        </g>
      </motion.g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-callbacks"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>
    </svg>
  )
}
