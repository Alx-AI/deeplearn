'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ArchitecturePriorsDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

/**
 * Three rows mapping data types to recommended model architectures:
 *   Image  -> ConvNet
 *   Text   -> Transformer / RNN
 *   Table  -> Dense Network
 */
const rows = [
  { dataLabel: 'Image', archLabel: 'ConvNet' },
  { dataLabel: 'Text / Sequence', archLabel: 'Transformer / RNN' },
  { dataLabel: 'Tabular', archLabel: 'Dense Network' },
] as const

export default function ArchitecturePriorsDiagram({
  className,
}: ArchitecturePriorsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const rowStartY = 60
  const rowHeight = 62
  const leftColX = 30
  const arrowStartX = 170
  const arrowEndX = 260
  const rightColX = 270

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Architecture priors diagram mapping data types to recommended model architectures: images to ConvNets, text to Transformers or RNNs, and tabular data to dense networks"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-arch-priors"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x={240}
        y={22}
        textAnchor="middle"
        fontSize="13"
        fontWeight={600}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0, y: 4 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Match Architecture to Data Type
      </motion.text>

      {/* Column headers */}
      <motion.text
        x={100}
        y={46}
        textAnchor="middle"
        fontSize="9"
        fontWeight={600}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-tertiary)"
        letterSpacing="0.06em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        DATA TYPE
      </motion.text>
      <motion.text
        x={370}
        y={46}
        textAnchor="middle"
        fontSize="9"
        fontWeight={600}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-tertiary)"
        letterSpacing="0.06em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        ARCHITECTURE
      </motion.text>

      {/* === Row 1: Image -> ConvNet === */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Image icon: 4x4 pixel grid */}
        <g transform={`translate(${leftColX}, ${rowStartY})`}>
          <rect
            x={0}
            y={0}
            width={36}
            height={36}
            rx={3}
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth={1.2}
          />
          {/* Grid pixels - 4x4 */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`px-${row}-${col}`}
                x={3 + col * 8}
                y={3 + row * 8}
                width={6}
                height={6}
                rx={0.5}
                fill="var(--color-accent)"
                opacity={(row + col) % 3 === 0 ? 0.8 : (row + col) % 2 === 0 ? 0.5 : 0.25}
              />
            ))
          )}
        </g>
        {/* Data type label */}
        <text
          x={80}
          y={rowStartY + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-text-primary)"
        >
          Image
        </text>
        <text
          x={80}
          y={rowStartY + 29}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          grid of pixels
        </text>
      </motion.g>

      {/* Row 1 arrow */}
      <motion.line
        x1={arrowStartX}
        y1={rowStartY + 18}
        x2={arrowEndX}
        y2={rowStartY + 18}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        markerEnd="url(#arrowhead-arch-priors)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.4, delay: 0.35, ease: PRODUCTIVE_EASE }}
      />

      {/* Row 1 architecture: ConvNet with conv filter visual */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={rightColX}
          y={rowStartY}
          width={180}
          height={36}
          rx={5}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1.2}
        />
        <text
          x={rightColX + 14}
          y={rowStartY + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-accent)"
        >
          ConvNet
        </text>
        <text
          x={rightColX + 14}
          y={rowStartY + 28}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          local spatial filters
        </text>
        {/* Small conv filter icon: 3x3 grid */}
        <g transform={`translate(${rightColX + 140}, ${rowStartY + 6})`}>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`cf-${r}-${c}`}
                x={c * 8}
                y={r * 8}
                width={7}
                height={7}
                rx={1}
                fill="var(--color-accent)"
                opacity={r === 1 && c === 1 ? 0.9 : 0.35}
              />
            ))
          )}
        </g>
      </motion.g>

      {/* === Row 2: Text -> Transformer / RNN === */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.45, ease: PRODUCTIVE_EASE }}
      >
        {/* Text icon: horizontal token blocks */}
        <g transform={`translate(${leftColX}, ${rowStartY + rowHeight})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`tok-${i}`}
              x={i * 8}
              y={10}
              width={6}
              height={16}
              rx={1.5}
              fill="var(--color-accent)"
              opacity={0.3 + i * 0.15}
            />
          ))}
          {/* Connecting baseline */}
          <line
            x1={0}
            y1={30}
            x2={42}
            y2={30}
            stroke="var(--color-accent)"
            strokeWidth={0.8}
            opacity={0.4}
          />
        </g>
        {/* Data type label */}
        <text
          x={80}
          y={rowStartY + rowHeight + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-text-primary)"
        >
          Text / Sequence
        </text>
        <text
          x={80}
          y={rowStartY + rowHeight + 29}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          ordered tokens
        </text>
      </motion.g>

      {/* Row 2 arrow */}
      <motion.line
        x1={arrowStartX}
        y1={rowStartY + rowHeight + 18}
        x2={arrowEndX}
        y2={rowStartY + rowHeight + 18}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        markerEnd="url(#arrowhead-arch-priors)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Row 2 architecture: Transformer / RNN with attention lines */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.65, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={rightColX}
          y={rowStartY + rowHeight}
          width={180}
          height={36}
          rx={5}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1.2}
        />
        <text
          x={rightColX + 14}
          y={rowStartY + rowHeight + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-accent)"
        >
          Transformer / RNN
        </text>
        <text
          x={rightColX + 14}
          y={rowStartY + rowHeight + 28}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          sequential attention
        </text>
        {/* Attention lines icon: arcs connecting dots */}
        <g transform={`translate(${rightColX + 138}, ${rowStartY + rowHeight + 8})`}>
          {[0, 1, 2, 3].map((i) => (
            <circle
              key={`ad-${i}`}
              cx={i * 10}
              cy={18}
              r={2.5}
              fill="var(--color-accent)"
              opacity={0.6}
            />
          ))}
          {/* Attention arcs */}
          <path
            d="M0,18 Q5,4 10,18"
            stroke="var(--color-accent)"
            strokeWidth={0.8}
            fill="none"
            opacity={0.5}
          />
          <path
            d="M0,18 Q15,0 20,18"
            stroke="var(--color-accent)"
            strokeWidth={0.8}
            fill="none"
            opacity={0.4}
          />
          <path
            d="M10,18 Q20,6 30,18"
            stroke="var(--color-accent)"
            strokeWidth={0.8}
            fill="none"
            opacity={0.5}
          />
          <path
            d="M0,18 Q15,-2 30,18"
            stroke="var(--color-accent)"
            strokeWidth={0.6}
            fill="none"
            opacity={0.25}
          />
        </g>
      </motion.g>

      {/* === Row 3: Table -> Dense Network === */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        {/* Table icon: spreadsheet grid */}
        <g transform={`translate(${leftColX}, ${rowStartY + rowHeight * 2})`}>
          <rect
            x={0}
            y={0}
            width={36}
            height={36}
            rx={3}
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth={1.2}
          />
          {/* Header row */}
          <rect
            x={1}
            y={1}
            width={34}
            height={9}
            rx={2}
            fill="var(--color-accent)"
            opacity={0.3}
          />
          {/* Horizontal lines */}
          <line x1={2} y1={10} x2={34} y2={10} stroke="var(--color-accent)" strokeWidth={0.6} opacity={0.4} />
          <line x1={2} y1={18} x2={34} y2={18} stroke="var(--color-accent)" strokeWidth={0.6} opacity={0.4} />
          <line x1={2} y1={26} x2={34} y2={26} stroke="var(--color-accent)" strokeWidth={0.6} opacity={0.4} />
          {/* Vertical lines */}
          <line x1={12} y1={2} x2={12} y2={34} stroke="var(--color-accent)" strokeWidth={0.6} opacity={0.4} />
          <line x1={24} y1={2} x2={24} y2={34} stroke="var(--color-accent)" strokeWidth={0.6} opacity={0.4} />
        </g>
        {/* Data type label */}
        <text
          x={80}
          y={rowStartY + rowHeight * 2 + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-text-primary)"
        >
          Tabular
        </text>
        <text
          x={80}
          y={rowStartY + rowHeight * 2 + 29}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          rows and columns
        </text>
      </motion.g>

      {/* Row 3 arrow */}
      <motion.line
        x1={arrowStartX}
        y1={rowStartY + rowHeight * 2 + 18}
        x2={arrowEndX}
        y2={rowStartY + rowHeight * 2 + 18}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        markerEnd="url(#arrowhead-arch-priors)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.4, delay: 0.85, ease: PRODUCTIVE_EASE }}
      />

      {/* Row 3 architecture: Dense Network with fully-connected nodes */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={rightColX}
          y={rowStartY + rowHeight * 2}
          width={180}
          height={36}
          rx={5}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1.2}
        />
        <text
          x={rightColX + 14}
          y={rowStartY + rowHeight * 2 + 16}
          fontSize="11"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-accent)"
        >
          Dense Network
        </text>
        <text
          x={rightColX + 14}
          y={rowStartY + rowHeight * 2 + 28}
          fontSize="9"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-secondary)"
        >
          fully-connected layers
        </text>
        {/* Fully-connected node icon: two columns of nodes with all connections */}
        <g transform={`translate(${rightColX + 140}, ${rowStartY + rowHeight * 2 + 4})`}>
          {/* Left column: 3 nodes */}
          {[0, 1, 2].map((i) => {
            const ly = 4 + i * 10
            return [0, 1, 2].map((j) => {
              const ry = 4 + j * 10
              return (
                <line
                  key={`fc-${i}-${j}`}
                  x1={4}
                  y1={ly}
                  x2={28}
                  y2={ry}
                  stroke="var(--color-accent)"
                  strokeWidth={0.6}
                  opacity={0.3}
                />
              )
            })
          })}
          {/* Right column to output */}
          {[0, 1, 2].map((j) => {
            const ry = 4 + j * 10
            return (
              <line
                key={`fc-out-${j}`}
                x1={28}
                y1={ry}
                x2={36}
                y2={14}
                stroke="var(--color-accent)"
                strokeWidth={0.6}
                opacity={0.3}
              />
            )
          })}
          {/* Left nodes */}
          {[0, 1, 2].map((i) => (
            <circle
              key={`ln-${i}`}
              cx={4}
              cy={4 + i * 10}
              r={2.5}
              fill="var(--color-accent)"
              opacity={0.7}
            />
          ))}
          {/* Middle nodes */}
          {[0, 1, 2].map((i) => (
            <circle
              key={`mn-${i}`}
              cx={28}
              cy={4 + i * 10}
              r={2.5}
              fill="var(--color-accent)"
              opacity={0.7}
            />
          ))}
          {/* Output node */}
          <circle
            cx={36}
            cy={14}
            r={2.5}
            fill="var(--color-accent)"
            opacity={0.9}
          />
        </g>
      </motion.g>

      {/* Bottom annotation */}
      <motion.text
        x={240}
        y={248}
        textAnchor="middle"
        fontSize="9"
        fontWeight={500}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        letterSpacing="0.03em"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        Architecture encodes domain knowledge
      </motion.text>
    </svg>
  )
}
