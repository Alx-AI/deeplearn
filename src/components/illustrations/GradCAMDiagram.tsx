'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface GradCAMDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function GradCAMDiagram({ className = '' }: GradCAMDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Define the cat-like shape pattern (8x8 grid)
  // 1 = filled (part of the shape), 0 = empty
  const catPattern = [
    [0, 0, 1, 0, 0, 1, 0, 0], // ears
    [0, 0, 1, 0, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0], // face top
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0], // face middle
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0], // face bottom
    [0, 0, 0, 1, 1, 0, 0, 0],
  ];

  // Define heatmap intensities (0.0 to 0.8)
  // Higher values in the central face area where the model focuses
  const heatmapIntensities = [
    [0.1, 0.1, 0.2, 0.1, 0.1, 0.2, 0.1, 0.1], // ears - low attention
    [0.1, 0.1, 0.3, 0.2, 0.2, 0.3, 0.1, 0.1],
    [0.1, 0.3, 0.5, 0.6, 0.6, 0.5, 0.3, 0.1], // face top - medium attention
    [0.2, 0.4, 0.6, 0.7, 0.7, 0.6, 0.4, 0.2],
    [0.2, 0.5, 0.7, 0.8, 0.8, 0.7, 0.5, 0.2], // face middle - highest attention
    [0.2, 0.4, 0.6, 0.7, 0.7, 0.6, 0.4, 0.2],
    [0.1, 0.2, 0.4, 0.5, 0.5, 0.4, 0.2, 0.1], // face bottom - medium attention
    [0.1, 0.1, 0.2, 0.3, 0.3, 0.2, 0.1, 0.1],
  ];

  const cellSize = 18;
  const gridSize = 8;
  const gridWidth = gridSize * cellSize;
  const gridHeight = gridSize * cellSize;
  const gridSpacing = 100;

  return (
    <svg
      ref={ref}
      viewBox="0 0 420 200"
      className={className}
      role="img"
      aria-label="Grad-CAM visualization showing how the model highlights important regions in an image"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Input Image Grid */}
      <g transform="translate(30, 40)">
        <motion.text
          x={gridWidth / 2}
          y={-15}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          Input Image
        </motion.text>

        {/* Grid cells */}
        {catPattern.map((row, i) =>
          row.map((cell, j) => (
            <motion.rect
              key={`input-${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize - 1}
              height={cellSize - 1}
              fill={cell === 1 ? 'var(--color-text-primary)' : 'var(--color-bg-elevated)'}
              stroke="var(--color-border-primary)"
              strokeWidth="0.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + (i * gridSize + j) * 0.01,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))
        )}
      </g>

      {/* Arrow */}
      <g transform={`translate(${30 + gridWidth + 20}, ${40 + gridHeight / 2})`}>
        <motion.line
          x1="0"
          y1="0"
          x2="40"
          y2="0"
          stroke="var(--color-accent)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />
        <motion.polygon
          points="40,0 35,-4 35,4"
          fill="var(--color-accent)"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.3, delay: 1.1, ease: PRODUCTIVE_EASE }}
        />
        <motion.text
          x="20"
          y="-10"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          Grad-CAM
        </motion.text>
      </g>

      {/* Heatmap Grid */}
      <g transform={`translate(${30 + gridWidth + gridSpacing}, 40)`}>
        <motion.text
          x={gridWidth / 2}
          y={-15}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          Grad-CAM Heatmap
        </motion.text>

        {/* Base grid (showing original shape faintly) */}
        {catPattern.map((row, i) =>
          row.map((cell, j) => (
            <rect
              key={`base-${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize - 1}
              height={cellSize - 1}
              fill={cell === 1 ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)'}
              stroke="var(--color-border-primary)"
              strokeWidth="0.5"
            />
          ))
        )}

        {/* Heatmap overlay */}
        {heatmapIntensities.map((row, i) =>
          row.map((intensity, j) => (
            <motion.rect
              key={`heatmap-${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize - 1}
              height={cellSize - 1}
              fill="var(--color-accent)"
              opacity={0}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: intensity } : { opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: 1.2 + (i * gridSize + j) * 0.015,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))
        )}
      </g>

      {/* Bottom explanation text */}
      <motion.text
        x="210"
        y="185"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        What the model looks at to decide &quot;cat&quot;
      </motion.text>
    </svg>
  );
}
