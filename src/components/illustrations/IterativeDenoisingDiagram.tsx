'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface IterativeDenoisingDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function IterativeDenoisingDiagram({
  className = '',
}: IterativeDenoisingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stages = [
    { x: 35, stepLabel: 'Step T', phaseLabel: 'Broad composition' },
    { x: 150, stepLabel: 'Step T/2', phaseLabel: 'Structure' },
    { x: 265, stepLabel: 'Step T/4', phaseLabel: 'Textures' },
    { x: 380, stepLabel: 'Step 10', phaseLabel: 'Details' },
    { x: 495, stepLabel: 'Step 0', phaseLabel: 'Final' },
  ];

  const frameW = 70;
  const frameH = 70;
  const frameY = 52;

  // --- Stage 0: Pure noise (scattered dots) ---
  const noiseDots: { x: number; y: number; r: number }[] = [
    { x: 6, y: 6, r: 2 }, { x: 18, y: 4, r: 1.5 }, { x: 30, y: 8, r: 2 },
    { x: 44, y: 5, r: 1.5 }, { x: 56, y: 7, r: 2 }, { x: 64, y: 3, r: 1.5 },
    { x: 10, y: 16, r: 1.5 }, { x: 24, y: 18, r: 2 }, { x: 38, y: 14, r: 1.5 },
    { x: 50, y: 19, r: 2 }, { x: 62, y: 15, r: 1.5 }, { x: 4, y: 28, r: 2 },
    { x: 16, y: 30, r: 1.5 }, { x: 28, y: 26, r: 2 }, { x: 42, y: 32, r: 1.5 },
    { x: 54, y: 28, r: 2 }, { x: 66, y: 30, r: 1.5 }, { x: 8, y: 40, r: 2 },
    { x: 22, y: 42, r: 1.5 }, { x: 34, y: 38, r: 2 }, { x: 48, y: 44, r: 1.5 },
    { x: 60, y: 40, r: 2 }, { x: 3, y: 52, r: 1.5 }, { x: 14, y: 54, r: 2 },
    { x: 26, y: 50, r: 1.5 }, { x: 40, y: 56, r: 2 }, { x: 52, y: 52, r: 1.5 },
    { x: 64, y: 56, r: 2 }, { x: 10, y: 64, r: 1.5 }, { x: 32, y: 62, r: 2 },
    { x: 46, y: 66, r: 1.5 }, { x: 58, y: 63, r: 2 }, { x: 20, y: 58, r: 1.5 },
    { x: 36, y: 46, r: 1.5 }, { x: 50, y: 10, r: 2 }, { x: 12, y: 48, r: 1.5 },
  ];

  // --- Stage 1: Rough blobs emerging ---
  const roughBlobs: { cx: number; cy: number; rx: number; ry: number; opacity: number }[] = [
    { cx: 35, cy: 20, rx: 28, ry: 12, opacity: 0.2 },
    { cx: 35, cy: 50, rx: 22, ry: 18, opacity: 0.25 },
    { cx: 20, cy: 38, rx: 14, ry: 10, opacity: 0.15 },
    { cx: 52, cy: 40, rx: 12, ry: 16, opacity: 0.2 },
  ];
  const roughNoise: { x: number; y: number; r: number }[] = [
    { x: 8, y: 8, r: 1.5 }, { x: 22, y: 5, r: 1.5 }, { x: 48, y: 10, r: 1.5 },
    { x: 60, y: 6, r: 1.5 }, { x: 5, y: 24, r: 1.5 }, { x: 62, y: 22, r: 1.5 },
    { x: 14, y: 60, r: 1.5 }, { x: 38, y: 62, r: 1.5 }, { x: 56, y: 58, r: 1.5 },
    { x: 30, y: 34, r: 1.5 }, { x: 44, y: 28, r: 1.5 }, { x: 10, y: 50, r: 1.5 },
    { x: 64, y: 46, r: 1.5 }, { x: 18, y: 16, r: 1.5 }, { x: 52, y: 54, r: 1.5 },
  ];

  // --- Stage 2: Basic outlines of a landscape ---
  const outlineNoise: { x: number; y: number; r: number }[] = [
    { x: 8, y: 10, r: 1.2 }, { x: 56, y: 8, r: 1.2 }, { x: 30, y: 6, r: 1.2 },
    { x: 62, y: 22, r: 1.2 }, { x: 6, y: 42, r: 1.2 }, { x: 48, y: 60, r: 1.2 },
    { x: 18, y: 56, r: 1.2 }, { x: 40, y: 14, r: 1.2 },
  ];

  // --- Stage 3: Detailed features ---
  const detailNoise: { x: number; y: number; r: number }[] = [
    { x: 12, y: 8, r: 1 }, { x: 52, y: 12, r: 1 }, { x: 62, y: 38, r: 1 },
    { x: 8, y: 55, r: 1 },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 580 220"
      className={className}
      role="img"
      aria-label="Iterative denoising process showing progressive generation from pure noise to a clean image across five stages"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-denoise"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
        <clipPath id="stage-clip-0">
          <rect x={stages[0].x - frameW / 2 + 1.5} y={frameY + 1.5} width={frameW - 3} height={frameH - 3} rx="3" />
        </clipPath>
        <clipPath id="stage-clip-1">
          <rect x={stages[1].x - frameW / 2 + 1.5} y={frameY + 1.5} width={frameW - 3} height={frameH - 3} rx="3" />
        </clipPath>
        <clipPath id="stage-clip-2">
          <rect x={stages[2].x - frameW / 2 + 1.5} y={frameY + 1.5} width={frameW - 3} height={frameH - 3} rx="3" />
        </clipPath>
        <clipPath id="stage-clip-3">
          <rect x={stages[3].x - frameW / 2 + 1.5} y={frameY + 1.5} width={frameW - 3} height={frameH - 3} rx="3" />
        </clipPath>
        <clipPath id="stage-clip-4">
          <rect x={stages[4].x - frameW / 2 + 1.5} y={frameY + 1.5} width={frameW - 3} height={frameH - 3} rx="3" />
        </clipPath>
      </defs>

      {/* Title */}
      <motion.text
        x="290"
        y="18"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Iterative Denoising Process
      </motion.text>

      {/* Subtitle */}
      <motion.text
        x="290"
        y="34"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        Noise → Image
      </motion.text>

      {/* Stages */}
      {stages.map((stage, index) => {
        const fx = stage.x - frameW / 2;
        const baseDelay = index * 0.2;

        return (
          <motion.g
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.5,
              delay: baseDelay,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Frame */}
            <rect
              x={fx}
              y={frameY}
              width={frameW}
              height={frameH}
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
            />

            {/* Stage 0: Pure noise */}
            {index === 0 && (
              <g clipPath="url(#stage-clip-0)">
                {noiseDots.map((dot, i) => (
                  <motion.circle
                    key={i}
                    cx={fx + dot.x}
                    cy={frameY + dot.y}
                    r={dot.r}
                    fill="var(--color-text-tertiary)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: baseDelay + i * 0.008,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                ))}
              </g>
            )}

            {/* Stage 1: Rough blobs with residual noise */}
            {index === 1 && (
              <g clipPath="url(#stage-clip-1)">
                {roughBlobs.map((blob, i) => (
                  <motion.ellipse
                    key={`blob-${i}`}
                    cx={fx + blob.cx}
                    cy={frameY + blob.cy}
                    rx={blob.rx}
                    ry={blob.ry}
                    fill="var(--color-accent)"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: blob.opacity, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{
                      duration: 0.4,
                      delay: baseDelay + 0.1 + i * 0.06,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                ))}
                {roughNoise.map((dot, i) => (
                  <motion.circle
                    key={`noise-${i}`}
                    cx={fx + dot.x}
                    cy={frameY + dot.y}
                    r={dot.r}
                    fill="var(--color-text-tertiary)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: baseDelay + 0.15 + i * 0.01,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                ))}
              </g>
            )}

            {/* Stage 2: Basic landscape outlines */}
            {index === 2 && (
              <g clipPath="url(#stage-clip-2)">
                {/* Sky region */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 1.5}
                  width={frameW - 3}
                  height={frameH * 0.45}
                  fill="var(--color-info)"
                  opacity="0.1"
                />
                {/* Sun circle */}
                <motion.circle
                  cx={fx + 52}
                  cy={frameY + 18}
                  r="8"
                  fill="var(--color-accent)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.15, ease: PRODUCTIVE_EASE }}
                />
                {/* Mountain outlines */}
                <motion.polygon
                  points={`${fx + 2},${frameY + 50} ${fx + 18},${frameY + 28} ${fx + 35},${frameY + 42} ${fx + 50},${frameY + 30} ${fx + 68},${frameY + 50}`}
                  fill="var(--color-text-primary)"
                  stroke="var(--color-text-primary)"
                  strokeWidth="0.8"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.1, ease: PRODUCTIVE_EASE }}
                />
                {/* Ground region */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 50}
                  width={frameW - 3}
                  height={frameH - 51.5}
                  fill="var(--color-success)"
                  opacity="0.1"
                />
                {/* Residual noise */}
                {outlineNoise.map((dot, i) => (
                  <motion.circle
                    key={i}
                    cx={fx + dot.x}
                    cy={frameY + dot.y}
                    r={dot.r}
                    fill="var(--color-text-tertiary)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: baseDelay + 0.2 + i * 0.01,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                ))}
              </g>
            )}

            {/* Stage 3: Detailed features */}
            {index === 3 && (
              <g clipPath="url(#stage-clip-3)">
                {/* Sky gradient region */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 1.5}
                  width={frameW - 3}
                  height={frameH * 0.45}
                  fill="var(--color-info)"
                  opacity="0.15"
                />
                {/* Sun with glow */}
                <motion.circle
                  cx={fx + 52}
                  cy={frameY + 16}
                  r="10"
                  fill="var(--color-accent)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.15 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.1, ease: PRODUCTIVE_EASE }}
                />
                <motion.circle
                  cx={fx + 52}
                  cy={frameY + 16}
                  r="6"
                  fill="var(--color-accent)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.45 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.12, ease: PRODUCTIVE_EASE }}
                />
                {/* Mountains with more definition */}
                <motion.polygon
                  points={`${fx + 2},${frameY + 48} ${fx + 16},${frameY + 26} ${fx + 30},${frameY + 40}`}
                  fill="var(--color-text-primary)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.08, ease: PRODUCTIVE_EASE }}
                />
                <motion.polygon
                  points={`${fx + 22},${frameY + 48} ${fx + 40},${frameY + 24} ${fx + 58},${frameY + 38} ${fx + 68},${frameY + 48}`}
                  fill="var(--color-text-primary)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.1, ease: PRODUCTIVE_EASE }}
                />
                {/* Green ground */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 48}
                  width={frameW - 3}
                  height={frameH - 49.5}
                  fill="var(--color-success)"
                  opacity="0.15"
                />
                {/* Tree shapes */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.25 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: baseDelay + 0.2, ease: PRODUCTIVE_EASE }}
                >
                  <polygon
                    points={`${fx + 12},${frameY + 50} ${fx + 15},${frameY + 40} ${fx + 18},${frameY + 50}`}
                    fill="var(--color-success)"
                  />
                  <polygon
                    points={`${fx + 54},${frameY + 50} ${fx + 57},${frameY + 42} ${fx + 60},${frameY + 50}`}
                    fill="var(--color-success)"
                  />
                </motion.g>
                {/* Minimal residual noise */}
                {detailNoise.map((dot, i) => (
                  <motion.circle
                    key={i}
                    cx={fx + dot.x}
                    cy={frameY + dot.y}
                    r={dot.r}
                    fill="var(--color-text-tertiary)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: baseDelay + 0.25 + i * 0.01,
                      ease: PRODUCTIVE_EASE,
                    }}
                  />
                ))}
              </g>
            )}

            {/* Stage 4: Clean final image */}
            {index === 4 && (
              <g clipPath="url(#stage-clip-4)">
                {/* Sky */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 1.5}
                  width={frameW - 3}
                  height={frameH * 0.45}
                  fill="var(--color-info)"
                  opacity="0.18"
                />
                {/* Sun with glow rings */}
                <motion.circle
                  cx={fx + 52}
                  cy={frameY + 16}
                  r="12"
                  fill="var(--color-accent)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.12 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: baseDelay + 0.1, ease: PRODUCTIVE_EASE }}
                />
                <motion.circle
                  cx={fx + 52}
                  cy={frameY + 16}
                  r="7"
                  fill="var(--color-accent)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.55 } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: baseDelay + 0.12, ease: PRODUCTIVE_EASE }}
                />
                {/* Back mountain */}
                <motion.polygon
                  points={`${fx + 2},${frameY + 46} ${fx + 16},${frameY + 24} ${fx + 30},${frameY + 38} ${fx + 38},${frameY + 46}`}
                  fill="var(--color-text-primary)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.08, ease: PRODUCTIVE_EASE }}
                />
                {/* Front mountain */}
                <motion.polygon
                  points={`${fx + 20},${frameY + 46} ${fx + 40},${frameY + 22} ${fx + 58},${frameY + 36} ${fx + 68},${frameY + 46}`}
                  fill="var(--color-text-primary)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.32 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.1, ease: PRODUCTIVE_EASE }}
                />
                {/* Snow cap */}
                <motion.polygon
                  points={`${fx + 37},${frameY + 28} ${fx + 40},${frameY + 22} ${fx + 43},${frameY + 28}`}
                  fill="var(--color-bg-elevated)"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: baseDelay + 0.2, ease: PRODUCTIVE_EASE }}
                />
                {/* Ground */}
                <rect
                  x={fx + 1.5}
                  y={frameY + 46}
                  width={frameW - 3}
                  height={frameH - 47.5}
                  fill="var(--color-success)"
                  opacity="0.18"
                />
                {/* Trees */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 0.35 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: baseDelay + 0.2, ease: PRODUCTIVE_EASE }}
                >
                  {/* Tree trunks */}
                  <rect x={fx + 13.5} y={frameY + 50} width="1.5" height="6" fill="var(--color-warning)" opacity="0.5" rx="0.5" />
                  <rect x={fx + 24.5} y={frameY + 52} width="1.5" height="5" fill="var(--color-warning)" opacity="0.5" rx="0.5" />
                  <rect x={fx + 55.5} y={frameY + 50} width="1.5" height="6" fill="var(--color-warning)" opacity="0.5" rx="0.5" />
                  {/* Tree canopies */}
                  <polygon
                    points={`${fx + 10},${frameY + 50} ${fx + 14.5},${frameY + 38} ${fx + 19},${frameY + 50}`}
                    fill="var(--color-success)"
                  />
                  <polygon
                    points={`${fx + 21},${frameY + 52} ${fx + 25.5},${frameY + 42} ${fx + 30},${frameY + 52}`}
                    fill="var(--color-success)"
                  />
                  <polygon
                    points={`${fx + 52},${frameY + 50} ${fx + 56.5},${frameY + 40} ${fx + 61},${frameY + 50}`}
                    fill="var(--color-success)"
                  />
                </motion.g>
                {/* Path / river */}
                <motion.path
                  d={`M ${fx + 35},${frameY + 68} Q ${fx + 38},${frameY + 58} ${fx + 44},${frameY + 50}`}
                  stroke="var(--color-info)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 0.2 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.4, delay: baseDelay + 0.25, ease: PRODUCTIVE_EASE }}
                />
              </g>
            )}

            {/* Step label above frame */}
            <text
              x={stage.x}
              y={frameY - 6}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="10"
              fontWeight="600"
            >
              {stage.stepLabel}
            </text>

            {/* Phase label below frame */}
            <text
              x={stage.x}
              y={frameY + frameH + 16}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              fontWeight="500"
            >
              {stage.phaseLabel}
            </text>

            {/* Arrow and "Denoise" label to next stage */}
            {index < stages.length - 1 && (
              <motion.g
                initial={{ opacity: 0, x: -4 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
                transition={{
                  duration: 0.4,
                  delay: baseDelay + 0.25,
                  ease: PRODUCTIVE_EASE,
                }}
              >
                <line
                  x1={stage.x + frameW / 2 + 4}
                  y1={frameY + frameH / 2}
                  x2={stages[index + 1].x - frameW / 2 - 4}
                  y2={frameY + frameH / 2}
                  stroke="var(--color-accent)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead-denoise)"
                />
                <text
                  x={(stage.x + stages[index + 1].x) / 2}
                  y={frameY + frameH / 2 - 6}
                  textAnchor="middle"
                  fill="var(--color-accent)"
                  fontSize="9"
                  fontWeight="500"
                >
                  Denoise
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

      {/* Bottom annotation: arrow from left to right with "Increasing clarity" */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={stages[0].x}
          y1="200"
          x2={stages[4].x}
          y2="200"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          strokeDasharray="4,3"
        />
        <polygon
          points={`${stages[4].x - 5},197 ${stages[4].x},200 ${stages[4].x - 5},203`}
          fill="var(--color-border-primary)"
        />
        <text
          x="290"
          y="214"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Increasing clarity
        </text>
      </motion.g>
    </svg>
  );
}
