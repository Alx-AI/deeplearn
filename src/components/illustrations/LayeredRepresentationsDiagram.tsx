'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * LayeredRepresentationsDiagram
 *
 * Illustrates how deep learning models learn layered representations --
 * each layer transforms data into increasingly abstract features.
 * For digit recognition: raw pixels -> edges -> shapes -> parts -> digit classes.
 * A horizontal pipeline of 5 stages flows left to right with arrows
 * labeled "Layer 1", "Layer 2", etc. A subtitle reads "Information Distillation".
 */

interface LayeredRepresentationsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const stages = [
  { label: 'Pixels', x: 30 },
  { label: 'Edges', x: 140 },
  { label: 'Shapes', x: 250 },
  { label: 'Parts', x: 360 },
  { label: 'Classes', x: 470 },
] as const;

export default function LayeredRepresentationsDiagram({
  className = '',
}: LayeredRepresentationsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const boxW = 72;
  const boxH = 90;
  const boxY = 36;
  const boxRx = 6;

  // 5x5 pixel grid pattern for a "3"-like digit
  const pixelGrid = [
    [1, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 560 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Layered representations diagram showing how deep learning transforms raw pixels through edges, shapes, and parts into digit classes"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <marker
          id="arrowhead-layered-repr"
          markerWidth="7"
          markerHeight="5"
          refX="6"
          refY="2.5"
          orient="auto"
        >
          <polygon
            points="0 0, 7 2.5, 0 5"
            fill="var(--color-text-tertiary)"
            opacity="0.6"
          />
        </marker>
      </defs>

      {/* Stage boxes */}
      {stages.map((stage, i) => (
        <motion.rect
          key={`box-${stage.label}`}
          x={stage.x}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={boxRx}
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{
            duration: 0.5,
            delay: i * 0.2,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Stage 1: Pixels -- small 5x5 grid */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {pixelGrid.map((row, ry) =>
          row.map((cell, cx) => (
            <rect
              key={`px-${ry}-${cx}`}
              x={stages[0].x + 13 + cx * 10}
              y={boxY + 14 + ry * 10}
              width="8"
              height="8"
              rx="1"
              fill={
                cell
                  ? 'var(--color-accent)'
                  : 'var(--color-border-primary)'
              }
              opacity={cell ? 0.85 : 0.2}
            />
          ))
        )}
      </motion.g>

      {/* Stage 2: Edges -- small line/edge patterns */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: PRODUCTIVE_EASE }}
      >
        {/* Horizontal edge */}
        <line
          x1={stages[1].x + 14}
          y1={boxY + 22}
          x2={stages[1].x + 58}
          y2={boxY + 22}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Vertical edge */}
        <line
          x1={stages[1].x + 36}
          y1={boxY + 16}
          x2={stages[1].x + 36}
          y2={boxY + 46}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Diagonal edge */}
        <line
          x1={stages[1].x + 16}
          y1={boxY + 50}
          x2={stages[1].x + 44}
          y2={boxY + 32}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Another diagonal */}
        <line
          x1={stages[1].x + 44}
          y1={boxY + 50}
          x2={stages[1].x + 58}
          y2={boxY + 38}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Short horizontal */}
        <line
          x1={stages[1].x + 16}
          y1={boxY + 64}
          x2={stages[1].x + 38}
          y2={boxY + 64}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Short vertical */}
        <line
          x1={stages[1].x + 52}
          y1={boxY + 54}
          x2={stages[1].x + 52}
          y2={boxY + 72}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />
      </motion.g>

      {/* Stage 3: Shapes -- circles, curves, loops */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: PRODUCTIVE_EASE }}
      >
        {/* Circle */}
        <circle
          cx={stages[2].x + 24}
          cy={boxY + 28}
          r="10"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* Curve / arc */}
        <path
          d={`M ${stages[2].x + 42} ${boxY + 18} Q ${stages[2].x + 60} ${boxY + 30} ${stages[2].x + 42} ${boxY + 42}`}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Small loop */}
        <ellipse
          cx={stages[2].x + 28}
          cy={boxY + 58}
          rx="12"
          ry="8"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* S-curve */}
        <path
          d={`M ${stages[2].x + 48} ${boxY + 50} Q ${stages[2].x + 58} ${boxY + 56} ${stages[2].x + 48} ${boxY + 64} Q ${stages[2].x + 38} ${boxY + 72} ${stages[2].x + 48} ${boxY + 78}`}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </motion.g>

      {/* Stage 4: Parts -- recognizable digit sub-structures */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.75, ease: PRODUCTIVE_EASE }}
      >
        {/* Top loop of an "8" or "6" */}
        <circle
          cx={stages[3].x + 22}
          cy={boxY + 24}
          r="9"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          opacity="0.75"
        />
        {/* Vertical stroke of a "1" or "7" */}
        <line
          x1={stages[3].x + 50}
          y1={boxY + 16}
          x2={stages[3].x + 50}
          y2={boxY + 44}
          stroke="var(--color-text-secondary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* Horizontal crossbar */}
        <line
          x1={stages[3].x + 38}
          y1={boxY + 22}
          x2={stages[3].x + 58}
          y2={boxY + 22}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Bottom loop */}
        <circle
          cx={stages[3].x + 22}
          cy={boxY + 56}
          r="10"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.8"
          opacity="0.65"
        />
        {/* Tail / descender */}
        <path
          d={`M ${stages[3].x + 44} ${boxY + 50} Q ${stages[3].x + 56} ${boxY + 62} ${stages[3].x + 44} ${boxY + 74}`}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      </motion.g>

      {/* Stage 5: Classes -- digit labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.95, ease: PRODUCTIVE_EASE }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const dx = stages[4].x + 8 + col * 12;
          const dy = boxY + 20 + row * 34;
          const isHighlighted = d === 3;
          return (
            <text
              key={`digit-${d}`}
              x={dx}
              y={dy}
              fontSize="11"
              fontWeight={isHighlighted ? 700 : 400}
              fontFamily="var(--font-sans)"
              fill={
                isHighlighted
                  ? 'var(--color-accent)'
                  : 'var(--color-text-tertiary)'
              }
              opacity={isHighlighted ? 1 : 0.6}
            >
              {d}
            </text>
          );
        })}
        {/* Highlight box around "3" */}
        <rect
          x={stages[4].x + 40}
          y={boxY + 8}
          width="16"
          height="16"
          rx="3"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.45"
        />
      </motion.g>

      {/* Stage labels below boxes */}
      {stages.map((stage, i) => (
        <motion.text
          key={`label-${stage.label}`}
          x={stage.x + boxW / 2}
          y={boxY + boxH + 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight={600}
          fontFamily="var(--font-sans)"
          fill="var(--color-text-primary)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: i * 0.2 + 0.15,
            ease: PRODUCTIVE_EASE,
          }}
        >
          {stage.label}
        </motion.text>
      ))}

      {/* Arrows between stages with "Layer N" labels */}
      {[0, 1, 2, 3].map((i) => {
        const x1 = stages[i].x + boxW + 2;
        const x2 = stages[i + 1].x - 2;
        const arrowY = boxY + boxH / 2;
        const midX = (x1 + x2) / 2;

        return (
          <g key={`arrow-${i}`}>
            {/* Arrow line */}
            <motion.line
              x1={x1}
              y1={arrowY}
              x2={x2}
              y2={arrowY}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.2"
              markerEnd="url(#arrowhead-layered-repr)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 0.6 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: i * 0.2 + 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            />
            {/* "Layer N" label above arrow */}
            <motion.text
              x={midX}
              y={arrowY - 8}
              textAnchor="middle"
              fontSize="7.5"
              fontFamily="var(--font-sans)"
              fill="var(--color-text-tertiary)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.2 + 0.45,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {`Layer ${i + 1}`}
            </motion.text>
          </g>
        );
      })}

      {/* "Increasing Abstraction" arrow at top */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={stages[0].x + boxW / 2}
          y1={18}
          x2={stages[4].x + boxW / 2}
          y2={18}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          strokeDasharray="3 2"
          markerEnd="url(#arrowhead-layered-repr)"
        />
        <text
          x={280}
          y={12}
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-sans)"
          fill="var(--color-text-tertiary)"
          letterSpacing="0.06em"
        >
          Increasing Abstraction
        </text>
      </motion.g>

      {/* "Information Distillation" label at the bottom */}
      <motion.text
        x={280}
        y={205}
        textAnchor="middle"
        fontSize="11"
        fontWeight={500}
        fontFamily="var(--font-sans)"
        fill="var(--color-text-secondary)"
        letterSpacing="0.04em"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 0.85, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        Information Distillation
      </motion.text>
    </svg>
  );
}
