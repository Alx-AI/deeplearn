'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TimeseriesBaselineDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function TimeseriesBaselineDiagram({
  className = '',
}: TimeseriesBaselineDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Chart dimensions
  const margin = { top: 30, right: 40, bottom: 40, left: 50 };
  const width = 460 - margin.left - margin.right;
  const height = 200 - margin.top - margin.bottom;

  // Split point between historical and forecast
  const splitX = width * 0.7; // 70% historical, 30% forecast

  // Pre-computed time series points (natural wave pattern)
  // 12 points total: 9 historical, 3 forecast region
  const timeSeriesData = [
    { x: 0, y: 70 },
    { x: 40, y: 55 },
    { x: 80, y: 65 },
    { x: 120, y: 45 },
    { x: 160, y: 50 },
    { x: 200, y: 35 },
    { x: 240, y: 45 },
    { x: 280, y: 40 },
    { x: 320, y: 50 }, // Last historical point
  ];

  const lastHistoricalPoint = timeSeriesData[timeSeriesData.length - 1];

  // Convert to SVG path
  const timeSeriesPath = timeSeriesData
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Baseline extends from last known value into forecast region
  const baselineY = lastHistoricalPoint.y;
  const baselineStartX = lastHistoricalPoint.x;
  const baselineEndX = width;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 460 200`}
      className={className}
      role="img"
      aria-label="Time series forecasting diagram showing historical data and baseline prediction that repeats the last known value"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Forecast region highlight */}
      <motion.rect
        x={margin.left + splitX}
        y={margin.top}
        width={width - splitX}
        height={height}
        fill="var(--color-accent-subtle)"
        opacity={0.15}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Vertical divider line */}
      <motion.line
        x1={margin.left + splitX}
        y1={margin.top}
        x2={margin.left + splitX}
        y2={margin.top + height}
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Y-axis */}
      <motion.line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + height}
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* X-axis */}
      <motion.line
        x1={margin.left}
        y1={margin.top + height}
        x2={margin.left + width}
        y2={margin.top + height}
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Y-axis label */}
      <motion.text
        x={margin.left - 35}
        y={margin.top + height / 2}
        fill="var(--color-text-secondary)"
        fontSize="11"
        textAnchor="middle"
        transform={`rotate(-90, ${margin.left - 35}, ${margin.top + height / 2})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        Value
      </motion.text>

      {/* X-axis label */}
      <motion.text
        x={margin.left + width / 2}
        y={margin.top + height + 30}
        fill="var(--color-text-secondary)"
        fontSize="11"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        Time
      </motion.text>

      {/* Historical data label */}
      <motion.text
        x={margin.left + splitX / 2}
        y={margin.top - 10}
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="500"
        textAnchor="middle"
        initial={{ opacity: 0, y: -5 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Historical Data
      </motion.text>

      {/* Forecast label */}
      <motion.text
        x={margin.left + splitX + (width - splitX) / 2}
        y={margin.top - 10}
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="500"
        textAnchor="middle"
        initial={{ opacity: 0, y: -5 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
        transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        Forecast
      </motion.text>

      {/* Time series line (actual data) */}
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <motion.path
          d={timeSeriesPath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: PRODUCTIVE_EASE }}
        />

        {/* Data points */}
        {timeSeriesData.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="var(--color-accent)"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{
              duration: 0.3,
              delay: 0.5 + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Baseline prediction (horizontal dashed line) */}
        <motion.line
          x1={baselineStartX}
          y1={baselineY}
          x2={baselineEndX}
          y2={baselineY}
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Baseline endpoint marker */}
        <motion.circle
          cx={baselineEndX}
          cy={baselineY}
          r="3"
          fill="var(--color-text-tertiary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, delay: 2.4, ease: PRODUCTIVE_EASE }}
        />
      </g>

      {/* Baseline label */}
      <motion.text
        x={margin.left + baselineEndX - 8}
        y={margin.top + baselineY - 10}
        textAnchor="end"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontWeight="500"
        initial={{ opacity: 0, x: -5 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
        transition={{ duration: 0.4, delay: 2.5, ease: PRODUCTIVE_EASE }}
      >
        Baseline: repeat last value
      </motion.text>
    </svg>
  );
}
