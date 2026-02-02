'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LossLandscapeDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function LossLandscapeDiagram({ className = '' }: LossLandscapeDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Chart dimensions
  const padding = { top: 40, right: 40, bottom: 40, left: 50 };
  const chartWidth = 440 - padding.left - padding.right;
  const chartHeight = 240 - padding.top - padding.bottom;

  // Data points for smooth curves
  const epochs = 50;
  const optimalEpoch = 20;

  // Training loss: exponential decay
  const trainingLoss = (epoch: number) => {
    return 0.9 * Math.exp(-0.06 * epoch) + 0.1;
  };

  // Validation loss: U-shaped curve
  const validationLoss = (epoch: number) => {
    const t = epoch / epochs;
    const optimal = optimalEpoch / epochs;
    return 0.8 * Math.exp(-0.08 * epoch) + 0.15 + Math.pow(Math.max(0, t - optimal), 2) * 2;
  };

  // Generate smooth path using bezier curves
  const generatePath = (lossFunction: (epoch: number) => number) => {
    const points: { x: number; y: number }[] = [];
    const step = 2;

    for (let i = 0; i <= epochs; i += step) {
      const loss = lossFunction(i);
      const x = padding.left + (i / epochs) * chartWidth;
      const y = padding.top + chartHeight - (loss * chartHeight);
      points.push({ x, y });
    }

    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      if (next) {
        // Calculate control points for smooth curve
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y + (curr.y - prev.y) * 0.5;
        const cp2x = curr.x - (next.x - curr.x) * 0.5;
        const cp2y = curr.y - (next.y - curr.y) * 0.5;

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  const trainingPath = generatePath(trainingLoss);
  const validationPath = generatePath(validationLoss);

  // Optimal point coordinates
  const optimalX = padding.left + (optimalEpoch / epochs) * chartWidth;
  const optimalY = padding.top + chartHeight - (validationLoss(optimalEpoch) * chartHeight);

  // X-axis tick marks
  const xTicks = [0, 10, 20, 30, 40, 50];

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 255"
      className={className}
      role="img"
      aria-label="Loss landscape diagram showing training loss decreasing steadily while validation loss forms a U-shape, indicating the optimal stopping point before overfitting occurs"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Background regions */}
      <motion.rect
        x={padding.left}
        y={padding.top}
        width={(optimalEpoch / epochs) * chartWidth - 20}
        height={chartHeight}
        fill="var(--color-bg-tertiary)"
        opacity="0.3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      />
      <motion.rect
        x={padding.left + (optimalEpoch / epochs) * chartWidth + 20}
        y={padding.top}
        width={chartWidth - (optimalEpoch / epochs) * chartWidth - 20}
        height={chartHeight}
        fill="var(--color-text-tertiary)"
        opacity="0.15"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Axes */}
      <motion.g
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Y-axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />

        {/* X-axis */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />

        {/* X-axis ticks and labels */}
        {xTicks.map((tick) => {
          const x = padding.left + (tick / epochs) * chartWidth;
          return (
            <g key={tick}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 4}
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 18}
                textAnchor="middle"
                fill="var(--color-text-secondary)"
                fontSize="11"
                fontWeight="500"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text
          x={padding.left + chartWidth / 2}
          y={240 - 8}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
        >
          Epochs
        </text>

        <text
          x={12}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontWeight="600"
          transform={`rotate(-90, 12, ${padding.top + chartHeight / 2})`}
        >
          Loss
        </text>
      </motion.g>

      {/* Optimal point vertical line */}
      <motion.line
        x1={optimalX}
        y1={padding.top}
        x2={optimalX}
        y2={padding.top + chartHeight}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.6"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 0.6, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Training loss line */}
      <motion.path
        d={trainingPath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Validation loss line */}
      <motion.path
        d={validationPath}
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Optimal point marker */}
      <motion.circle
        cx={optimalX}
        cy={optimalY}
        r="5"
        fill="var(--color-accent)"
        stroke="var(--color-bg-elevated)"
        strokeWidth="2"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Region labels */}
      <motion.text
        x={padding.left + (optimalEpoch / epochs) * chartWidth / 2}
        y={padding.top + 15}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Underfitting
      </motion.text>

      <motion.text
        x={optimalX}
        y={padding.top - 5}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="11"
        fontWeight="700"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        Best
      </motion.text>

      <motion.text
        x={padding.left + chartWidth - (chartWidth - (optimalEpoch / epochs) * chartWidth) / 2 - 10}
        y={padding.top + 15}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Overfitting
      </motion.text>

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Training loss legend */}
        <line
          x1={320}
          y1={55}
          x2={345}
          y2={55}
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x={350}
          y={59}
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="500"
        >
          Training
        </text>

        {/* Validation loss legend */}
        <line
          x1={320}
          y1={72}
          x2={345}
          y2={72}
          stroke="var(--color-text-tertiary)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x={350}
          y={76}
          fill="var(--color-text-primary)"
          fontSize="11"
          fontWeight="500"
        >
          Validation
        </text>
      </motion.g>
    </svg>
  );
}
