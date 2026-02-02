'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MARLChallengesDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function MARLChallengesDiagram({ className = '' }: MARLChallengesDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const challenges = [
    {
      id: 'non-stationarity',
      label: 'Non-Stationarity',
      subtitle: 'Moving target problem',
      x: 90,
      y: 75,
    },
    {
      id: 'equilibrium',
      label: 'Equilibrium Selection',
      subtitle: 'Multiple equilibria',
      x: 410,
      y: 75,
    },
    {
      id: 'credit',
      label: 'Credit Assignment',
      subtitle: 'Whose action mattered?',
      x: 90,
      y: 230,
    },
    {
      id: 'scalability',
      label: 'Scalability',
      subtitle: 'Exponential joint space',
      x: 410,
      y: 230,
    },
  ];

  const boxWidth = 140;
  const boxHeight = 60;

  // Dashed connections between all 4 boxes (6 connections for a fully connected 2x2 grid)
  const connections = [
    // Top-left to Top-right
    { x1: 90 + boxWidth / 2, y1: 75, x2: 410 - boxWidth / 2, y2: 75 },
    // Bottom-left to Bottom-right
    { x1: 90 + boxWidth / 2, y1: 230, x2: 410 - boxWidth / 2, y2: 230 },
    // Top-left to Bottom-left
    { x1: 90, y1: 75 + boxHeight / 2, x2: 90, y2: 230 - boxHeight / 2 },
    // Top-right to Bottom-right
    { x1: 410, y1: 75 + boxHeight / 2, x2: 410, y2: 230 - boxHeight / 2 },
    // Top-left to Bottom-right (diagonal)
    { x1: 90 + boxWidth / 2, y1: 75 + boxHeight / 2, x2: 410 - boxWidth / 2, y2: 230 - boxHeight / 2 },
    // Top-right to Bottom-left (diagonal)
    { x1: 410 - boxWidth / 2, y1: 75 + boxHeight / 2, x2: 90 + boxWidth / 2, y2: 230 - boxHeight / 2 },
  ];

  const renderIcon = (id: string, cx: number, cy: number) => {
    const iconProps = {
      stroke: 'var(--color-accent)',
      strokeWidth: 1.8,
      fill: 'none',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    switch (id) {
      case 'non-stationarity':
        // Circular arrows (cycle/moving target)
        return (
          <g>
            <path
              d={`M ${cx - 6} ${cy - 1} A 6 6 0 1 1 ${cx + 1} ${cy - 6}`}
              {...iconProps}
            />
            <polygon
              points={`${cx + 1},${cy - 6} ${cx + 4},${cy - 4} ${cx - 1},${cy - 3}`}
              fill="var(--color-accent)"
              stroke="none"
            />
            <path
              d={`M ${cx + 6} ${cy + 1} A 6 6 0 1 1 ${cx - 1} ${cy + 6}`}
              {...iconProps}
            />
            <polygon
              points={`${cx - 1},${cy + 6} ${cx - 4},${cy + 4} ${cx + 1},${cy + 3}`}
              fill="var(--color-accent)"
              stroke="none"
            />
          </g>
        );
      case 'equilibrium':
        // Fork / branching paths
        return (
          <g>
            <line x1={cx} y1={cy + 7} x2={cx} y2={cy} {...iconProps} />
            <line x1={cx} y1={cy} x2={cx - 6} y2={cy - 7} {...iconProps} />
            <line x1={cx} y1={cy} x2={cx + 6} y2={cy - 7} {...iconProps} />
            <circle cx={cx - 6} cy={cy - 7} r="2" fill="var(--color-accent)" stroke="none" />
            <circle cx={cx + 6} cy={cy - 7} r="2" fill="var(--color-accent)" stroke="none" />
          </g>
        );
      case 'credit':
        // Question mark
        return (
          <g>
            <path
              d={`M ${cx - 3} ${cy - 5} Q ${cx - 3} ${cy - 8} ${cx} ${cy - 8} Q ${cx + 4} ${cy - 8} ${cx + 4} ${cy - 4} Q ${cx + 4} ${cy - 1} ${cx} ${cy}`}
              {...iconProps}
            />
            <circle cx={cx} cy={cy + 4} r="1.2" fill="var(--color-accent)" stroke="none" />
          </g>
        );
      case 'scalability':
        // Upward arrow with expansion lines
        return (
          <g>
            <line x1={cx} y1={cy + 7} x2={cx} y2={cy - 5} {...iconProps} />
            <polyline
              points={`${cx - 4},${cy - 2} ${cx},${cy - 7} ${cx + 4},${cy - 2}`}
              {...iconProps}
            />
            <line x1={cx - 5} y1={cy + 3} x2={cx - 8} y2={cy + 5} {...iconProps} strokeWidth={1.2} />
            <line x1={cx + 5} y1={cy + 3} x2={cx + 8} y2={cy + 5} {...iconProps} strokeWidth={1.2} />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 320"
      className={className}
      role="img"
      aria-label="MARL Challenges Diagram showing four interconnected challenges: Non-Stationarity, Equilibrium Selection, Credit Assignment, and Scalability"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs />


      {/* Dashed connecting lines between all boxes */}
      {connections.map((conn, i) => (
        <motion.line
          key={`conn-${i}`}
          x1={conn.x1}
          y1={conn.y1}
          x2={conn.x2}
          y2={conn.y2}
          stroke="var(--color-border-primary)"
          strokeWidth={1.2}
          strokeDasharray="5 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
          transition={{
            duration: 0.6,
            delay: 1.2 + i * 0.08,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Central label where lines cross */}
      <motion.g
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.5, delay: 1.9, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="200"
          y="138"
          width="100"
          height="28"
          rx="14"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="250"
          y="156"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
        >
          MARL Challenges
        </text>
      </motion.g>

      {/* Challenge boxes */}
      {challenges.map((challenge, i) => {
        const bx = challenge.x - boxWidth / 2;
        const by = challenge.y - boxHeight / 2;

        return (
          <g key={challenge.id}>
            {/* Box background */}
            <motion.rect
              x={bx}
              y={by}
              width={boxWidth}
              height={boxHeight}
              rx="8"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Icon area - small circle on the left side of the box */}
            <motion.circle
              cx={bx + 22}
              cy={challenge.y}
              r="14"
              fill="var(--color-bg-tertiary)"
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.4 + i * 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Icon */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.5 + i * 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {renderIcon(challenge.id, bx + 22, challenge.y)}
            </motion.g>

            {/* Label text */}
            <motion.text
              x={bx + 80}
              y={challenge.y - 5}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
              initial={{ opacity: 0, y: -5 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {challenge.label}
            </motion.text>

            {/* Subtitle text */}
            <motion.text
              x={bx + 80}
              y={challenge.y + 10}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.2,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {challenge.subtitle}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
