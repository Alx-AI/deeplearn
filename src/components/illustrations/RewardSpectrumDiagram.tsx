'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RewardSpectrumDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function RewardSpectrumDiagram({
  className,
}: RewardSpectrumDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Spectrum bar geometry
  const barX = 60
  const barW = 440
  const barY = 90
  const barH = 8

  // Three anchor positions along the spectrum
  const anchors = [
    {
      x: barX + 30,
      label: 'Cooperative',
      subtitle: 'Common Reward',
      example: 'Warehouse Robots',
    },
    {
      x: barX + barW / 2,
      label: 'Mixed-Motive',
      subtitle: 'General-Sum',
      example: 'Autonomous Driving',
    },
    {
      x: barX + barW - 30,
      label: 'Competitive',
      subtitle: 'Zero-Sum',
      example: 'Chess / Go',
    },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 240"
      role="img"
      aria-label="Reward spectrum diagram showing the cooperative to competitive range in multi-agent reinforcement learning with example applications"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Gradient for the spectrum bar */}
        <linearGradient
          id="reward-spectrum-gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.7" />
          <stop offset="50%" stopColor="var(--color-text-tertiary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-text-secondary)" stopOpacity="0.7" />
        </linearGradient>

        {/* Arrow markers */}
        <marker
          id="reward-spectrum-arrow-left"
          markerWidth="8"
          markerHeight="6"
          refX="1"
          refY="3"
          orient="auto"
        >
          <polygon
            points="8 0, 0 3, 8 6"
            fill="var(--color-accent)"
            opacity="0.6"
          />
        </marker>
        <marker
          id="reward-spectrum-arrow-right"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-secondary)"
            opacity="0.6"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x="280"
        y="22"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Reward Spectrum
      </motion.text>

      {/* Icons and labels above the spectrum bar */}
      {anchors.map((anchor, i) => (
        <motion.g
          key={anchor.label}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{
            duration: 0.5,
            delay: 0.6 + i * 0.2,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {/* Icon area */}
          {i === 0 && (
            /* Handshake / team icon for cooperative */
            <g transform={`translate(${anchor.x - 10}, 34)`}>
              {/* Two figures side by side */}
              <circle cx="4" cy="3" r="3" fill="var(--color-accent)" opacity="0.7" />
              <circle cx="16" cy="3" r="3" fill="var(--color-accent)" opacity="0.7" />
              <path
                d="M 0 10 Q 4 7, 10 9 Q 16 7, 20 10"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.7"
                strokeLinecap="round"
              />
            </g>
          )}
          {i === 1 && (
            /* Balance / scale icon for mixed-motive */
            <g transform={`translate(${anchor.x - 10}, 34)`}>
              {/* Fulcrum */}
              <polygon points="10 14, 6 18, 14 18" fill="var(--color-text-tertiary)" opacity="0.6" />
              {/* Beam */}
              <line x1="0" y1="8" x2="20" y2="8" stroke="var(--color-text-tertiary)" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
              {/* Center post */}
              <line x1="10" y1="8" x2="10" y2="14" stroke="var(--color-text-tertiary)" strokeWidth="1.5" opacity="0.6" />
              {/* Pans */}
              <path d="M 0 8 L -2 12 L 4 12 Z" fill="var(--color-text-tertiary)" opacity="0.4" />
              <path d="M 20 8 L 16 12 L 22 12 Z" fill="var(--color-text-tertiary)" opacity="0.4" />
            </g>
          )}
          {i === 2 && (
            /* Versus / crossed swords icon for competitive */
            <g transform={`translate(${anchor.x - 10}, 34)`}>
              {/* Two crossed lines (swords) */}
              <line x1="2" y1="2" x2="18" y2="16" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              <line x1="18" y1="2" x2="2" y2="16" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
              {/* Guards */}
              <circle cx="2" cy="2" r="1.5" fill="var(--color-text-secondary)" opacity="0.5" />
              <circle cx="18" cy="2" r="1.5" fill="var(--color-text-secondary)" opacity="0.5" />
            </g>
          )}

          {/* Label */}
          <text
            x={anchor.x}
            y="64"
            textAnchor="middle"
            fill={
              i === 0
                ? 'var(--color-accent)'
                : i === 2
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-text-primary)'
            }
            fontSize="12"
            fontWeight="600"
          >
            {anchor.label}
          </text>

          {/* Subtitle */}
          <text
            x={anchor.x}
            y="77"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
          >
            {anchor.subtitle}
          </text>
        </motion.g>
      ))}

      {/* Spectrum bar - animates drawing left to right */}
      <motion.rect
        x={barX}
        y={barY}
        width={barW}
        height={barH}
        rx="4"
        fill="url(#reward-spectrum-gradient)"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        style={{ transformOrigin: `${barX}px ${barY + barH / 2}px` }}
        transition={{ duration: 0.8, delay: 0.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Arrow tips at each end of the bar */}
      <motion.line
        x1={barX - 8}
        y1={barY + barH / 2}
        x2={barX}
        y2={barY + barH / 2}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerStart="url(#reward-spectrum-arrow-left)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />
      <motion.line
        x1={barX + barW}
        y1={barY + barH / 2}
        x2={barX + barW + 8}
        y2={barY + barH / 2}
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        markerEnd="url(#reward-spectrum-arrow-right)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* Tick marks on spectrum at anchor positions */}
      {anchors.map((anchor, i) => (
        <motion.line
          key={`tick-${i}`}
          x1={anchor.x}
          y1={barY - 2}
          x2={anchor.x}
          y2={barY + barH + 2}
          stroke="var(--color-text-primary)"
          strokeWidth="1.5"
          opacity="0.4"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 0.4 } : { scaleY: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: 0.9 + i * 0.1,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Connecting lines from spectrum to example boxes */}
      {anchors.map((anchor, i) => (
        <motion.line
          key={`connector-${i}`}
          x1={anchor.x}
          y1={barY + barH + 3}
          x2={anchor.x}
          y2={130}
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          strokeDasharray="3 2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 0.6 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: 0.4,
            delay: 1.2 + i * 0.15,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Example boxes below the spectrum */}
      {anchors.map((anchor, i) => {
        const boxW = 130
        const boxH = 36
        const boxX = anchor.x - boxW / 2
        const boxY = 132

        return (
          <motion.g
            key={`example-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.5,
              delay: 1.4 + i * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Box background */}
            <rect
              x={boxX}
              y={boxY}
              width={boxW}
              height={boxH}
              rx="8"
              fill="var(--color-bg-elevated)"
              stroke={
                i === 0
                  ? 'var(--color-accent)'
                  : i === 2
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-border-primary)'
              }
              strokeWidth="1.5"
            />

            {/* Subtle top accent line */}
            <rect
              x={boxX + 1}
              y={boxY}
              width={boxW - 2}
              height="3"
              rx="2"
              fill={
                i === 0
                  ? 'var(--color-accent)'
                  : i === 2
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-text-tertiary)'
              }
              opacity="0.3"
            />

            {/* "e.g." label */}
            <text
              x={anchor.x}
              y={boxY + 14}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              fontStyle="italic"
            >
              e.g.
            </text>

            {/* Example name */}
            <text
              x={anchor.x}
              y={boxY + 27}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
            >
              {anchor.example}
            </text>
          </motion.g>
        )
      })}

      {/* Bottom annotation with proper SVG arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="115"
          y="196"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Aligned Interests
        </text>
        <line
          x1="170"
          y1="193"
          x2="390"
          y2="193"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          markerStart="url(#reward-spectrum-arrow-left)"
          markerEnd="url(#reward-spectrum-arrow-right)"
        />
        <text
          x="445"
          y="196"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Opposing Interests
        </text>
      </motion.g>

      {/* Decorative dots along the spectrum */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        {[0.15, 0.3, 0.45, 0.55, 0.7, 0.85].map((t, i) => (
          <circle
            key={`dot-${i}`}
            cx={barX + barW * t}
            cy={barY + barH / 2}
            r="1.5"
            fill="var(--color-bg-elevated)"
            opacity="0.5"
          />
        ))}
      </motion.g>
    </svg>
  )
}
