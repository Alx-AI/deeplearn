'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ThreeWayDataSplitDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function ThreeWayDataSplitDiagram({
  className = '',
}: ThreeWayDataSplitDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Layout constants
  const barX = 30;
  const barY = 50;
  const barHeight = 36;
  const totalBarWidth = 440;

  // Split proportions
  const trainWidth = totalBarWidth * 0.6; // 60%
  const valWidth = totalBarWidth * 0.2; // 20%
  const testWidth = totalBarWidth * 0.2; // 20%

  const trainX = barX;
  const valX = barX + trainWidth;
  const testX = barX + trainWidth + valWidth;

  // Arrow and annotation Y positions
  const arrowStartY = barY + barHeight + 8;
  const arrowEndY = arrowStartY + 24;
  const labelY = arrowEndY + 16;
  const subLabelY = labelY + 15;

  // Percentage label Y position (above the bar)
  const percentY = barY - 10;

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 240"
      role="img"
      aria-label="Three-way data split diagram showing training (60%), validation (20%), and test (20%) sets with their purposes"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Full dataset label */}
      <motion.text
        x={barX + totalBarWidth / 2}
        y={18}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Full Dataset
      </motion.text>

      {/* Percentage labels above each section */}
      <motion.text
        x={trainX + trainWidth / 2}
        y={percentY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        60%
      </motion.text>

      <motion.text
        x={valX + valWidth / 2}
        y={percentY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        20%
      </motion.text>

      <motion.text
        x={testX + testWidth / 2}
        y={percentY}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        20%
      </motion.text>

      {/* Training section (accent-subtle fill) */}
      <motion.rect
        x={trainX}
        y={barY}
        width={trainWidth}
        height={barHeight}
        rx={4}
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isInView
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, delay: 0.15, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${trainX}px ${barY + barHeight / 2}px` }}
      />

      {/* Training label inside bar */}
      <motion.text
        x={trainX + trainWidth / 2}
        y={barY + barHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Training
      </motion.text>

      {/* Validation section (bg-tertiary fill) */}
      <motion.rect
        x={valX}
        y={barY}
        width={valWidth}
        height={barHeight}
        fill="var(--color-bg-tertiary)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isInView
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${valX}px ${barY + barHeight / 2}px` }}
      />

      {/* Validation label inside bar */}
      <motion.text
        x={valX + valWidth / 2}
        y={barY + barHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Validation
      </motion.text>

      {/* Test section (border-primary outline only, no fill) */}
      <motion.rect
        x={testX}
        y={barY}
        width={testWidth}
        height={barHeight}
        rx={4}
        fill="none"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={
          isInView
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay: 0.45, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${testX}px ${barY + barHeight / 2}px` }}
      />

      {/* Test label inside bar */}
      <motion.text
        x={testX + testWidth / 2}
        y={barY + barHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Test
      </motion.text>

      {/* Arrow from Training section */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ delay: 0.9, duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={trainX + trainWidth / 2}
          y1={arrowStartY}
          x2={trainX + trainWidth / 2}
          y2={arrowEndY}
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <polygon
          points={`${trainX + trainWidth / 2},${arrowEndY} ${trainX + trainWidth / 2 - 4},${arrowEndY - 6} ${trainX + trainWidth / 2 + 4},${arrowEndY - 6}`}
          fill="var(--color-accent)"
        />
        <text
          x={trainX + trainWidth / 2}
          y={labelY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="600"
        >
          Model learns weights
        </text>
      </motion.g>

      {/* Arrow from Validation section */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ delay: 1.1, duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={valX + valWidth / 2}
          y1={arrowStartY}
          x2={valX + valWidth / 2}
          y2={arrowEndY}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
        />
        <polygon
          points={`${valX + valWidth / 2},${arrowEndY} ${valX + valWidth / 2 - 4},${arrowEndY - 6} ${valX + valWidth / 2 + 4},${arrowEndY - 6}`}
          fill="var(--color-text-secondary)"
        />
        <text
          x={valX + valWidth / 2}
          y={labelY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Tune hyperparams
        </text>
      </motion.g>

      {/* Info leakage warning below validation */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Warning background pill */}
        <rect
          x={valX + valWidth / 2 - 56}
          y={subLabelY - 10}
          width={112}
          height={18}
          rx={9}
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Warning icon (small triangle) */}
        <path
          d={`M ${valX + valWidth / 2 - 42} ${subLabelY + 2} L ${valX + valWidth / 2 - 38} ${subLabelY - 5} L ${valX + valWidth / 2 - 34} ${subLabelY + 2} Z`}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <line
          x1={valX + valWidth / 2 - 38}
          y1={subLabelY - 2.5}
          x2={valX + valWidth / 2 - 38}
          y2={subLabelY - 0.5}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Warning text */}
        <text
          x={valX + valWidth / 2 + 5}
          y={subLabelY + 1}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          info leakage risk
        </text>
      </motion.g>

      {/* Arrow from Test section */}
      <motion.g
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ delay: 1.3, duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={testX + testWidth / 2}
          y1={arrowStartY}
          x2={testX + testWidth / 2}
          y2={arrowEndY}
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <polygon
          points={`${testX + testWidth / 2},${arrowEndY} ${testX + testWidth / 2 - 4},${arrowEndY - 6} ${testX + testWidth / 2 + 4},${arrowEndY - 6}`}
          fill="var(--color-border-primary)"
        />
        <text
          x={testX + testWidth / 2}
          y={labelY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Final evaluation
        </text>
        <text
          x={testX + testWidth / 2}
          y={subLabelY}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          fontWeight="500"
        >
          (use once!)
        </text>
      </motion.g>
    </svg>
  );
}
