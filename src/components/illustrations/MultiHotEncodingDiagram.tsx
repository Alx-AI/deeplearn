'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface MultiHotEncodingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function MultiHotEncodingDiagram({
  className = '',
}: MultiHotEncodingDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const wordIndices = [14, 22, 16, 43, 530, 973]

  // Zoomed-in vector cells: position label and value
  // We show a window around positions 14..22 to illustrate the 1s
  const zoomedCells = [
    { pos: 12, val: 0 },
    { pos: 13, val: 0 },
    { pos: 14, val: 1 },
    { pos: 15, val: 0 },
    { pos: 16, val: 1 },
    { pos: 17, val: 0 },
    { pos: 18, val: 0 },
    { pos: 19, val: 0 },
    { pos: 20, val: 0 },
    { pos: 21, val: 0 },
    { pos: 22, val: 1 },
    { pos: 23, val: 0 },
    { pos: 24, val: 0 },
  ]

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.55,
        ease: PRODUCTIVE_EASE,
      },
    }),
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: PRODUCTIVE_EASE,
      },
    }),
  }

  const cellW = 22
  const cellH = 20
  const cellGap = 2
  const zoomStartX = 118
  const zoomY = 148

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 220"
        role="img"
        aria-label="Multi-hot encoding diagram showing how variable-length word index sequences are converted to fixed-size binary vectors"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-multi-hot"
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

        {/* === Left side: Word index list === */}
        <motion.g
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <text
            x="10"
            y="18"
            fill="var(--color-text-secondary)"
            fontSize="10"
            fontWeight="500"
          >
            Word indices (variable length)
          </text>

          {/* Bracket left */}
          <text
            x="14"
            y="58"
            fill="var(--color-text-tertiary)"
            fontSize="38"
            fontWeight="300"
          >
            [
          </text>

          {/* Index chips */}
          {wordIndices.map((idx, i) => {
            const chipX = 28 + i * 26
            const chipY = 36
            return (
              <g key={i}>
                <rect
                  x={chipX}
                  y={chipY}
                  width="24"
                  height="20"
                  rx="3"
                  fill="var(--color-accent-subtle)"
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                />
                <text
                  x={chipX + 12}
                  y={chipY + 13}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  {idx}
                </text>
              </g>
            )
          })}

          {/* Ellipsis after indices */}
          <text
            x={28 + wordIndices.length * 26 + 6}
            y="52"
            fill="var(--color-text-tertiary)"
            fontSize="12"
            fontWeight="600"
          >
            ...
          </text>

          {/* Bracket right */}
          <text
            x={28 + wordIndices.length * 26 + 20}
            y="58"
            fill="var(--color-text-tertiary)"
            fontSize="38"
            fontWeight="300"
          >
            ]
          </text>
        </motion.g>

        {/* === Arrow: Multi-hot encode === */}
        <motion.g
          custom={0.35}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <motion.line
            x1="210"
            y1="48"
            x2="260"
            y2="48"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-multi-hot)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{
              delay: 0.4,
              duration: 0.5,
              ease: PRODUCTIVE_EASE,
            }}
          />
          <text
            x="235"
            y="40"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="8.5"
            fontWeight="500"
          >
            Multi-hot encode
          </text>
        </motion.g>

        {/* === Right side: Full vector bar === */}
        <motion.g
          custom={0.6}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {/* Long bar representing the 10,000-dim vector */}
          <rect
            x="274"
            y="37"
            width="210"
            height="22"
            rx="3"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />

          {/* Tick marks for highlighted positions (1s) */}
          {[
            { idx: 14, label: '14' },
            { idx: 16, label: '16' },
            { idx: 22, label: '22' },
            { idx: 43, label: '43' },
            { idx: 530, label: '530' },
            { idx: 973, label: '973' },
          ].map((item, i) => {
            // Map index to x position within the bar (0..10000 -> 274..484)
            const xPos = 274 + (item.idx / 10000) * 210
            return (
              <motion.g
                key={item.idx}
                custom={0.8 + i * 0.08}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <rect
                  x={xPos - 1}
                  y="38"
                  width="2.5"
                  height="20"
                  rx="0.5"
                  fill="var(--color-accent)"
                  opacity="0.9"
                />
              </motion.g>
            )
          })}

          {/* "0" labels at start and near end */}
          <text
            x="278"
            y="51"
            fill="var(--color-text-tertiary)"
            fontSize="7"
            opacity="0.6"
          >
            0
          </text>
          <text
            x="468"
            y="51"
            fill="var(--color-text-tertiary)"
            fontSize="7"
            opacity="0.6"
          >
            9999
          </text>

          {/* "1"s scattered label */}
          <text
            x="292"
            y="33"
            fill="var(--color-accent)"
            fontSize="7"
            fontWeight="500"
          >
            1s at active positions
          </text>

          {/* Label below */}
          <text
            x="379"
            y="74"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="500"
          >
            Fixed-size binary vector (10,000 dims)
          </text>
        </motion.g>

        {/* === Magnifying glass line from bar to zoomed view === */}
        <motion.g
          custom={1.1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          {/* Dashed lines connecting bar region to zoomed view */}
          <line
            x1="274"
            y1="59"
            x2={zoomStartX}
            y2={zoomY - 6}
            stroke="var(--color-border-primary)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.5"
          />
          <line
            x1="290"
            y1="59"
            x2={zoomStartX + zoomedCells.length * (cellW + cellGap)}
            y2={zoomY - 6}
            stroke="var(--color-border-primary)"
            strokeWidth="0.8"
            strokeDasharray="3 2"
            opacity="0.5"
          />

          {/* Zoom label */}
          <text
            x="20"
            y={zoomY + 8}
            fill="var(--color-text-tertiary)"
            fontSize="8.5"
            fontStyle="italic"
          >
            Zoomed in:
          </text>
        </motion.g>

        {/* === Zoomed-in vector portion === */}
        <motion.g
          custom={1.2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {/* Ellipsis before */}
          <text
            x={zoomStartX - 14}
            y={zoomY + 12}
            fill="var(--color-text-tertiary)"
            fontSize="10"
            fontWeight="500"
          >
            ...
          </text>

          {zoomedCells.map((cell, i) => {
            const cx = zoomStartX + i * (cellW + cellGap)
            const isActive = cell.val === 1
            return (
              <motion.g
                key={i}
                custom={1.3 + i * 0.04}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <rect
                  x={cx}
                  y={zoomY}
                  width={cellW}
                  height={cellH}
                  rx="2"
                  fill={
                    isActive
                      ? 'var(--color-accent-subtle)'
                      : 'var(--color-bg-elevated)'
                  }
                  stroke={
                    isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-border-primary)'
                  }
                  strokeWidth={isActive ? '1.5' : '1'}
                />
                <text
                  x={cx + cellW / 2}
                  y={zoomY + cellH / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-tertiary)'
                  }
                  fontSize="9"
                  fontWeight={isActive ? '700' : '400'}
                >
                  {cell.val}
                </text>
                {/* Position number below */}
                <text
                  x={cx + cellW / 2}
                  y={zoomY + cellH + 11}
                  textAnchor="middle"
                  fill={
                    isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-tertiary)'
                  }
                  fontSize="6.5"
                  fontWeight={isActive ? '600' : '400'}
                  opacity={isActive ? 1 : 0.6}
                >
                  {cell.pos}
                </text>
              </motion.g>
            )
          })}

          {/* Ellipsis after */}
          <text
            x={zoomStartX + zoomedCells.length * (cellW + cellGap) + 4}
            y={zoomY + 12}
            fill="var(--color-text-tertiary)"
            fontSize="10"
            fontWeight="500"
          >
            ...
          </text>

          {/* Position label */}
          <text
            x={zoomStartX}
            y={zoomY + cellH + 24}
            fill="var(--color-text-tertiary)"
            fontSize="7.5"
            fontStyle="italic"
          >
            position index
          </text>
        </motion.g>

        {/* === Bottom annotation === */}
        <motion.text
          x="250"
          y="210"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="8.5"
          fontStyle="italic"
          custom={1.8}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          Mostly 0s, with a 1 at each word index position
        </motion.text>
      </svg>
    </div>
  )
}
