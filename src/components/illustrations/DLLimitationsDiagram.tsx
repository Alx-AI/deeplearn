'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DLLimitationsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function DLLimitationsDiagram({ className = '' }: DLLimitationsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Training data points (x, y) - centered in each panel
  const trainingPoints = [
    { x: 30, y: 70 },
    { x: 50, y: 55 },
    { x: 70, y: 50 },
    { x: 90, y: 60 },
    { x: 110, y: 45 },
  ];

  // Test points for left panel (interpolation) - within training region
  const goodTestPoints = [
    { x: 40, y: 62 },
    { x: 80, y: 52 },
    { x: 100, y: 53 },
  ];

  // Test points for right panel (extrapolation) - outside training region
  const badTestPoints = [
    { x: 260, y: 100 }, // left and below training region
    { x: 370, y: 95 }, // right of and below training region
    { x: 400, y: 120 }, // far right and below training region
  ];

  // Smooth curve path (fitted model) - for left panel
  const leftCurvePath = 'M 30,70 Q 50,52 70,50 T 110,45';

  // Curve for right panel - same initial fit but diverges wildly
  const rightCurvePath = 'M 270,70 Q 290,52 310,50 T 350,45 Q 370,30 390,120';

  // Training region boundary (shaded area on left)
  const trainingRegionPath = 'M 25,35 L 115,35 L 115,85 L 25,85 Z';

  // Same region shown as dashed on right to show extrapolation zone
  const trainingRegionRight = 'M 265,35 L 355,35 L 355,85 L 265,85 Z';

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 200"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
      role="img"
      aria-label="Illustration comparing local generalization (interpolation) with extreme generalization (extrapolation) showing how deep learning models fail outside their training distribution"
    >
      <defs>
        <marker
          id="arrowhead-dl-limitations"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* Left Panel - Local Generalization (Success) */}
      <g>
        {/* Panel background */}
        <motion.rect
          x="10"
          y="10"
          width="220"
          height="180"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
        />

        {/* Title */}
        <motion.text
          x="120"
          y="30"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          Local Generalization
        </motion.text>

        {/* Subtitle */}
        <motion.text
          x="120"
          y="45"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          Interpolation (within distribution)
        </motion.text>

        {/* Training region shading */}
        <motion.path
          d={trainingRegionPath}
          fill="var(--color-accent-subtle)"
          opacity="0.2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.2 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
        />

        {/* Fitted curve */}
        <motion.path
          d={leftCurvePath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Training points */}
        {trainingPoints.map((point, i) => (
          <motion.circle
            key={`train-left-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--color-text-secondary)"
            stroke="var(--color-bg-elevated)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.5 + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Good test points (interpolation) */}
        {goodTestPoints.map((point, i) => (
          <motion.circle
            key={`test-good-${i}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill="var(--color-accent)"
            stroke="var(--color-bg-elevated)"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: 1.2 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Success checkmark */}
        <motion.path
          d="M 200,170 L 205,175 L 215,165"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Legend */}
        <motion.text
          x="30"
          y="165"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          Works well!
        </motion.text>
      </g>

      {/* Right Panel - Extreme Generalization (Failure) */}
      <g>
        {/* Panel background */}
        <motion.rect
          x="250"
          y="10"
          width="220"
          height="180"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
        />

        {/* Title */}
        <motion.text
          x="360"
          y="30"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          Extreme Generalization
        </motion.text>

        {/* Subtitle */}
        <motion.text
          x="360"
          y="45"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          Extrapolation (outside distribution)
        </motion.text>

        {/* Training region (dashed border) */}
        <motion.path
          d={trainingRegionRight}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
        />

        {/* Training points (shifted to right panel) */}
        {trainingPoints.map((point, i) => (
          <motion.circle
            key={`train-right-${i}`}
            cx={point.x + 240}
            cy={point.y}
            r="4"
            fill="var(--color-text-secondary)"
            stroke="var(--color-bg-elevated)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.5 + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Diverging curve (extrapolation failure) */}
        <motion.path
          d={rightCurvePath}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.6 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Bad test points (extrapolation) */}
        {badTestPoints.map((point, i) => (
          <g key={`test-bad-${i}`}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="var(--color-text-tertiary)"
              stroke="var(--color-bg-elevated)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 1.2 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            />
            {/* X mark on bad predictions */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: 1.5 + i * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <line
                x1={point.x - 3}
                y1={point.y - 3}
                x2={point.x + 3}
                y2={point.y + 3}
                stroke="var(--color-bg-elevated)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1={point.x + 3}
                y1={point.y - 3}
                x2={point.x - 3}
                y2={point.y + 3}
                stroke="var(--color-bg-elevated)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.g>
          </g>
        ))}

        {/* Warning indicator */}
        <motion.circle
          cx="455"
          cy="170"
          r="10"
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
        />
        <motion.text
          x="455"
          y="174"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="14"
          fontWeight="700"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
        >
          !
        </motion.text>

        {/* Legend */}
        <motion.text
          x="270"
          y="165"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          Fails outside training!
        </motion.text>
      </g>

      {/* Center divider */}
      <motion.line
        x1="240"
        y1="20"
        x2="240"
        y2="180"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : {}}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      />
    </svg>
  );
}
