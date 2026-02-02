'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface LBFGridDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function LBFGridDiagram({ className = '' }: LBFGridDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Grid configuration
  const gridSize = 5
  const cellSize = 52
  const gridOriginX = 55
  const gridOriginY = 30

  // Robots: { col, row, color, level }
  const robots = [
    { col: 1, row: 2, fill: '#4A90D9', label: 'L2', name: 'Robot A' },
    { col: 3, row: 4, fill: '#5BAA6A', label: 'L1', name: 'Robot B' },
    { col: 4, row: 4, fill: '#E08844', label: 'L3', name: 'Robot C' },
  ]

  // Items: { col, row, level }
  const items = [
    { col: 0, row: 2, level: 'L3', shape: 'apple' as const },
    { col: 3, row: 3, level: 'L1', shape: 'diamond' as const },
    { col: 4, row: 3, level: 'L4', shape: 'apple' as const },
  ]

  const cellCenter = (col: number, row: number) => ({
    cx: gridOriginX + col * cellSize + cellSize / 2,
    cy: gridOriginY + row * cellSize + cellSize / 2,
  })

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 420"
      className={className}
      role="img"
      aria-label="Level-Based Foraging grid world showing robots with skill levels collecting items that require cooperation"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="lbf-arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L7,3 z"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x="210"
        y="18"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Level-Based Foraging (5x5)
      </motion.text>

      {/* Grid background */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={gridOriginX}
          y={gridOriginY}
          width={gridSize * cellSize}
          height={gridSize * cellSize}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="4"
        />

        {/* Vertical grid lines */}
        {Array.from({ length: gridSize - 1 }, (_, i) => (
          <line
            key={`vline-${i}`}
            x1={gridOriginX + (i + 1) * cellSize}
            y1={gridOriginY}
            x2={gridOriginX + (i + 1) * cellSize}
            y2={gridOriginY + gridSize * cellSize}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Horizontal grid lines */}
        {Array.from({ length: gridSize - 1 }, (_, i) => (
          <line
            key={`hline-${i}`}
            x1={gridOriginX}
            y1={gridOriginY + (i + 1) * cellSize}
            x2={gridOriginX + gridSize * cellSize}
            y2={gridOriginY + (i + 1) * cellSize}
            stroke="var(--color-border-primary)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        ))}

        {/* Row/col labels */}
        {Array.from({ length: gridSize }, (_, i) => (
          <g key={`labels-${i}`}>
            <text
              x={gridOriginX + i * cellSize + cellSize / 2}
              y={gridOriginY - 6}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
            >
              {i}
            </text>
            <text
              x={gridOriginX - 10}
              y={gridOriginY + i * cellSize + cellSize / 2 + 3}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
            >
              {i}
            </text>
          </g>
        ))}
      </motion.g>

      {/* Robots */}
      {robots.map((robot, i) => {
        const { cx, cy } = cellCenter(robot.col, robot.row)
        return (
          <motion.g
            key={`robot-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: PRODUCTIVE_EASE }}
          >
            {/* Robot body */}
            <circle
              cx={cx}
              cy={cy}
              r="16"
              fill={robot.fill}
              opacity="0.85"
              stroke={robot.fill}
              strokeWidth="2"
            />
            {/* Skill level label */}
            <text
              x={cx}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-bg-elevated)"
              fontSize="10"
              fontWeight="700"
            >
              {robot.label}
            </text>
          </motion.g>
        )
      })}

      {/* Items */}
      {items.map((item, i) => {
        const { cx, cy } = cellCenter(item.col, item.row)
        return (
          <motion.g
            key={`item-${i}`}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.15, ease: PRODUCTIVE_EASE }}
          >
            {item.shape === 'apple' ? (
              <>
                {/* Apple shape: circle body + small stem */}
                <circle
                  cx={cx}
                  cy={cy + 2}
                  r="11"
                  fill="#D94A4A"
                  opacity="0.85"
                />
                {/* Stem */}
                <line
                  x1={cx}
                  y1={cy - 9}
                  x2={cx + 2}
                  y2={cy - 14}
                  stroke="#6B8E23"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                {/* Leaf */}
                <ellipse
                  cx={cx + 5}
                  cy={cy - 12}
                  rx="4"
                  ry="2"
                  fill="#6B8E23"
                  transform={`rotate(30, ${cx + 5}, ${cy - 12})`}
                />
              </>
            ) : (
              <>
                {/* Diamond shape */}
                <polygon
                  points={`${cx},${cy - 12} ${cx + 10},${cy} ${cx},${cy + 12} ${cx - 10},${cy}`}
                  fill="#9B59B6"
                  opacity="0.85"
                />
              </>
            )}
            {/* Level threshold label */}
            <rect
              x={cx + 10}
              y={cy - 18}
              width="22"
              height="14"
              rx="3"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="0.8"
            />
            <text
              x={cx + 21}
              y={cy - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-secondary)"
              fontSize="9"
              fontWeight="600"
            >
              {item.level}
            </text>
          </motion.g>
        )
      })}

      {/* Solo collection annotation: Robot A (L2) cannot reach L3 apple alone at (0,2) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.9 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Small "X" mark between Robot A and the L3 apple */}
        {(() => {
          const robotPos = cellCenter(1, 2)
          const itemPos = cellCenter(0, 2)
          const midX = (robotPos.cx + itemPos.cx) / 2
          const midY = robotPos.cy
          return (
            <>
              <line
                x1={midX - 4}
                y1={midY - 4}
                x2={midX + 4}
                y2={midY + 4}
                stroke="#D94A4A"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1={midX + 4}
                y1={midY - 4}
                x2={midX - 4}
                y2={midY + 4}
                stroke="#D94A4A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )
        })()}
      </motion.g>

      {/* Solo collection annotation: Robot B (L1) can collect L1 diamond at (3,3) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.85 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        {(() => {
          const robotPos = cellCenter(3, 4)
          const itemPos = cellCenter(3, 3)
          const midX = robotPos.cx
          const startY = robotPos.cy - 16
          const endY = itemPos.cy + 14
          return (
            <line
              x1={midX}
              y1={startY}
              x2={midX}
              y2={endY}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeDasharray="3,2"
              markerEnd="url(#lbf-arrowhead)"
            />
          )
        })()}
      </motion.g>

      {/* Cooperation highlight: Robot B (L1) + Robot C (L3) adjacent to L4 apple at (4,3) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        {(() => {
          const itemPos = cellCenter(4, 3)
          const robotBPos = cellCenter(3, 4)
          const robotCPos = cellCenter(4, 4)
          // Highlight rectangle around the cooperation zone
          return (
            <>
              <motion.rect
                x={gridOriginX + 3 * cellSize - 2}
                y={gridOriginY + 3 * cellSize - 2}
                width={cellSize * 2 + 4}
                height={cellSize * 2 + 4}
                rx="6"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                strokeDasharray="6,3"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 1.6, ease: PRODUCTIVE_EASE }}
              />
              {/* Arrows from both robots toward item */}
              <motion.line
                x1={robotBPos.cx + 8}
                y1={robotBPos.cy - 16}
                x2={itemPos.cx - 8}
                y2={itemPos.cy + 14}
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="3,2"
                markerEnd="url(#lbf-arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.7, ease: PRODUCTIVE_EASE }}
              />
              <motion.line
                x1={robotCPos.cx}
                y1={robotCPos.cy - 16}
                x2={itemPos.cx}
                y2={itemPos.cy + 14}
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeDasharray="3,2"
                markerEnd="url(#lbf-arrowhead)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
              />
              {/* Cooperation label */}
              <motion.g
                initial={{ opacity: 0, y: 5 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
                transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
              >
                <rect
                  x={gridOriginX + 3 * cellSize + 5}
                  y={gridOriginY + 5 * cellSize + 6}
                  width="96"
                  height="16"
                  rx="3"
                  fill="var(--color-bg-elevated)"
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x={gridOriginX + 3 * cellSize + 53}
                  y={gridOriginY + 5 * cellSize + 17}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="9"
                  fontWeight="600"
                >
                  L1+L3 = L4 Coop!
                </text>
              </motion.g>
            </>
          )
        })()}
      </motion.g>

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Legend background */}
        <rect
          x="30"
          y="312"
          width="360"
          height="95"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="210"
          y="328"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="600"
        >
          Legend
        </text>

        {/* Robot entries */}
        {robots.map((robot, i) => {
          const lx = 55 + i * 120
          const ly = 348
          return (
            <g key={`legend-robot-${i}`}>
              <circle
                cx={lx}
                cy={ly}
                r="8"
                fill={robot.fill}
                opacity="0.85"
              />
              <text
                x={lx}
                y={ly + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-bg-elevated)"
                fontSize="7"
                fontWeight="700"
              >
                {robot.label}
              </text>
              <text
                x={lx + 14}
                y={ly + 1}
                dominantBaseline="middle"
                fill="var(--color-text-secondary)"
                fontSize="9"
              >
                {robot.name} ({robot.label})
              </text>
            </g>
          )
        })}

        {/* Item entries */}
        <g>
          <circle
            cx="65"
            cy="372"
            r="6"
            fill="#D94A4A"
            opacity="0.85"
          />
          <text
            x="79"
            y="373"
            dominantBaseline="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            Apple (food item)
          </text>
        </g>
        <g>
          <polygon
            points="195,366 201,372 195,378 189,372"
            fill="#9B59B6"
            opacity="0.85"
          />
          <text
            x="209"
            y="373"
            dominantBaseline="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            Diamond (food item)
          </text>
        </g>

        {/* Rule explanation */}
        <text
          x="210"
          y="394"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Collect rule: sum of adjacent robot levels must be greater than or equal to the item level
        </text>
      </motion.g>
    </svg>
  )
}
