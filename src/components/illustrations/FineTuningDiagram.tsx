'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FineTuningDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function FineTuningDiagram({ className = '' }: FineTuningDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Layer positions
  const layerHeight = 20;
  const layerGap = 4;
  const layerWidth = 80;

  // Stack positions
  const stack1X = 40;
  const stack2X = 190;
  const stack3X = 340;
  const stackY = 60;

  const renderLayer = (x: number, y: number, isActive: boolean, delay: number) => (
    <motion.g
      initial={{ opacity: 0, y: -10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
    >
      <rect
        x={x}
        y={y}
        width={layerWidth}
        height={layerHeight}
        rx={3}
        fill={isActive ? 'var(--color-accent-subtle)' : 'var(--color-bg-tertiary)'}
        stroke={isActive ? 'var(--color-accent)' : 'var(--color-border-primary)'}
        strokeWidth={1.5}
      />
      {!isActive && (
        <g transform={`translate(${x + layerWidth / 2}, ${y + layerHeight / 2})`}>
          {/* Lock icon */}
          <rect
            x={-4}
            y={-2}
            width={8}
            height={6}
            rx={1}
            fill="var(--color-text-tertiary)"
          />
          <path
            d="M -2,-2 L -2,-4 A 2,2 0 0,1 2,-4 L 2,-2"
            stroke="var(--color-text-tertiary)"
            strokeWidth={1.5}
            fill="none"
          />
        </g>
      )}
      {isActive && (
        <g transform={`translate(${x + layerWidth / 2}, ${y + layerHeight / 2})`}>
          {/* Fire/active icon */}
          <path
            d="M 0,-5 C -2,-3 -3,0 -2,2 C -1,4 1,4 2,2 C 3,0 2,-3 0,-5 Z M 0,-2 C -1,-1 -1,1 0,2 C 1,1 1,-1 0,-2 Z"
            fill="var(--color-accent)"
          />
        </g>
      )}
    </motion.g>
  );

  const renderStack = (
    x: number,
    activeLayers: boolean[],
    baseDelay: number,
    label: string
  ) => (
    <g>
      {/* Stack label */}
      <motion.text
        x={x + layerWidth / 2}
        y={stackY - 20}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize={12}
        fontFamily="var(--font-sans)"
        fontWeight={600}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: baseDelay, ease: PRODUCTIVE_EASE }}
      >
        {label}
      </motion.text>

      {/* Layers (bottom to top) */}
      {activeLayers.map((isActive, i) => {
        const layerY = stackY + (5 - i) * (layerHeight + layerGap);
        return (
          <g key={i}>
            {renderLayer(x, layerY, isActive, baseDelay + i * 0.05)}
          </g>
        );
      })}
    </g>
  );

  const renderArrow = (x1: number, x2: number, y: number, delay: number) => (
    <motion.g
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
    >
      <motion.path
        d={`M ${x1} ${y} L ${x2 - 8} ${y}`}
        stroke="var(--color-text-secondary)"
        strokeWidth={2}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.2, ease: PRODUCTIVE_EASE }}
      />
      <motion.path
        d={`M ${x2 - 8} ${y - 4} L ${x2} ${y} L ${x2 - 8} ${y + 4}`}
        stroke="var(--color-text-secondary)"
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, x: -5 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
        transition={{ duration: 0.3, delay: delay + 0.6, ease: PRODUCTIVE_EASE }}
      />
    </motion.g>
  );

  const arrowY = stackY + 3 * (layerHeight + layerGap);

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 220"
      className={className}
      role="img"
      aria-label="Fine-tuning diagram showing progressive unfreezing of neural network layers"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <motion.text
        x={250}
        y={25}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize={16}
        fontFamily="var(--font-sans)"
        fontWeight={700}
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Progressive Fine-Tuning Strategy
      </motion.text>

      {/* Stack 1: Feature Extraction - only top layer active */}
      {renderStack(
        stack1X,
        [false, false, false, false, false, true],
        0.3,
        'Feature Extraction'
      )}

      {/* Arrow 1 */}
      {renderArrow(stack1X + layerWidth + 10, stack2X - 10, arrowY, 0.8)}

      {/* Stack 2: Fine-tune top layers - top 3 active */}
      {renderStack(
        stack2X,
        [false, false, false, true, true, true],
        1.0,
        'Fine-tune Top'
      )}

      {/* Arrow 2 */}
      {renderArrow(stack2X + layerWidth + 10, stack3X - 10, arrowY, 1.5)}

      {/* Stack 3: Full fine-tune - all active */}
      {renderStack(
        stack3X,
        [true, true, true, true, true, true],
        1.7,
        'Full Fine-tune'
      )}

      {/* Learning rate annotation */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={stack3X + layerWidth + 5}
          y={stackY + 40}
          width={60}
          height={20}
          rx={4}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
        />
        <text
          x={stack3X + layerWidth + 35}
          y={stackY + 53}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize={11}
          fontFamily="var(--font-sans)"
          fontWeight={600}
        >
          lr = 1e-5
        </text>
      </motion.g>

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Frozen layer example */}
        <rect
          x={40}
          y={195}
          width={30}
          height={12}
          rx={2}
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
        />
        <g transform="translate(55, 201)">
          <rect x={-3} y={-1.5} width={6} height={4.5} rx={0.8} fill="var(--color-text-tertiary)" />
          <path
            d="M -1.5,-1.5 L -1.5,-3 A 1.5,1.5 0 0,1 1.5,-3 L 1.5,-1.5"
            stroke="var(--color-text-tertiary)"
            strokeWidth={1}
            fill="none"
          />
        </g>
        <text
          x={77}
          y={204}
          fill="var(--color-text-secondary)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          Frozen
        </text>

        {/* Active layer example */}
        <rect
          x={140}
          y={195}
          width={30}
          height={12}
          rx={2}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1}
        />
        <g transform="translate(155, 201)">
          <path
            d="M 0,-3.5 C -1.5,-2 -2,0 -1.5,1.5 C -0.8,3 0.8,3 1.5,1.5 C 2,0 1.5,-2 0,-3.5 Z M 0,-1.5 C -0.8,-0.8 -0.8,0.8 0,1.5 C 0.8,0.8 0.8,-0.8 0,-1.5 Z"
            fill="var(--color-accent)"
          />
        </g>
        <text
          x={177}
          y={204}
          fill="var(--color-text-secondary)"
          fontSize={10}
          fontFamily="var(--font-sans)"
        >
          Trainable
        </text>
      </motion.g>
    </svg>
  );
}
