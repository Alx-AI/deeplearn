'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface YOLODiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function YOLODiagram({ className = '' }: YOLODiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Grid configuration
  const gridSize = 4;
  const gridStartX = 40;
  const gridStartY = 40;
  const gridWidth = 320;
  const gridHeight = 180;
  const cellWidth = gridWidth / gridSize;
  const cellHeight = gridHeight / gridSize;

  // Detection boxes
  const detections = [
    {
      // Main detection - dog
      cell: { row: 1, col: 2 },
      box: { x: 140, y: 70, width: 120, height: 100 },
      label: 'dog',
      confidence: 0.95,
      isPrimary: true,
    },
    {
      // Secondary detection - cat
      cell: { row: 2, col: 0 },
      box: { x: 45, y: 130, width: 70, height: 60 },
      label: 'cat',
      confidence: 0.87,
      isPrimary: false,
    },
    {
      // Secondary detection - person
      cell: { row: 0, col: 1 },
      box: { x: 100, y: 45, width: 60, height: 90 },
      label: 'person',
      confidence: 0.82,
      isPrimary: false,
    },
  ];

  return (
    <div className={className} ref={ref}>
      <svg
        viewBox="0 0 400 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="YOLO single-stage object detection diagram showing grid-based predictions"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Background image placeholder with subtle grid pattern */}
        <defs>
          <pattern
            id="imagePattern"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="20"
              height="20"
              fill="var(--color-bg-elevated)"
            />
            <rect
              width="20"
              height="20"
              fill="var(--color-bg-tertiary)"
              opacity="0.3"
            />
            <circle
              cx="10"
              cy="10"
              r="1"
              fill="var(--color-border-primary)"
              opacity="0.2"
            />
          </pattern>
        </defs>

        {/* Image background */}
        <motion.rect
          x={gridStartX}
          y={gridStartY}
          width={gridWidth}
          height={gridHeight}
          fill="url(#imagePattern)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
          rx="4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
        />

        {/* 4x4 Grid overlay */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          {/* Vertical lines */}
          {Array.from({ length: gridSize - 1 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={gridStartX + (i + 1) * cellWidth}
              y1={gridStartY}
              x2={gridStartX + (i + 1) * cellWidth}
              y2={gridStartY + gridHeight}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
          {/* Horizontal lines */}
          {Array.from({ length: gridSize - 1 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={gridStartX}
              y1={gridStartY + (i + 1) * cellHeight}
              x2={gridStartX + gridWidth}
              y2={gridStartY + (i + 1) * cellHeight}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              opacity="0.3"
            />
          ))}
        </motion.g>

        {/* Highlighted cells (where predictions originate) */}
        {detections.map((detection, idx) => (
          <motion.rect
            key={`cell-${idx}`}
            x={gridStartX + detection.cell.col * cellWidth}
            y={gridStartY + detection.cell.row * cellHeight}
            width={cellWidth}
            height={cellHeight}
            fill="var(--color-accent-subtle)"
            opacity={detection.isPrimary ? 0.2 : 0.1}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: detection.isPrimary ? 0.2 : 0.1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + idx * 0.1, ease: PRODUCTIVE_EASE }}
          />
        ))}

        {/* Detection bounding boxes */}
        {detections.map((detection, idx) => {
          const delay = 0.6 + idx * 0.15;
          const strokeWidth = detection.isPrimary ? 2.5 : 1.5;
          const strokeColor = detection.isPrimary
            ? 'var(--color-accent)'
            : 'var(--color-text-tertiary)';
          const opacity = detection.isPrimary ? 1 : 0.6;

          return (
            <g key={`detection-${idx}`}>
              {/* Bounding box */}
              <motion.rect
                x={detection.box.x}
                y={detection.box.y}
                width={detection.box.width}
                height={detection.box.height}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                opacity={opacity}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  isInView
                    ? { pathLength: 1, opacity }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 0.6, delay, ease: PRODUCTIVE_EASE }}
              />

              {/* Label badge */}
              <motion.g
                initial={{ opacity: 0, y: -5 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
                transition={{ duration: 0.4, delay: delay + 0.3, ease: PRODUCTIVE_EASE }}
              >
                {/* Badge background */}
                <rect
                  x={detection.box.x}
                  y={detection.box.y - 20}
                  width={detection.label.length * 7 + 30}
                  height={18}
                  fill={detection.isPrimary ? 'var(--color-accent)' : 'var(--color-bg-elevated)'}
                  stroke={detection.isPrimary ? 'none' : 'var(--color-border-primary)'}
                  strokeWidth="1"
                  rx="3"
                  opacity={detection.isPrimary ? 1 : 0.9}
                />
                {/* Label text */}
                <text
                  x={detection.box.x + 5}
                  y={detection.box.y - 8}
                  fontSize="11"
                  fontWeight="600"
                  fill={
                    detection.isPrimary
                      ? 'var(--color-bg-primary)'
                      : 'var(--color-text-primary)'
                  }
                >
                  {detection.label}
                </text>
                {/* Confidence score */}
                <text
                  x={detection.box.x + detection.label.length * 7 + 10}
                  y={detection.box.y - 8}
                  fontSize="10"
                  fontWeight="500"
                  fill={
                    detection.isPrimary
                      ? 'var(--color-bg-elevated)'
                      : 'var(--color-text-secondary)'
                  }
                >
                  {detection.confidence.toFixed(2)}
                </text>
              </motion.g>
            </g>
          );
        })}

        {/* Title label */}
        <motion.text
          x="200"
          y="245"
          fontSize="13"
          fontWeight="500"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          One pass through the network detects all objects
        </motion.text>

        {/* Grid cell indicator (small annotation for primary detection) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          {/* Arrow from highlighted cell to box center */}
          <line
            x1={gridStartX + (detections[0].cell.col + 0.5) * cellWidth}
            y1={gridStartY + (detections[0].cell.row + 0.5) * cellHeight}
            x2={detections[0].box.x + detections[0].box.width / 2}
            y2={detections[0].box.y + detections[0].box.height / 2}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          {/* Cell center dot */}
          <circle
            cx={gridStartX + (detections[0].cell.col + 0.5) * cellWidth}
            cy={gridStartY + (detections[0].cell.row + 0.5) * cellHeight}
            r="3"
            fill="var(--color-accent)"
            opacity="0.7"
          />
        </motion.g>
      </svg>
    </div>
  );
}
