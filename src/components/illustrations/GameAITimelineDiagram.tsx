'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * GameAITimelineDiagram
 *
 * Horizontal timeline of key MARL game AI achievements from 1994 to 2022.
 * Milestone labels alternate above and below the timeline for clarity.
 * Each milestone dot and label animates in from left to right with staggered delays.
 */

interface GameAITimelineDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const milestones = [
  { year: '1994', name: 'TD-Gammon', game: 'Backgammon', x: 60, above: true },
  { year: '2016', name: 'AlphaGo', game: 'Go', x: 155, above: false },
  { year: '2018', name: 'AlphaZero', game: 'Chess, Shogi, Go', x: 265, above: true },
  { year: '2019', name: 'AlphaStar', game: 'StarCraft II', x: 355, above: false },
  { year: '2019', name: 'Pluribus', game: 'Poker', x: 435, above: true },
  { year: '2022', name: 'Cicero', game: 'Diplomacy', x: 540, above: false },
] as const;

const TIMELINE_Y = 115;
const LINE_START = 25;
const LINE_END = 580;
const DOT_RADIUS = 5;

/* Small symbolic game icons rendered as minimal SVG shapes */
function GameIcon({ type, x, y }: { type: string; x: number; y: number }) {
  const stroke = 'var(--color-text-tertiary)';
  const fill = 'none';
  const sw = 1;

  switch (type) {
    case 'Backgammon':
      return (
        <g>
          {/* Dice face */}
          <rect x={x - 5} y={y - 5} width="10" height="10" rx="1.5" stroke={stroke} strokeWidth={sw} fill={fill} />
          <circle cx={x - 2} cy={y - 2} r="0.8" fill={stroke} />
          <circle cx={x + 2} cy={y + 2} r="0.8" fill={stroke} />
          <circle cx={x} cy={y} r="0.8" fill={stroke} />
        </g>
      );
    case 'Go':
      return (
        <g>
          {/* Go board with stones */}
          <rect x={x - 6} y={y - 6} width="12" height="12" rx="1" stroke={stroke} strokeWidth={sw} fill={fill} />
          <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke={stroke} strokeWidth="0.5" />
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={stroke} strokeWidth="0.5" />
          <circle cx={x - 3} cy={y - 3} r="2" fill={stroke} />
          <circle cx={x + 3} cy={y + 3} r="2" fill="var(--color-bg-elevated)" stroke={stroke} strokeWidth="0.8" />
        </g>
      );
    case 'Chess, Shogi, Go':
      return (
        <g>
          {/* Simplified chess piece (king crown) */}
          <path
            d={`M ${x - 4} ${y + 5} L ${x - 5} ${y - 1} L ${x - 2} ${y + 1} L ${x} ${y - 5} L ${x + 2} ${y + 1} L ${x + 5} ${y - 1} L ${x + 4} ${y + 5} Z`}
            stroke={stroke}
            strokeWidth={sw}
            fill={fill}
            strokeLinejoin="round"
          />
        </g>
      );
    case 'StarCraft II':
      return (
        <g>
          {/* Simplified spaceship / diamond */}
          <path
            d={`M ${x} ${y - 6} L ${x + 5} ${y} L ${x} ${y + 6} L ${x - 5} ${y} Z`}
            stroke={stroke}
            strokeWidth={sw}
            fill={fill}
          />
          <circle cx={x} cy={y} r="1.5" fill={stroke} />
        </g>
      );
    case 'Poker':
      return (
        <g>
          {/* Card shape */}
          <rect x={x - 4} y={y - 6} width="8" height="12" rx="1" stroke={stroke} strokeWidth={sw} fill={fill} />
          {/* Spade shape simplified */}
          <path
            d={`M ${x} ${y - 3} L ${x + 2} ${y} Q ${x + 2} ${y + 2} ${x} ${y + 1} Q ${x - 2} ${y + 2} ${x - 2} ${y} Z`}
            fill={stroke}
          />
        </g>
      );
    case 'Diplomacy':
      return (
        <g>
          {/* Globe / world */}
          <circle cx={x} cy={y} r="6" stroke={stroke} strokeWidth={sw} fill={fill} />
          <ellipse cx={x} cy={y} rx="3" ry="6" stroke={stroke} strokeWidth="0.5" fill={fill} />
          <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={stroke} strokeWidth="0.5" />
        </g>
      );
    default:
      return null;
  }
}

export default function GameAITimelineDiagram({ className = '' }: GameAITimelineDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 220"
      className={className}
      role="img"
      aria-label="Timeline of MARL game AI achievements from TD-Gammon in 1994 to Cicero in 2022"
      style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
    >
      <defs>
        <marker
          id="gameai-timeline-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <path d="M 0 0 L 8 3 L 0 6 Z" fill="var(--color-border-primary)" />
        </marker>
      </defs>

      {/* ── Main timeline line ── */}
      <motion.line
        x1={LINE_START}
        y1={TIMELINE_Y}
        x2={LINE_END}
        y2={TIMELINE_Y}
        stroke="var(--color-border-primary)"
        strokeWidth={1.5}
        strokeLinecap="round"
        markerEnd="url(#gameai-timeline-arrow)"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.2, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Era shading: classical vs deep RL ── */}
      <motion.rect
        x={60}
        y={TIMELINE_Y - 3}
        width={80}
        height={6}
        rx={3}
        fill="var(--color-text-tertiary)"
        fillOpacity="0.12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      />
      <motion.rect
        x={155}
        y={TIMELINE_Y - 3}
        width={390}
        height={6}
        rx={3}
        fill="var(--color-accent)"
        fillOpacity="0.08"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Era labels ── */}
      <motion.text
        x={100}
        y={TIMELINE_Y + 43}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        Classical RL
      </motion.text>
      <motion.text
        x={370}
        y={TIMELINE_Y + 43}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontStyle="italic"
        fillOpacity="0.6"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Deep RL Era
      </motion.text>

      {/* ── Milestone nodes ── */}
      {milestones.map((m, i) => {
        const nodeDelay = 0.4 + i * 0.18;
        const isDeepRL = i >= 1;
        const labelY = m.above ? TIMELINE_Y - 30 : TIMELINE_Y + 32;
        const yearY = m.above ? TIMELINE_Y - 18 : TIMELINE_Y + 22;
        const connectorEnd = m.above ? TIMELINE_Y - 14 : TIMELINE_Y + 14;
        const iconY = m.above ? TIMELINE_Y - 56 : TIMELINE_Y + 50;

        return (
          <g key={`${m.year}-${m.name}`}>
            {/* Connector line from dot to label area */}
            <motion.line
              x1={m.x}
              y1={TIMELINE_Y}
              x2={m.x}
              y2={connectorEnd}
              stroke={isDeepRL ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              strokeWidth={0.75}
              strokeOpacity={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: nodeDelay, ease: PRODUCTIVE_EASE }}
            />

            {/* Dot */}
            <motion.circle
              cx={m.x}
              cy={TIMELINE_Y}
              r={DOT_RADIUS}
              fill={isDeepRL ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.05, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: `${m.x}px ${TIMELINE_Y}px` }}
            />

            {/* Glow ring for deep RL milestones */}
            {isDeepRL && (
              <motion.circle
                cx={m.x}
                cy={TIMELINE_Y}
                r={DOT_RADIUS + 4}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 0.25 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: nodeDelay + 0.1, ease: PRODUCTIVE_EASE }}
                style={{ transformOrigin: `${m.x}px ${TIMELINE_Y}px` }}
              />
            )}

            {/* Year label */}
            <motion.text
              x={m.x}
              y={yearY}
              textAnchor="middle"
              fill={isDeepRL ? 'var(--color-accent)' : 'var(--color-text-primary)'}
              fontSize={10}
              fontWeight={600}
              initial={{ opacity: 0, y: m.above ? 4 : -4 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: m.above ? 4 : -4 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.15, ease: PRODUCTIVE_EASE }}
            >
              {m.year}
            </motion.text>

            {/* Name label */}
            <motion.text
              x={m.x}
              y={labelY}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize={11}
              fontWeight={600}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.25, ease: PRODUCTIVE_EASE }}
            >
              {m.name}
            </motion.text>

            {/* Game label */}
            <motion.text
              x={m.x}
              y={m.above ? labelY - 13 : labelY + 13}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize={9}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.85 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: nodeDelay + 0.35, ease: PRODUCTIVE_EASE }}
            >
              {m.game}
            </motion.text>

            {/* Game icon */}
            <motion.g
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.4, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: `${m.x}px ${iconY}px` }}
            >
              <GameIcon type={m.game} x={m.x} y={iconY} />
            </motion.g>
          </g>
        );
      })}

      {/* ── Progress accent line along deep RL section ── */}
      <motion.line
        x1={155}
        y1={TIMELINE_Y}
        x2={540}
        y2={TIMELINE_Y}
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeOpacity={0.3}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
      />
    </svg>
  );
}
