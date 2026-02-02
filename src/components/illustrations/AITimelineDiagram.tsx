'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * AITimelineDiagram
 *
 * Horizontal timeline from the 1950s to the 2020s showing key AI milestones.
 * All milestone labels are positioned above the line for clarity, with
 * AI Winter annotations below to avoid overlap.
 */

interface AITimelineDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const milestones = [
  { year: '1956', label: 'Dartmouth', sublabel: 'AI coined', x: 70 },
  { year: '1980s', label: 'Expert Systems', sublabel: 'Symbolic AI', x: 210 },
  { year: '1990s', label: 'ML Emerges', sublabel: 'Statistical methods', x: 370 },
  { year: '2012', label: 'Deep Learning', sublabel: 'AlexNet moment', x: 530 },
  { year: '2020s', label: 'LLMs & Gen AI', sublabel: 'Foundation models', x: 680 },
] as const;

const TIMELINE_Y = 120;
const LINE_START = 30;
const LINE_END = 740;
const DOT_RADIUS = 5;

export default function AITimelineDiagram({
  className = '',
}: AITimelineDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 770 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Timeline of key milestones in the history of Artificial Intelligence from 1956 to the 2020s"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* ── Main timeline line ── */}
      <motion.line
        x1={LINE_START}
        y1={TIMELINE_Y}
        x2={LINE_END}
        y2={TIMELINE_Y}
        stroke="var(--color-border-primary)"
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* ── "AI Winter" shaded regions (below the line) ── */}
      {[
        { x: 140, w: 56, labelX: 168, delay: 0.8 },
        { x: 275, w: 70, labelX: 310, delay: 1.2 },
      ].map((winter, wi) => (
        <g key={wi}>
          <motion.rect
            x={winter.x}
            y={TIMELINE_Y + 12}
            width={winter.w}
            height={20}
            rx={4}
            fill="var(--color-bg-tertiary)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.45 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: winter.delay, ease: PRODUCTIVE_EASE }}
          />
          <motion.text
            x={winter.labelX}
            y={TIMELINE_Y + 48}
            textAnchor="middle"
            fill="var(--color-text-disabled)"
            fontSize={8}
            fontFamily="var(--font-sans)"
            fontStyle="italic"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: winter.delay + 0.3, ease: PRODUCTIVE_EASE }}
          >
            AI Winter
          </motion.text>
        </g>
      ))}

      {/* ── Exponential growth curve after 2012 ── */}
      <motion.path
        d={`M 530 ${TIMELINE_Y - 18} Q 610 ${TIMELINE_Y - 50} 680 ${TIMELINE_Y - 56}`}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 2.0, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Milestone nodes (all labels above the line) ── */}
      {milestones.map((m, i) => {
        const isAccent = i >= 3;
        const nodeDelay = 0.3 + i * 0.35;

        return (
          <g key={m.year}>
            {/* Vertical tick */}
            <motion.line
              x1={m.x}
              y1={TIMELINE_Y - 8}
              x2={m.x}
              y2={TIMELINE_Y + 8}
              stroke={isAccent ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: nodeDelay, ease: PRODUCTIVE_EASE }}
            />

            {/* Dot */}
            <motion.circle
              cx={m.x}
              cy={TIMELINE_Y}
              r={DOT_RADIUS}
              fill={isAccent ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.1, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: `${m.x}px ${TIMELINE_Y}px` }}
            />

            {/* Glow ring for accent nodes */}
            {isAccent && (
              <motion.circle
                cx={m.x}
                cy={TIMELINE_Y}
                r={DOT_RADIUS + 4}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={1}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 0.3 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.4, delay: nodeDelay + 0.2, ease: PRODUCTIVE_EASE }}
                style={{ transformOrigin: `${m.x}px ${TIMELINE_Y}px` }}
              />
            )}

            {/* Connector line from dot up to label area */}
            <motion.line
              x1={m.x}
              y1={TIMELINE_Y - 8}
              x2={m.x}
              y2={TIMELINE_Y - 24}
              stroke={isAccent ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              strokeWidth={0.75}
              strokeOpacity={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.2, delay: nodeDelay + 0.15, ease: PRODUCTIVE_EASE }}
            />

            {/* Year label (above) */}
            <motion.text
              x={m.x}
              y={TIMELINE_Y - 30}
              textAnchor="middle"
              fill={isAccent ? 'var(--color-accent)' : 'var(--color-text-primary)'}
              fontSize={11}
              fontWeight={600}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0, y: 4 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.2, ease: PRODUCTIVE_EASE }}
            >
              {m.year}
            </motion.text>

            {/* Description label (above year) */}
            <motion.text
              x={m.x}
              y={TIMELINE_Y - 44}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize={10}
              fontWeight={400}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: nodeDelay + 0.35, ease: PRODUCTIVE_EASE }}
            >
              {m.label}
            </motion.text>

            {/* Sublabel */}
            <motion.text
              x={m.x}
              y={TIMELINE_Y - 56}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize={8}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: nodeDelay + 0.45, ease: PRODUCTIVE_EASE }}
            >
              {m.sublabel}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
