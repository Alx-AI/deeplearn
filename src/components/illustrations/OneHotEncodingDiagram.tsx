'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface OneHotEncodingDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function OneHotEncodingDiagram({
  className = '',
}: OneHotEncodingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* --- animation variants --- */
  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.55, ease: PRODUCTIVE_EASE },
    }),
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
      opacity: 1,
      transition: { delay, duration: 0.5, ease: PRODUCTIVE_EASE },
    }),
  }

  /* --- one-hot vector cells (visible window around position 3) --- */
  const cellW = 16
  const cellH = 16
  const cellGap = 1.5
  const vectorStartX = 56
  const vectorY = 48

  // Show positions 0-7, then ellipsis, then 45 to represent length-46
  const visibleCells = [
    { pos: 0, val: 0 },
    { pos: 1, val: 0 },
    { pos: 2, val: 0 },
    { pos: 3, val: 1 },
    { pos: 4, val: 0 },
    { pos: 5, val: 0 },
    { pos: 6, val: 0 },
    { pos: 7, val: 0 },
  ]
  const trailingCell = { pos: 45, val: 0 }

  /* --- right-side comparison layout --- */
  const rightX = 288
  const rowGap = 68

  return (
    <div className={className}>
      <svg
        ref={ref}
        viewBox="0 0 500 236"
        role="img"
        aria-label="One-hot encoding diagram contrasting one-hot vectors with integer labels for categorical classification"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-onehot"
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

        {/* =====================================================
            LEFT SIDE: Integer label -> One-hot vector
           ===================================================== */}

        {/* Section header */}
        <motion.text
          x="10"
          y="16"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="500"
          custom={0}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          Integer label
        </motion.text>

        {/* The integer "3" chip */}
        <motion.g
          custom={0.1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <rect
            x="12"
            y="24"
            width="26"
            height="22"
            rx="4"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text
            x="25"
            y="39"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="13"
            fontWeight="700"
          >
            3
          </text>
        </motion.g>

        {/* Arrow from integer to vector */}
        <motion.g
          custom={0.25}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          <motion.line
            x1="42"
            y1="35"
            x2="52"
            y2="35"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.2"
            markerEnd="url(#arrowhead-onehot)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: PRODUCTIVE_EASE }}
          />
        </motion.g>

        {/* One-hot vector header */}
        <motion.text
          x={vectorStartX}
          y="16"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="500"
          custom={0.2}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          One-hot vector (length 46)
        </motion.text>

        {/* Left bracket */}
        <motion.text
          x={vectorStartX - 4}
          y="42"
          fill="var(--color-text-tertiary)"
          fontSize="28"
          fontWeight="300"
          custom={0.3}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          [
        </motion.text>

        {/* Visible vector cells (positions 0-7) */}
        <motion.g
          custom={0.35}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {visibleCells.map((cell, i) => {
            const cx = vectorStartX + i * (cellW + cellGap)
            const isActive = cell.val === 1
            return (
              <motion.g
                key={cell.pos}
                custom={0.4 + i * 0.04}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <rect
                  x={cx}
                  y={vectorY - cellH + 2}
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
                  strokeWidth={isActive ? '1.5' : '0.8'}
                />
                <text
                  x={cx + cellW / 2}
                  y={vectorY - cellH / 2 + 3}
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
                {/* Position index below */}
                <text
                  x={cx + cellW / 2}
                  y={vectorY + 10}
                  textAnchor="middle"
                  fill={
                    isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-tertiary)'
                  }
                  fontSize="9"
                  fontWeight={isActive ? '600' : '400'}
                  opacity={isActive ? 1 : 0.55}
                >
                  {cell.pos}
                </text>
              </motion.g>
            )
          })}

          {/* Ellipsis in middle */}
          <text
            x={
              vectorStartX +
              visibleCells.length * (cellW + cellGap) +
              4
            }
            y={vectorY - cellH / 2 + 4}
            fill="var(--color-text-tertiary)"
            fontSize="10"
            fontWeight="600"
          >
            ...
          </text>

          {/* Trailing cell (position 45) */}
          {(() => {
            const trailX =
              vectorStartX +
              visibleCells.length * (cellW + cellGap) +
              22
            return (
              <motion.g
                custom={0.7}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={fadeIn}
              >
                <rect
                  x={trailX}
                  y={vectorY - cellH + 2}
                  width={cellW}
                  height={cellH}
                  rx="2"
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-border-primary)"
                  strokeWidth="0.8"
                />
                <text
                  x={trailX + cellW / 2}
                  y={vectorY - cellH / 2 + 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                >
                  0
                </text>
                <text
                  x={trailX + cellW / 2}
                  y={vectorY + 10}
                  textAnchor="middle"
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  opacity="0.55"
                >
                  {trailingCell.pos}
                </text>
              </motion.g>
            )
          })()}

          {/* Right bracket */}
          <text
            x={
              vectorStartX +
              visibleCells.length * (cellW + cellGap) +
              40
            }
            y="42"
            fill="var(--color-text-tertiary)"
            fontSize="28"
            fontWeight="300"
          >
            ]
          </text>
        </motion.g>

        {/* Highlight callout for the "1" at position 3 */}
        <motion.g
          custom={0.75}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          {(() => {
            const activeX = vectorStartX + 3 * (cellW + cellGap) + cellW / 2
            return (
              <>
                <line
                  x1={activeX}
                  y1={vectorY - cellH - 1}
                  x2={activeX}
                  y2={vectorY - cellH - 9}
                  stroke="var(--color-accent)"
                  strokeWidth="0.8"
                  opacity="0.7"
                />
                <text
                  x={activeX}
                  y={vectorY - cellH - 12}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="9"
                  fontWeight="600"
                >
                  class 3
                </text>
              </>
            )
          })()}
        </motion.g>

        {/* =====================================================
            DIVIDER
           ===================================================== */}
        <motion.line
          x1="270"
          y1="8"
          x2="270"
          y2="200"
          stroke="var(--color-border-primary)"
          strokeWidth="0.7"
          strokeDasharray="3 3"
          opacity="0.5"
          custom={0.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        />

        {/* =====================================================
            RIGHT SIDE: Two approaches
           ===================================================== */}

        {/* Section header */}
        <motion.text
          x={rightX}
          y="16"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="600"
          custom={0.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          Two equivalent approaches
        </motion.text>

        {/* --- Approach 1: One-hot + categorical_crossentropy --- */}
        <motion.g
          custom={0.6}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {/* Label */}
          <text
            x={rightX}
            y="36"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="600"
          >
            One-hot + categorical_crossentropy
          </text>

          {/* Compact vector representation */}
          {(() => {
            const miniCells = [0, 0, 0, 1, 0, 0]
            const miniW = 14
            const miniH = 13
            const miniGap = 1
            const miniY = 42
            return (
              <>
                <text
                  x={rightX - 2}
                  y={miniY + 10}
                  fill="var(--color-text-tertiary)"
                  fontSize="16"
                  fontWeight="300"
                >
                  [
                </text>
                {miniCells.map((v, i) => {
                  const mx = rightX + 8 + i * (miniW + miniGap)
                  const isOne = v === 1
                  return (
                    <g key={i}>
                      <rect
                        x={mx}
                        y={miniY}
                        width={miniW}
                        height={miniH}
                        rx="2"
                        fill={
                          isOne
                            ? 'var(--color-accent-subtle)'
                            : 'var(--color-bg-elevated)'
                        }
                        stroke={
                          isOne
                            ? 'var(--color-accent)'
                            : 'var(--color-border-primary)'
                        }
                        strokeWidth={isOne ? '1.2' : '0.7'}
                      />
                      <text
                        x={mx + miniW / 2}
                        y={miniY + miniH / 2 + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={
                          isOne
                            ? 'var(--color-accent)'
                            : 'var(--color-text-tertiary)'
                        }
                        fontSize="9"
                        fontWeight={isOne ? '700' : '400'}
                      >
                        {v}
                      </text>
                    </g>
                  )
                })}
                <text
                  x={rightX + 8 + miniCells.length * (miniW + miniGap) + 2}
                  y={miniY + 9}
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  fontWeight="600"
                >
                  ...
                </text>
                <text
                  x={rightX + 8 + miniCells.length * (miniW + miniGap) + 18}
                  y={miniY + 10}
                  fill="var(--color-text-tertiary)"
                  fontSize="16"
                  fontWeight="300"
                >
                  ]
                </text>
              </>
            )
          })()}

          {/* Dimension annotation */}
          <text
            x={rightX + 140}
            y="52"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            46 values
          </text>
        </motion.g>

        {/* --- Approach 2: Integer + sparse_categorical_crossentropy --- */}
        <motion.g
          custom={0.8}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          {(() => {
            const sparseY = 42 + rowGap
            return (
              <>
                <text
                  x={rightX}
                  y={sparseY - 6}
                  fill="var(--color-accent)"
                  fontSize="9"
                  fontWeight="600"
                >
                  Integer + sparse_categorical_crossentropy
                </text>

                {/* Integer chip */}
                <rect
                  x={rightX + 2}
                  y={sparseY}
                  width="26"
                  height="22"
                  rx="4"
                  fill="var(--color-accent-subtle)"
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                />
                <text
                  x={rightX + 15}
                  y={sparseY + 15}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="13"
                  fontWeight="700"
                >
                  3
                </text>

                {/* Memory annotation */}
                <text
                  x={rightX + 38}
                  y={sparseY + 14}
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  fontStyle="italic"
                >
                  1 value
                </text>

                {/* Memory efficiency callout */}
                <motion.g
                  custom={1.0}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  variants={fadeIn}
                >
                  <rect
                    x={rightX + 82}
                    y={sparseY - 2}
                    width="102"
                    height="24"
                    rx="4"
                    fill="var(--color-bg-tertiary)"
                    stroke="var(--color-border-primary)"
                    strokeWidth="0.7"
                  />
                  <text
                    x={rightX + 133}
                    y={sparseY + 9}
                    textAnchor="middle"
                    fill="var(--color-text-secondary)"
                    fontSize="9"
                    fontWeight="500"
                  >
                    46x less memory
                  </text>
                  <text
                    x={rightX + 133}
                    y={sparseY + 17}
                    textAnchor="middle"
                    fill="var(--color-text-tertiary)"
                    fontSize="9"
                  >
                    sparse is more efficient
                  </text>
                </motion.g>
              </>
            )
          })()}
        </motion.g>

        {/* --- "Same result" connector --- */}
        <motion.g
          custom={1.1}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          {(() => {
            const connX = rightX + 182
            const topY = 49
            const botY = 112
            const midY = (topY + botY) / 2
            return (
              <>
                {/* Right brace connecting both rows */}
                <path
                  d={`M ${connX} ${topY}
                      Q ${connX + 10} ${topY}, ${connX + 10} ${midY - 8}
                      L ${connX + 10} ${midY - 4}
                      Q ${connX + 10} ${midY}, ${connX + 16} ${midY}
                      Q ${connX + 10} ${midY}, ${connX + 10} ${midY + 4}
                      L ${connX + 10} ${midY + 8}
                      Q ${connX + 10} ${botY}, ${connX} ${botY}`}
                  fill="none"
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="0.8"
                  opacity="0.6"
                />
                {/* "Same result" label */}
                <text
                  x={connX + 10}
                  y={midY + 22}
                  textAnchor="middle"
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  fontStyle="italic"
                >
                  same
                </text>
                <text
                  x={connX + 10}
                  y={midY + 30}
                  textAnchor="middle"
                  fill="var(--color-text-tertiary)"
                  fontSize="9"
                  fontStyle="italic"
                >
                  result
                </text>
              </>
            )
          })()}
        </motion.g>

        {/* =====================================================
            LEFT BOTTOM: Summary diagram
           ===================================================== */}

        {/* Horizontal separator for lower section */}
        <motion.line
          x1="10"
          y1="78"
          x2="260"
          y2="78"
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          strokeDasharray="2 2"
          opacity="0.4"
          custom={0.85}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        />

        {/* Left side lower: compact comparison */}
        <motion.g
          custom={0.9}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
        >
          <text
            x="10"
            y="96"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="500"
          >
            How it works
          </text>

          {/* One-hot flow */}
          <text
            x="14"
            y="112"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            One-hot:
          </text>
          <rect
            x="56"
            y="104"
            width="32"
            height="13"
            rx="2"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="0.7"
          />
          <text
            x="72"
            y="113"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            label=3
          </text>

          <line
            x1="90"
            y1="111"
            x2="100"
            y2="111"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            markerEnd="url(#arrowhead-onehot)"
          />

          <rect
            x="104"
            y="104"
            width="70"
            height="13"
            rx="2"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="0.7"
          />
          <text
            x="139"
            y="113"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="500"
          >
            [0,0,0,1,0,...,0]
          </text>

          <line
            x1="176"
            y1="111"
            x2="186"
            y2="111"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            markerEnd="url(#arrowhead-onehot)"
          />

          <text
            x="190"
            y="113"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            crossentropy
          </text>

          {/* Sparse flow */}
          <text
            x="14"
            y="134"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            Sparse:
          </text>
          <rect
            x="56"
            y="126"
            width="32"
            height="13"
            rx="2"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="0.7"
          />
          <text
            x="72"
            y="135"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            label=3
          </text>

          <line
            x1="90"
            y1="133"
            x2="100"
            y2="133"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            markerEnd="url(#arrowhead-onehot)"
          />

          <rect
            x="104"
            y="126"
            width="26"
            height="13"
            rx="2"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="0.7"
          />
          <text
            x="117"
            y="135"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="700"
          >
            3
          </text>

          <line
            x1="132"
            y1="133"
            x2="186"
            y2="133"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.8"
            markerEnd="url(#arrowhead-onehot)"
          />

          <text
            x="190"
            y="135"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            sparse_crossentropy
          </text>
        </motion.g>

        {/* =====================================================
            BOTTOM ANNOTATION
           ===================================================== */}
        <motion.g
          custom={1.3}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          {/* Background pill for annotation */}
          <rect
            x="130"
            y="158"
            width="240"
            height="22"
            rx="11"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="0.7"
          />
          <text
            x="250"
            y="172"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="500"
            fontStyle="italic"
          >
            Same math, different encoding
          </text>
        </motion.g>

        {/* Sub-annotation */}
        <motion.text
          x="250"
          y="196"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
          custom={1.5}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
        >
          Sparse encoding avoids allocating a full vector -- preferred for many classes
        </motion.text>
      </svg>
    </div>
  )
}
