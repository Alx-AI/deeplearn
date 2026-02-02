'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BatchNormDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function BatchNormDiagram({ className = '' }: BatchNormDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Before BatchNorm: scattered dots with positive bias
  const beforeDots = [
    { x: 35, y: 60 },
    { x: 45, y: 85 },
    { x: 50, y: 45 },
    { x: 55, y: 110 },
    { x: 60, y: 70 },
    { x: 65, y: 95 },
    { x: 70, y: 50 },
    { x: 75, y: 115 },
    { x: 80, y: 65 },
    { x: 85, y: 90 },
    { x: 90, y: 55 },
    { x: 95, y: 105 },
    { x: 100, y: 75 },
    { x: 105, y: 85 },
    { x: 110, y: 60 },
  ];

  // After BatchNorm: normalized around center with bell curve distribution
  const afterDots = [
    { x: 305, y: 90 }, // center
    { x: 295, y: 85 },
    { x: 315, y: 88 },
    { x: 290, y: 95 },
    { x: 320, y: 93 },
    { x: 285, y: 105 },
    { x: 325, y: 103 },
    { x: 280, y: 115 },
    { x: 330, y: 112 },
    { x: 275, y: 125 },
    { x: 335, y: 123 },
    { x: 300, y: 78 },
    { x: 310, y: 80 },
    { x: 297, y: 100 },
    { x: 313, y: 98 },
  ];

  // Bell curve path for normalized distribution
  const bellCurvePath = `
    M 270 130
    Q 270 70, 305 65
    Q 340 70, 340 130
  `;

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 180"
      className={className}
      role="img"
      aria-label="Batch normalization diagram showing distribution before and after normalization"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Left Panel - Before BatchNorm */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background */}
        <rect
          x="20"
          y="20"
          width="140"
          height="140"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="8"
        />

        {/* Title */}
        <text
          x="90"
          y="40"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          Before BatchNorm
        </text>

        {/* Scattered dots */}
        {beforeDots.map((dot, i) => (
          <motion.circle
            key={`before-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="3.5"
            fill="var(--color-text-tertiary)"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.7 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.3 + i * 0.02,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Label for skewed distribution */}
        <text
          x="90"
          y="155"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          Skewed distribution
        </text>
      </motion.g>

      {/* Arrow with transformation steps */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Arrow line */}
        <motion.line
          x1="170"
          y1="90"
          x2="250"
          y2="90"
          stroke="var(--color-accent)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Arrow head */}
        <polygon
          points="250,85 260,90 250,95"
          fill="var(--color-accent)"
        />

        {/* Transformation label */}
        <text
          x="210"
          y="80"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="600"
        >
          Normalize → Scale → Shift
        </text>
      </motion.g>

      {/* Right Panel - After BatchNorm */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background */}
        <rect
          x="270"
          y="20"
          width="170"
          height="140"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="8"
        />

        {/* Title */}
        <text
          x="355"
          y="40"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          After BatchNorm
        </text>

        {/* Zero line */}
        <line
          x1="285"
          y1="90"
          x2="425"
          y2="90"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x="280"
          y="93"
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          0
        </text>

        {/* Bell curve outline */}
        <motion.path
          d={bellCurvePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: PRODUCTIVE_EASE }}
        />

        {/* Normalized dots */}
        {afterDots.map((dot, i) => (
          <motion.circle
            key={`after-${i}`}
            cx={dot.x}
            cy={dot.y}
            r="3.5"
            fill="var(--color-accent)"
            initial={{
              cx: beforeDots[i].x + 180,
              cy: beforeDots[i].y,
              scale: 0,
              opacity: 0
            }}
            animate={isInView ? {
              cx: dot.x,
              cy: dot.y,
              scale: 1,
              opacity: 0.8
            } : {
              cx: beforeDots[i].x + 180,
              cy: beforeDots[i].y,
              scale: 0,
              opacity: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.9 + i * 0.02,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Label for normalized distribution */}
        <text
          x="355"
          y="155"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          Normalized distribution
        </text>
      </motion.g>

      {/* Statistical indicators */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Mean and variance labels */}
        <text
          x="90"
          y="170"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          μ ≈ 5.2, σ² ≈ 8.3
        </text>
        <text
          x="355"
          y="170"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
        >
          μ = 0, σ² = 1
        </text>
      </motion.g>
    </svg>
  );
}
