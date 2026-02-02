'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ThreeIngredientsCard
 *
 * The three ingredients of Machine Learning:
 *   1. Input Data
 *   2. Expected Outputs
 *   3. Feedback Signal
 *
 * Each card staggers in from left to right with a subtle icon,
 * label, and connecting arrows between them.
 */

interface ThreeIngredientsCardProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

/** Card configuration */
const ingredients = [
  {
    title: 'Input Data',
    subtitle: 'Examples to learn from',
    /** Simple database / stack icon */
    icon: (cx: number, cy: number) => (
      <g>
        <ellipse
          cx={cx}
          cy={cy - 8}
          rx={14}
          ry={5}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <path
          d={`M ${cx - 14} ${cy - 8} v 10 a 14 5 0 0 0 28 0 v -10`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <ellipse
          cx={cx}
          cy={cy + 2}
          rx={14}
          ry={5}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="0"
          opacity={0.4}
        />
      </g>
    ),
  },
  {
    title: 'Expected Outputs',
    subtitle: 'What correct looks like',
    /** Target / bullseye icon */
    icon: (cx: number, cy: number) => (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={14}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <circle cx={cx} cy={cy} r={2.5} fill="currentColor" />
      </g>
    ),
  },
  {
    title: 'Feedback Signal',
    subtitle: 'How far off the model is',
    /** Loop / refresh icon */
    icon: (cx: number, cy: number) => (
      <g>
        <path
          d={`M ${cx - 10} ${cy - 2} A 10 10 0 1 1 ${cx + 2} ${cy + 10}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <polyline
          points={`${cx - 1},${cy + 6} ${cx + 2},${cy + 10} ${cx + 6},${cy + 7}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    ),
  },
] as const;

const CARD_WIDTH = 150;
const CARD_HEIGHT = 130;
const CARD_GAP = 40;
const CARD_Y = 30;
const ICON_CY = CARD_Y + 40;

/** Animated connecting arrow between cards */
function ConnectorArrow({
  x1,
  x2,
  y,
  delay,
  isInView,
}: {
  x1: number;
  x2: number;
  y: number;
  delay: number;
  isInView: boolean;
}) {
  const headSize = 5;

  return (
    <g>
      <motion.line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="var(--color-border-primary)"
        strokeWidth={1}
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 0.7 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points={`${x2},${y} ${x2 - headSize},${y - headSize * 0.6} ${x2 - headSize},${y + headSize * 0.6}`}
        fill="var(--color-border-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.3, ease: PRODUCTIVE_EASE }}
      />
    </g>
  );
}

export default function ThreeIngredientsCard({
  className = '',
}: ThreeIngredientsCardProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const totalWidth =
    ingredients.length * CARD_WIDTH +
    (ingredients.length - 1) * CARD_GAP +
    40; // padding

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${totalWidth} ${CARD_HEIGHT + 60}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="The three ingredients of Machine Learning: Input Data, Expected Outputs, and Feedback Signal"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      {ingredients.map((ingredient, i) => {
        const x = 20 + i * (CARD_WIDTH + CARD_GAP);
        const cardDelay = 0.15 + i * 0.25;
        const iconCx = x + CARD_WIDTH / 2;
        const isLast = i === ingredients.length - 1;

        return (
          <g key={ingredient.title}>
            {/* Card background */}
            <motion.rect
              x={x}
              y={CARD_Y}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              rx={8}
              fill="var(--color-bg-elevated)"
              stroke={
                isLast
                  ? 'var(--color-accent)'
                  : 'var(--color-border-primary)'
              }
              strokeWidth={isLast ? 1.5 : 1}
              initial={{ opacity: 0, y: 12 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 12 }
              }
              transition={{
                duration: 0.6,
                delay: cardDelay,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Step number badge */}
            <motion.circle
              cx={x + 20}
              cy={CARD_Y + 16}
              r={9}
              fill={
                isLast
                  ? 'var(--color-accent)'
                  : 'var(--color-bg-tertiary)'
              }
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: cardDelay + 0.15,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${x + 20}px ${CARD_Y + 16}px`,
              }}
            />
            <motion.text
              x={x + 20}
              y={CARD_Y + 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={
                isLast
                  ? 'var(--color-text-inverse)'
                  : 'var(--color-text-secondary)'
              }
              fontSize={10}
              fontWeight={600}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: cardDelay + 0.25,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {i + 1}
            </motion.text>

            {/* Icon */}
            <motion.g
              color={
                isLast
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)'
              }
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.5,
                delay: cardDelay + 0.2,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${iconCx}px ${ICON_CY}px`,
              }}
            >
              {ingredient.icon(iconCx, ICON_CY)}
            </motion.g>

            {/* Title */}
            <motion.text
              x={iconCx}
              y={CARD_Y + 82}
              textAnchor="middle"
              fill={
                isLast
                  ? 'var(--color-accent)'
                  : 'var(--color-text-primary)'
              }
              fontSize={12}
              fontWeight={600}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: cardDelay + 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {ingredient.title}
            </motion.text>

            {/* Subtitle */}
            <motion.text
              x={iconCx}
              y={CARD_Y + 98}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize={9}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: cardDelay + 0.4,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {ingredient.subtitle}
            </motion.text>

            {/* Connector arrow to next card */}
            {i < ingredients.length - 1 && (
              <ConnectorArrow
                x1={x + CARD_WIDTH + 4}
                x2={x + CARD_WIDTH + CARD_GAP - 4}
                y={CARD_Y + CARD_HEIGHT / 2}
                delay={cardDelay + 0.4}
                isInView={isInView}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
