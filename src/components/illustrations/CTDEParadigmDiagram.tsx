'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface CTDEParadigmDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function CTDEParadigmDiagram({
  className,
}: CTDEParadigmDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const panelW = 260
  const panelH = 270
  const leftX = 15
  const rightX = 325
  const panelY = 38

  // Agent positions within each panel
  const agentSpacing = 74
  const agentStartX = 30
  const agentY = 195

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 320"
      role="img"
      aria-label="Centralized Training Decentralized Execution paradigm diagram showing how agents train with a central learner but execute independently with local policies"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrow markers with unique IDs */}
        <marker
          id="ctde-arrow-down"
          markerWidth="8"
          markerHeight="6"
          refX="4"
          refY="6"
          orient="auto"
        >
          <polygon
            points="0 0, 8 0, 4 6"
            fill="var(--color-accent)"
          />
        </marker>
        <marker
          id="ctde-arrow-up"
          markerWidth="8"
          markerHeight="6"
          refX="4"
          refY="0"
          orient="auto"
        >
          <polygon
            points="0 6, 8 6, 4 0"
            fill="var(--color-text-secondary)"
          />
        </marker>
        <marker
          id="ctde-arrow-right"
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

      {/* Title */}
      <motion.text
        x="300"
        y="24"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Centralized Training, Decentralized Execution (CTDE)
      </motion.text>

      {/* ============ LEFT PANEL: TRAINING ============ */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.6, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background - simulation tint */}
        <rect
          x={leftX}
          y={panelY}
          width={panelW}
          height={panelH}
          rx="8"
          fill="var(--color-accent)"
          opacity="0.04"
        />
        <rect
          x={leftX}
          y={panelY}
          width={panelW}
          height={panelH}
          rx="8"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.3"
        />

        {/* Panel header */}
        <motion.text
          x={leftX + panelW / 2}
          y={panelY + 20}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="12"
          fontWeight="700"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          Training Phase
        </motion.text>
        <motion.text
          x={leftX + panelW / 2}
          y={panelY + 33}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          In Simulation
        </motion.text>

        {/* Central Learner box */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={leftX + 55}
            y={panelY + 48}
            width="150"
            height="40"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          {/* Brain / network icon inside */}
          <g transform={`translate(${leftX + 68}, ${panelY + 56})`}>
            <circle cx="4" cy="4" r="2.5" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
            <circle cx="12" cy="2" r="2.5" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
            <circle cx="8" cy="10" r="2.5" fill="none" stroke="var(--color-accent)" strokeWidth="1" opacity="0.6" />
            <line x1="6" y1="4" x2="10" y2="3" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.5" />
            <line x1="5" y1="6" x2="7" y2="8" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.5" />
            <line x1="11" y1="5" x2="9" y2="8" stroke="var(--color-accent)" strokeWidth="0.8" opacity="0.5" />
          </g>
          <text
            x={leftX + 130}
            y={panelY + 65}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            Central Learner
          </text>
          <text
            x={leftX + 130}
            y={panelY + 78}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            Global State Access
          </text>
        </motion.g>

        {/* Arrows: Central Learner down to Agents (updated policies) */}
        {[0, 1, 2].map((i) => {
          const agentCenterX = leftX + agentStartX + i * agentSpacing + 33
          const learnerBottomY = panelY + 88
          const agentTopY = panelY + agentY - panelY + 12

          return (
            <motion.g
              key={`down-arrow-${i}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {/* Down arrow: policies */}
              <motion.line
                x1={agentCenterX - 6}
                y1={learnerBottomY + 4}
                x2={agentCenterX - 6}
                y2={agentTopY - 6}
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                markerEnd="url(#ctde-arrow-down)"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + i * 0.1,
                  ease: PRODUCTIVE_EASE,
                }}
              />

              {/* Up arrow: data */}
              <motion.line
                x1={agentCenterX + 6}
                y1={agentTopY - 6}
                x2={agentCenterX + 6}
                y2={learnerBottomY + 4}
                stroke="var(--color-text-secondary)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                markerEnd="url(#ctde-arrow-up)"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + i * 0.1,
                  ease: PRODUCTIVE_EASE,
                }}
              />
            </motion.g>
          )
        })}

        {/* Arrow legends in training panel */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          {/* Down arrow legend */}
          <line
            x1={leftX + 18}
            y1={panelY + 118}
            x2={leftX + 18}
            y2={panelY + 130}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <polygon
            points={`${leftX + 14},${panelY + 130} ${leftX + 22},${panelY + 130} ${leftX + 18},${panelY + 135}`}
            fill="var(--color-accent)"
          />
          <text
            x={leftX + 26}
            y={panelY + 130}
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            Policies
          </text>

          {/* Up arrow legend */}
          <line
            x1={leftX + 18}
            y1={panelY + 148}
            x2={leftX + 18}
            y2={panelY + 139}
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <polygon
            points={`${leftX + 14},${panelY + 139} ${leftX + 22},${panelY + 139} ${leftX + 18},${panelY + 134}`}
            fill="var(--color-text-secondary)"
          />
          <text
            x={leftX + 26}
            y={panelY + 147}
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            obs, acts, rewards
          </text>
        </motion.g>

        {/* Agent boxes in training */}
        {[0, 1, 2].map((i) => {
          const ax = leftX + agentStartX + i * agentSpacing
          const ay = panelY + 155

          return (
            <motion.g
              key={`train-agent-${i}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <rect
                x={ax}
                y={ay}
                width="66"
                height="44"
                rx="8"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />
              {/* Agent icon: small circle head + body */}
              <circle
                cx={ax + 18}
                cy={ay + 14}
                r="5"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <path
                d={`M ${ax + 13} ${ay + 24} Q ${ax + 18} ${ay + 20}, ${ax + 23} ${ay + 24}`}
                stroke="var(--color-accent)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />
              <text
                x={ax + 43}
                y={ay + 17}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                fontSize="10"
                fontWeight="600"
              >
                Agent {i + 1}
              </text>
              <text
                x={ax + 33}
                y={ay + 33}
                textAnchor="middle"
                fill="var(--color-text-tertiary)"
                fontSize="9"
              >
                {'\u03C0'}{String.fromCharCode(8321 + i)}
              </text>
            </motion.g>
          )
        })}

        {/* Shared environment label at bottom of training panel */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={leftX + 50}
            y={panelY + 210}
            width="160"
            height="20"
            rx="4"
            fill="var(--color-accent)"
            opacity="0.08"
          />
          <text
            x={leftX + panelW / 2}
            y={panelY + 224}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
          >
            Shared Environment
          </text>
        </motion.g>
      </motion.g>

      {/* ============ DIVIDER ARROW ============ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {/* Vertical dashed divider */}
        <line
          x1="300"
          y1={panelY + 10}
          x2="300"
          y2={panelY + panelH - 10}
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          strokeDasharray="6 4"
          opacity="0.4"
        />

        {/* Horizontal transition arrow */}
        <motion.line
          x1="282"
          y1={panelY + panelH / 2}
          x2="316"
          y2={panelY + panelH / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          markerEnd="url(#ctde-arrow-right)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: PRODUCTIVE_EASE }}
        />

        {/* Arrow label */}
        <motion.text
          x="300"
          y={panelY + panelH / 2 - 10}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          Deploy
        </motion.text>
      </motion.g>

      {/* ============ RIGHT PANEL: EXECUTION ============ */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background - real world tint */}
        <rect
          x={rightX}
          y={panelY}
          width={panelW}
          height={panelH}
          rx="8"
          fill="var(--color-text-tertiary)"
          opacity="0.04"
        />
        <rect
          x={rightX}
          y={panelY}
          width={panelW}
          height={panelH}
          rx="8"
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Panel header */}
        <motion.text
          x={rightX + panelW / 2}
          y={panelY + 20}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="700"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
        >
          Execution Phase
        </motion.text>
        <motion.text
          x={rightX + panelW / 2}
          y={panelY + 33}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          In Real World
        </motion.text>

        {/* "No Central Controller" placeholder where central learner would be */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={rightX + 55}
            y={panelY + 48}
            width="150"
            height="40"
            rx="8"
            fill="none"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
            strokeDasharray="6 3"
            opacity="0.3"
          />
          {/* X mark */}
          <line
            x1={rightX + 115}
            y1={panelY + 58}
            x2={rightX + 145}
            y2={panelY + 78}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            opacity="0.3"
            strokeLinecap="round"
          />
          <line
            x1={rightX + 145}
            y1={panelY + 58}
            x2={rightX + 115}
            y2={panelY + 78}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            opacity="0.3"
            strokeLinecap="round"
          />
          <text
            x={rightX + 90}
            y={panelY + 72}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            opacity="0.5"
          >
            No Central
          </text>
          <text
            x={rightX + 90}
            y={panelY + 82}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            opacity="0.5"
          >
            Controller
          </text>
        </motion.g>

        {/* Agent boxes in execution with local policies */}
        {[0, 1, 2].map((i) => {
          const ax = rightX + agentStartX + i * agentSpacing
          const ay = panelY + 130

          return (
            <motion.g
              key={`exec-agent-${i}`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{
                duration: 0.5,
                delay: 1.4 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <rect
                x={ax}
                y={ay}
                width="66"
                height="60"
                rx="8"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />

              {/* Agent icon */}
              <circle
                cx={ax + 18}
                cy={ay + 14}
                r="5"
                fill="none"
                stroke="var(--color-text-secondary)"
                strokeWidth="1.2"
                opacity="0.6"
              />
              <path
                d={`M ${ax + 13} ${ay + 24} Q ${ax + 18} ${ay + 20}, ${ax + 23} ${ay + 24}`}
                stroke="var(--color-text-secondary)"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />

              <text
                x={ax + 43}
                y={ay + 17}
                textAnchor="middle"
                fill="var(--color-text-primary)"
                fontSize="10"
                fontWeight="600"
              >
                Agent {i + 1}
              </text>

              {/* Local policy chip */}
              <rect
                x={ax + 8}
                y={ay + 32}
                width="50"
                height="18"
                rx="4"
                fill="var(--color-accent)"
                opacity="0.1"
              />
              <rect
                x={ax + 8}
                y={ay + 32}
                width="50"
                height="18"
                rx="4"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.4"
              />
              <text
                x={ax + 33}
                y={ay + 44}
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="9"
                fontWeight="600"
              >
                Local {'\u03C0'}{String.fromCharCode(8321 + i)}
              </text>
            </motion.g>
          )
        })}

        {/* Dashed lines between agents with X marks (no communication) */}
        {[0, 1].map((i) => {
          const ax1 = rightX + agentStartX + i * agentSpacing + 66
          const ax2 = rightX + agentStartX + (i + 1) * agentSpacing
          const midX = (ax1 + ax2) / 2
          const lineY = panelY + 160

          return (
            <motion.g
              key={`no-comm-${i}`}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 1.7 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {/* Dashed line */}
              <line
                x1={ax1 + 2}
                y1={lineY}
                x2={ax2 - 2}
                y2={lineY}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.4"
              />

              {/* X mark on the line */}
              <line
                x1={midX - 4}
                y1={lineY - 4}
                x2={midX + 4}
                y2={lineY + 4}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1={midX + 4}
                y1={lineY - 4}
                x2={midX - 4}
                y2={lineY + 4}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.6"
              />
            </motion.g>
          )
        })}

        {/* "No Communication" label */}
        <motion.text
          x={rightX + panelW / 2}
          y={panelY + 210}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
        >
          No Communication Between Agents
        </motion.text>

        {/* Independent environment label */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.9, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={rightX + 50}
            y={panelY + 225}
            width="160"
            height="20"
            rx="4"
            fill="var(--color-text-tertiary)"
            opacity="0.06"
          />
          <text
            x={rightX + panelW / 2}
            y={panelY + 239}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontWeight="500"
          >
            Real Environment
          </text>
        </motion.g>
      </motion.g>

      {/* Bottom annotation spanning both panels */}
      <motion.text
        x="300"
        y="314"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        Agents learn jointly but act independently using only local observations
      </motion.text>
    </svg>
  )
}
