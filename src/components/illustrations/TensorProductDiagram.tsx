'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface TensorProductDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function TensorProductDiagram({ className }: TensorProductDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const matAX = 20
  const matWX = 188
  const matOutX = 370
  const matY = 60

  // Matrix dimensions (visual)
  const matAW = 100 // Input width  (represents 784)
  const matAH = 50  // Input height (represents batch_size)
  const matWW = 72  // Weight width  (represents 512)
  const matWH = 100 // Weight height (represents 784)
  const matOutW = 72 // Output width  (represents 512)
  const matOutH = 50 // Output height (represents batch_size)

  return (
    <svg
      ref={ref}
      viewBox="-10 0 510 240"
      role="img"
      aria-label="Matrix multiplication diagram showing input (batch_size x 784) times weights (784 x 512) equals output (batch_size x 512)"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrow-tensor-product"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* ── Input Matrix (batch_size x 784) ── */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: PRODUCTIVE_EASE, delay: 0 }}
      >
        {/* Matrix body */}
        <rect
          x={matAX}
          y={matY}
          width={matAW}
          height={matAH}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="3"
        />
        {/* Inner grid lines to suggest matrix content */}
        {[1, 2, 3, 4].map((i) => (
          <line
            key={`a-col-${i}`}
            x1={matAX + (matAW / 5) * i}
            y1={matY + 4}
            x2={matAX + (matAW / 5) * i}
            y2={matY + matAH - 4}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        <line
          x1={matAX + 4}
          y1={matY + matAH / 2}
          x2={matAX + matAW - 4}
          y2={matY + matAH / 2}
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* Dots to indicate more values */}
        <text
          x={matAX + matAW / 2}
          y={matY + matAH / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          letterSpacing="2"
        >
          ···
        </text>

        {/* Top dimension label: 784 */}
        <text
          x={matAX + matAW / 2}
          y={matY - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          784
        </text>
        {/* Left dimension label: batch_size */}
        <text
          x={matAX - 5}
          y={matY + matAH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          batch
        </text>

        {/* Matrix name label */}
        <text
          x={matAX + matAW / 2}
          y={matY + matAH + 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Input
        </text>
        <text
          x={matAX + matAW / 2}
          y={matY + matAH + 28}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          (batch_size × 784)
        </text>
      </motion.g>

      {/* ── Multiplication sign ── */}
      <motion.text
        x={matAX + matAW + 18}
        y={matY + matAH / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="18"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.15 }}
      >
        ×
      </motion.text>

      {/* ── Weight Matrix (784 x 512) ── */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      >
        {/* Matrix body */}
        <rect
          x={matWX}
          y={matY - 25}
          width={matWW}
          height={matWH}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="3"
        />
        {/* Inner grid lines */}
        {[1, 2, 3].map((i) => (
          <line
            key={`w-col-${i}`}
            x1={matWX + (matWW / 4) * i}
            y1={matY - 25 + 4}
            x2={matWX + (matWW / 4) * i}
            y2={matY - 25 + matWH - 4}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <line
            key={`w-row-${i}`}
            x1={matWX + 4}
            y1={matY - 25 + (matWH / 5) * i}
            x2={matWX + matWW - 4}
            y2={matY - 25 + (matWH / 5) * i}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.4"
          />
        ))}
        {/* Dots */}
        <text
          x={matWX + matWW / 2}
          y={matY - 25 + matWH / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          letterSpacing="2"
        >
          ···
        </text>

        {/* Left dimension label: 784 */}
        <text
          x={matWX - 6}
          y={matY - 25 + matWH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          784
        </text>
        {/* Top dimension label: 512 */}
        <text
          x={matWX + matWW / 2}
          y={matY - 25 - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          512
        </text>

        {/* Matrix name label */}
        <text
          x={matWX + matWW / 2}
          y={matY + matAH + 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Weights
        </text>
        <text
          x={matWX + matWW / 2}
          y={matY + matAH + 28}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          (784 × 512)
        </text>
      </motion.g>

      {/* ── Shared dimension highlight bracket + connector ── */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: PRODUCTIVE_EASE, delay: 0.4 }}
      >
        {/* Curly bracket / connector from Input's 784 (top) to Weight's 784 (left) */}
        {/* Highlight on Input's top edge representing 784 columns */}
        <rect
          x={matAX}
          y={matY - 3}
          width={matAW}
          height="3"
          fill="var(--color-accent)"
          rx="1.5"
          opacity="0.6"
        />
        {/* Highlight on Weight's left edge representing 784 rows */}
        <rect
          x={matWX - 3}
          y={matY - 25}
          width="3"
          height={matWH}
          fill="var(--color-accent)"
          rx="1.5"
          opacity="0.6"
        />

        {/* Curved arrow connecting the two 784 dimensions */}
        <path
          d={`M ${matAX + matAW / 2} ${matY - 14} C ${matAX + matAW / 2 + 20} ${matY - 40}, ${matWX - 20} ${matY - 40}, ${matWX - 8} ${matY - 25 + matWH / 2 - 10}`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.2"
          strokeDasharray="4,3"
          opacity="0.7"
          markerEnd="url(#arrow-tensor-product)"
        />
      </motion.g>

      {/* ── Equals sign ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      >
        <line
          x1={matWX + matWW + 16}
          y1={matY + matAH / 2 - 4}
          x2={matWX + matWW + 28}
          y2={matY + matAH / 2 - 4}
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
        <line
          x1={matWX + matWW + 16}
          y1={matY + matAH / 2 + 4}
          x2={matWX + matWW + 28}
          y2={matY + matAH / 2 + 4}
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
      </motion.g>

      {/* ── Output Matrix (batch_size x 512) ── */}
      <motion.g
        initial={{ opacity: 0, x: 16 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.55, ease: PRODUCTIVE_EASE, delay: 0.6 }}
      >
        {/* Matrix body */}
        <rect
          x={matOutX}
          y={matY}
          width={matOutW}
          height={matOutH}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          rx="3"
        />
        {/* Inner grid lines */}
        {[1, 2, 3].map((i) => (
          <line
            key={`o-col-${i}`}
            x1={matOutX + (matOutW / 4) * i}
            y1={matY + 4}
            x2={matOutX + (matOutW / 4) * i}
            y2={matY + matOutH - 4}
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            opacity="0.35"
          />
        ))}
        <line
          x1={matOutX + 4}
          y1={matY + matOutH / 2}
          x2={matOutX + matOutW - 4}
          y2={matY + matOutH / 2}
          stroke="var(--color-accent)"
          strokeWidth="0.5"
          opacity="0.35"
        />
        {/* Dots */}
        <text
          x={matOutX + matOutW / 2}
          y={matY + matOutH / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
          letterSpacing="2"
        >
          ···
        </text>

        {/* Top dimension label: 512 */}
        <text
          x={matOutX + matOutW / 2}
          y={matY - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          512
        </text>
        {/* Left dimension label: batch_size */}
        <text
          x={matOutX - 5}
          y={matY + matOutH / 2}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          batch
        </text>

        {/* Matrix name label */}
        <text
          x={matOutX + matOutW / 2}
          y={matY + matOutH + 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Output
        </text>
        <text
          x={matOutX + matOutW / 2}
          y={matY + matOutH + 28}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          (batch_size × 512)
        </text>
      </motion.g>

      {/* ── Dimension matching rule arrows ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.75 }}
      >
        {/* Arrow: Input batch -> Output batch (left sides match) */}
        <line
          x1={matAX}
          y1={matY + matAH + 38}
          x2={matOutX}
          y2={matY + matOutH + 38}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
        <text
          x={(matAX + matOutX) / 2}
          y={matY + matAH + 36}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          rows preserved
        </text>

        {/* Arrow: Weight 512 -> Output 512 (top dimensions match) */}
        <line
          x1={matWX + matWW / 2}
          y1={matY - 25 - 14}
          x2={matOutX + matOutW / 2}
          y2={matY - 25 - 14}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.6"
        />
        <text
          x={(matWX + matWW / 2 + matOutX + matOutW / 2) / 2}
          y={matY - 25 - 18}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          cols preserved
        </text>
      </motion.g>

      {/* ── Annotation: "Shared dimension contracts" ── */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.55, ease: PRODUCTIVE_EASE, delay: 0.9 }}
      >
        <rect
          x={130}
          y={192}
          width={170}
          height={22}
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.8"
        />
        <text
          x={215}
          y={204}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9.5"
          fontStyle="italic"
          fill="var(--color-accent)"
          fontWeight="500"
        >
          Shared dimension contracts
        </text>
        {/* Small arrow from annotation up toward the curved dashed line */}
        <line
          x1={215}
          y1={192}
          x2={175}
          y2={170}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
          opacity="0.5"
          markerEnd="url(#arrow-tensor-product)"
        />
      </motion.g>

      {/* ── Formula at bottom ── */}
      <motion.text
        x={250}
        y={230}
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 1.0 }}
      >
        (B × 784) @ (784 × 512) = (B × 512)
      </motion.text>
    </svg>
  )
}
