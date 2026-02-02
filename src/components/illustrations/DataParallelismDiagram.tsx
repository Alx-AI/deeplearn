'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DataParallelismDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function DataParallelismDiagram({ className = '' }: DataParallelismDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 260"
      className={className}
      role="img"
      aria-label="Data Parallelism Diagram showing a batch split across 4 GPUs with gradient synchronization"
      style={{ width: '100%', height: 'auto' }}
    >
      {/* Full Batch at top */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="80"
          y="10"
          width="300"
          height="30"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          rx="4"
        />
        <text
          x="230"
          y="30"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="12"
          fontFamily="var(--font-sans)"
          fontWeight="500"
        >
          Full Batch
        </text>
      </motion.g>

      {/* Split arrows from full batch to mini-batches */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {[95, 185, 275, 365].map((x, i) => (
          <g key={`split-arrow-${i}`}>
            <line
              x1="230"
              y1="40"
              x2={x + 30}
              y2="65"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
              strokeDasharray="3,2"
            />
            <polygon
              points={`${x + 30},65 ${x + 27},60 ${x + 33},60`}
              fill="var(--color-border-primary)"
            />
          </g>
        ))}
      </motion.g>

      {/* Mini-batches */}
      {[
        { x: 65, label: 'Mini-batch 1' },
        { x: 155, label: 'Mini-batch 2' },
        { x: 245, label: 'Mini-batch 3' },
        { x: 335, label: 'Mini-batch 4' },
      ].map((batch, i) => (
        <motion.g
          key={`mini-batch-${i}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.1, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x={batch.x}
            y="70"
            width="60"
            height="24"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            rx="3"
          />
          <text
            x={batch.x + 30}
            y="86"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
            fontWeight="500"
          >
            {batch.label}
          </text>
        </motion.g>
      ))}

      {/* Arrows from mini-batches to GPUs */}
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {[95, 185, 275, 365].map((x, i) => (
          <g key={`gpu-arrow-${i}`}>
            <motion.line
              x1={x}
              y1="94"
              x2={x}
              y2="115"
              stroke="var(--color-accent)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.5, delay: 1.0 + i * 0.05, ease: PRODUCTIVE_EASE }}
            />
            <polygon
              points={`${x},115 ${x - 4},110 ${x + 4},110`}
              fill="var(--color-accent)"
            />
          </g>
        ))}
      </motion.g>

      {/* GPU boxes with chip icons */}
      {[
        { x: 55, label: 'GPU 0' },
        { x: 145, label: 'GPU 1' },
        { x: 235, label: 'GPU 2' },
        { x: 325, label: 'GPU 3' },
      ].map((gpu, i) => (
        <motion.g
          key={`gpu-${i}`}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 1.2 + i * 0.08, ease: PRODUCTIVE_EASE }}
        >
          {/* GPU box */}
          <rect
            x={gpu.x}
            y="120"
            width="80"
            height="50"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            rx="6"
          />

          {/* GPU chip icon */}
          <g transform={`translate(${gpu.x + 15}, 130)`}>
            {/* Main chip */}
            <rect
              x="0"
              y="0"
              width="20"
              height="20"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              rx="2"
            />
            {/* Circuit lines */}
            <line x1="10" y1="0" x2="10" y2="-3" stroke="var(--color-accent)" strokeWidth="1" />
            <line x1="10" y1="20" x2="10" y2="23" stroke="var(--color-accent)" strokeWidth="1" />
            <line x1="0" y1="10" x2="-3" y2="10" stroke="var(--color-accent)" strokeWidth="1" />
            <line x1="20" y1="10" x2="23" y2="10" stroke="var(--color-accent)" strokeWidth="1" />
            {/* Center dot */}
            <circle cx="10" cy="10" r="3" fill="var(--color-accent)" />
          </g>

          {/* GPU label */}
          <text
            x={gpu.x + 40}
            y="158"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontFamily="var(--font-sans)"
            fontWeight="600"
          >
            {gpu.label}
          </text>
        </motion.g>
      ))}

      {/* Arrows from GPUs back up to sync node */}
      <motion.g
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        {[95, 185, 275, 365].map((x, i) => (
          <g key={`sync-arrow-${i}`}>
            <motion.line
              x1={x}
              y1="170"
              x2={x}
              y2="190"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.4, delay: 1.6 + i * 0.05, ease: PRODUCTIVE_EASE }}
            />
            <motion.line
              x1={x}
              y1="190"
              x2="230"
              y2="205"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 0.4, delay: 1.7 + i * 0.05, ease: PRODUCTIVE_EASE }}
            />
          </g>
        ))}
      </motion.g>

      {/* Sync Gradients node */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="170"
          y="205"
          width="120"
          height="28"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          rx="14"
        />
        <text
          x="230"
          y="223"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="11"
          fontFamily="var(--font-sans)"
          fontWeight="600"
        >
          Sync Gradients
        </text>
      </motion.g>

      {/* Description label */}
      <motion.text
        x="230"
        y="238"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontFamily="var(--font-sans)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        Each GPU processes a portion of the data
      </motion.text>
    </svg>
  );
}
