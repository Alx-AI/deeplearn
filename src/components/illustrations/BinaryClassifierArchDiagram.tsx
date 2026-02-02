'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BinaryClassifierArchDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function BinaryClassifierArchDiagram({
  className = '',
}: BinaryClassifierArchDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layer definitions: x, width, height, label, sublabel, annotation
  const layers = [
    {
      id: 'input',
      x: 18,
      width: 90,
      height: 40,
      label: 'Input (10,000)',
      sublabel: null,
      annotation: 'Multi-hot vector',
    },
    {
      id: 'hidden1',
      x: 148,
      width: 80,
      height: 40,
      label: 'Dense(16, relu)',
      sublabel: null,
      annotation: 'Extract features',
    },
    {
      id: 'hidden2',
      x: 268,
      width: 80,
      height: 40,
      label: 'Dense(16, relu)',
      sublabel: null,
      annotation: 'Extract features',
    },
    {
      id: 'output',
      x: 388,
      width: 80,
      height: 40,
      label: 'Dense(1, sigmoid)',
      sublabel: null,
      annotation: 'Binary probability [0, 1]',
    },
  ]

  // Arrow segments between layers
  const arrows = [
    { x1: 108, x2: 148 },
    { x1: 228, x2: 268 },
    { x1: 348, x2: 388 },
    { x1: 468, x2: 490 },
  ]

  const centerY = 88

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 520 200"
        role="img"
        aria-label="Architecture diagram of a 3-layer binary classifier neural network for IMDb sentiment analysis"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-binary-clf"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path
              d="M1 1 L6 3.5 L1 6"
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* Title */}
        <motion.text
          x="260"
          y="24"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-text-primary)"
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-sans)' }}
          initial={{ opacity: 0, y: -8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: 0,
            ease: PRODUCTIVE_EASE,
          }}
        >
          3-Layer Binary Classifier
        </motion.text>

        {/* Thin separator line below title */}
        <motion.line
          x1="180"
          y1="32"
          x2="340"
          y2="32"
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{
            duration: 0.3,
            delay: 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        />

        {/* Arrows between layers */}
        {arrows.map((arrow, index) => (
          <motion.line
            key={`arrow-${index}`}
            x1={arrow.x1}
            y1={centerY}
            x2={arrow.x2}
            y2={centerY}
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-binary-clf)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.3 + index * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Layer boxes */}
        {layers.map((layer, index) => (
          <motion.g
            key={layer.id}
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.15 + index * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Box */}
            <rect
              x={layer.x}
              y={centerY - layer.height / 2}
              width={layer.width}
              height={layer.height}
              rx="6"
              fill="var(--color-bg-elevated)"
              stroke={
                layer.id === 'output'
                  ? 'var(--color-accent)'
                  : 'var(--color-border-primary)'
              }
              strokeWidth={layer.id === 'output' ? '1.5' : '1'}
            />

            {/* Layer label */}
            <text
              x={layer.x + layer.width / 2}
              y={centerY + 1}
              fontSize={layer.id === 'input' ? '9.5' : '9'}
              fontWeight="500"
              fill="var(--color-text-primary)"
              textAnchor="middle"
              dominantBaseline="central"
              style={{ fontFamily: 'var(--font-mono, var(--font-sans))' }}
            >
              {layer.label}
            </text>

            {/* Annotation below */}
            <text
              x={layer.x + layer.width / 2}
              y={centerY + layer.height / 2 + 16}
              fontSize="9"
              fill="var(--color-text-tertiary)"
              textAnchor="middle"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {layer.annotation}
            </text>
          </motion.g>
        ))}

        {/* Output probability value */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            duration: 0.5,
            delay: 1.1,
            ease: PRODUCTIVE_EASE,
          }}
        >
          <text
            x="498"
            y={centerY - 6}
            fontSize="16"
            fontWeight="600"
            fill="var(--color-accent)"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontFamily: 'var(--font-mono, var(--font-sans))' }}
          >
            p
          </text>
          <text
            x="498"
            y={centerY + 12}
            fontSize="13"
            fontWeight="500"
            fill="var(--color-accent)"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontFamily: 'var(--font-mono, var(--font-sans))' }}
          >
            0.87
          </text>
          <text
            x="498"
            y={centerY + 30}
            fontSize="9"
            fill="var(--color-text-tertiary)"
            textAnchor="middle"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            Positive
          </text>
        </motion.g>

        {/* Flow direction indicator */}
        <motion.text
          x="260"
          y="186"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-sans)' }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : {}}
          transition={{
            duration: 0.3,
            delay: 1.3,
            ease: PRODUCTIVE_EASE,
          }}
        >
          IMDb review input → sentiment probability
        </motion.text>
      </svg>
    </div>
  )
}
