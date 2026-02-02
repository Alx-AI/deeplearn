'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface MARLTrainingLoopDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function MARLTrainingLoopDiagram({ className = '' }: MARLTrainingLoopDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Layout constants
  const envBoxX = 170
  const envBoxY = 28
  const envBoxW = 160
  const envBoxH = 52

  const agentW = 110
  const agentH = 50
  const agentY = 255
  const agentSpacing = 140
  const agent1X = 40
  const agent2X = agent1X + agentSpacing
  const agent3X = agent2X + agentSpacing

  const agents = [
    { x: agent1X, label: 'Agent 1', sub: 'policy pi_1' },
    { x: agent2X, label: 'Agent 2', sub: 'policy pi_2' },
    { x: agent3X, label: 'Agent 3', sub: 'policy pi_3' },
  ]

  // Merge point for joint actions
  const mergeY = 155
  const envBottomY = envBoxY + envBoxH
  const envCenterX = envBoxX + envBoxW / 2

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 350"
      className={className}
      role="img"
      aria-label="Multi-Agent Reinforcement Learning training loop showing three agents interacting with a shared environment through joint actions and individual observations and rewards"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Action arrow (going up, accent color) */}
        <marker
          id="marl-arrow-up"
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

        {/* Observation/reward arrow (going down, secondary color) */}
        <marker
          id="marl-arrow-down"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L7,3 z"
            fill="var(--color-text-secondary)"
          />
        </marker>

        {/* Self-loop arrow for state transition */}
        <marker
          id="marl-arrow-loop"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,0 L0,6 L7,3 z"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* Title */}
      <motion.text
        x="250"
        y="16"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Multi-Agent RL Training Loop
      </motion.text>

      {/* Environment box */}
      <motion.g
        initial={{ opacity: 0, y: -15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.6, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={envBoxX}
          y={envBoxY}
          width={envBoxW}
          height={envBoxH}
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x={envCenterX}
          y={envBoxY + 22}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          Environment
        </text>
        <text
          x={envCenterX}
          y={envBoxY + 38}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          shared state s
        </text>
      </motion.g>

      {/* State transition self-loop: curved arrow from right side of env back to itself */}
      <motion.path
        d={`M ${envBoxX + envBoxW} ${envBoxY + 15} C ${envBoxX + envBoxW + 45} ${envBoxY + 5}, ${envBoxX + envBoxW + 45} ${envBoxY + envBoxH - 5}, ${envBoxX + envBoxW} ${envBoxY + envBoxH - 15}`}
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#marl-arrow-loop)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={envBoxX + envBoxW + 48}
        y={envBoxY + envBoxH / 2 + 1}
        textAnchor="start"
        dominantBaseline="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        {"s \u2192 s'"}
      </motion.text>

      {/* Agent boxes */}
      {agents.map((agent, i) => (
        <motion.g
          key={`agent-${i}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 + i * 0.12, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={agent.x}
            y={agentY}
            width={agentW}
            height={agentH}
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x={agent.x + agentW / 2}
            y={agentY + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            {agent.label}
          </text>
          <text
            x={agent.x + agentW / 2}
            y={agentY + 36}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            {agent.sub.replace('pi_', '\u03C0')}
          </text>
        </motion.g>
      ))}

      {/* Action arrows: from each agent up to merge point, then single arrow up to environment */}
      {/* Individual action lines from agents to merge point */}
      {agents.map((agent, i) => {
        const agentCenterX = agent.x + agentW / 2
        const actionLabels = ['\u2009a\u2081', '\u2009a\u2082', '\u2009a\u2083']
        return (
          <motion.g
            key={`action-arrow-${i}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.1 + i * 0.1, ease: PRODUCTIVE_EASE }}
          >
            {/* Vertical line up from agent */}
            <motion.line
              x1={agentCenterX}
              y1={agentY}
              x2={agentCenterX}
              y2={mergeY + 12}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.4, delay: 1.1 + i * 0.1, ease: PRODUCTIVE_EASE }}
            />
            {/* Diagonal line from agent vertical to merge point center */}
            <motion.line
              x1={agentCenterX}
              y1={mergeY + 12}
              x2={envCenterX}
              y2={mergeY}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.4, delay: 1.3 + i * 0.1, ease: PRODUCTIVE_EASE }}
            />
            {/* Action label on individual lines */}
            <motion.text
              x={agentCenterX + 8}
              y={(agentY + mergeY + 12) / 2}
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 1.4 + i * 0.1, ease: PRODUCTIVE_EASE }}
            >
              {actionLabels[i]}
            </motion.text>
          </motion.g>
        )
      })}

      {/* Merge point indicator (small circle) */}
      <motion.circle
        cx={envCenterX}
        cy={mergeY}
        r="8"
        fill="var(--color-accent)"
        opacity="0.6"
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, delay: 1.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Single merged action arrow from merge point up to environment */}
      <motion.line
        x1={envCenterX}
        y1={mergeY - 5}
        x2={envCenterX}
        y2={envBottomY + 2}
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#marl-arrow-up)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Joint action label on merged arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={envCenterX + 8}
          y={mergeY - 40}
          width="85"
          height="16"
          rx="3"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="0.8"
          opacity="0.9"
        />
        <text
          x={envCenterX + 50}
          y={mergeY - 31}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
        >
          joint action a
        </text>
      </motion.g>

      {/* Observation/reward arrows: from environment down to each agent */}
      {agents.map((agent, i) => {
        const agentCenterX = agent.x + agentW / 2
        const obsLabels = ['o\u2081, r\u2081', 'o\u2082, r\u2082', 'o\u2083, r\u2083']
        // Offset the down arrows slightly to the left to separate from action arrows
        const offsetX = -12
        return (
          <motion.g
            key={`obs-arrow-${i}`}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 2.0 + i * 0.12, ease: PRODUCTIVE_EASE }}
          >
            {/* Path from environment bottom down to agent, using a slight curve */}
            <motion.path
              d={`M ${envCenterX + offsetX} ${envBottomY} C ${envCenterX + offsetX} ${envBottomY + 30}, ${agentCenterX + offsetX} ${agentY - 30}, ${agentCenterX + offsetX} ${agentY}`}
              fill="none"
              stroke="var(--color-text-secondary)"
              strokeWidth="1.5"
              strokeDasharray="5,3"
              markerEnd="url(#marl-arrow-down)"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.6, delay: 2.0 + i * 0.15, ease: PRODUCTIVE_EASE }}
            />
            {/* Observation/reward label */}
            <motion.text
              x={agentCenterX + offsetX - 8}
              y={agentY - 12}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="9"
              fontWeight="500"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 2.3 + i * 0.12, ease: PRODUCTIVE_EASE }}
            >
              {obsLabels[i]}
            </motion.text>
          </motion.g>
        )
      })}

      {/* Flow direction labels at margins */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Actions label (left side) */}
        <text
          x="18"
          y={mergeY - 20}
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
          opacity="0.7"
        >
          Actions
        </text>
        <line
          x1="22"
          y1={mergeY - 15}
          x2="22"
          y2={mergeY - 45}
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.4"
          markerEnd="url(#marl-arrow-up)"
        />

        {/* Observations label (right side) */}
        <text
          x="468"
          y={mergeY - 20}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
          opacity="0.7"
        >
          Obs
        </text>
        <line
          x1="475"
          y1={mergeY - 45}
          x2="475"
          y2={mergeY - 15}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1"
          opacity="0.4"
          markerEnd="url(#marl-arrow-down)"
        />
      </motion.g>

      {/* Bottom description */}
      <motion.text
        x="250"
        y="340"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.8, ease: PRODUCTIVE_EASE }}
      >
        Each agent receives its own observation and reward; the joint action drives the environment forward
      </motion.text>
    </svg>
  )
}
