'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface QuantizationMemoryDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const BARS = [
  { label: 'float32', size: '28 GB', width: 280, speed: '1\u00D7', exceeds: true },
  { label: 'float16', size: '14 GB', width: 140, speed: '~2\u00D7', exceeds: true },
  { label: 'int8', size: '7 GB', width: 70, speed: '~4\u00D7', exceeds: false },
  { label: 'int4', size: '3.5 GB', width: 35, speed: '~8\u00D7', exceeds: false },
] as const;

const BAR_X = 70;
const BAR_HEIGHT = 26;
const ROW_SPACING = 48;
const FIRST_BAR_Y = 46;

/* Consumer GPU 8 GB threshold as a proportion of float32 (28 GB maps to 280px) */
const THRESHOLD_X = BAR_X + Math.round((8 / 28) * 280); /* ~150 */

export default function QuantizationMemoryDiagram({
  className,
}: QuantizationMemoryDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 260"
      className={className}
      role="img"
      aria-label="Quantization memory diagram showing a 7B-parameter model at float32, float16, int8, and int4 precisions with a consumer GPU memory threshold"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <text
        x="250"
        y="22"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
      >
        7B Model Memory at Different Precisions
      </text>

      {/* ── Precision bars ── */}
      {BARS.map((bar, index) => {
        const y = FIRST_BAR_Y + index * ROW_SPACING;
        const delay = index * 0.15;

        const fillColor = bar.exceeds
          ? 'var(--color-warning-subtle)'
          : 'var(--color-accent-subtle)';
        const strokeColor = bar.exceeds
          ? 'var(--color-warning)'
          : 'var(--color-accent)';
        const labelColor = bar.exceeds
          ? 'var(--color-warning)'
          : 'var(--color-accent)';

        return (
          <g key={bar.label}>
            {/* Precision label */}
            <motion.text
              x={BAR_X - 6}
              y={y + BAR_HEIGHT / 2 + 4}
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
              textAnchor="end"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
            >
              {bar.label}
            </motion.text>

            {/* Animated bar */}
            <motion.rect
              x={BAR_X}
              y={y}
              width={bar.width}
              height={BAR_HEIGHT}
              rx="4"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                isInView
                  ? { scaleX: 1, opacity: 1 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 0.6, delay, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: `${BAR_X}px center` }}
            />

            {/* Size label at end of bar */}
            <motion.text
              x={BAR_X + bar.width + 8}
              y={y + BAR_HEIGHT / 2 + 4}
              fill={labelColor}
              fontSize="10"
              fontWeight="600"
              initial={{ opacity: 0, x: -8 }}
              animate={
                isInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -8 }
              }
              transition={{
                duration: 0.4,
                delay: delay + 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {bar.size}
            </motion.text>

            {/* Speedup badge */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: delay + 0.45,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${BAR_X + bar.width + 68}px ${y + BAR_HEIGHT / 2}px`,
              }}
            >
              <rect
                x={BAR_X + bar.width + 48}
                y={y + 4}
                width="36"
                height="18"
                rx="9"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border-primary)"
                strokeWidth="1"
              />
              <text
                x={BAR_X + bar.width + 66}
                y={y + 16}
                fill="var(--color-text-secondary)"
                fontSize="9"
                fontWeight="600"
                textAnchor="middle"
              >
                {bar.speed}
              </text>
            </motion.g>
          </g>
        );
      })}

      {/* ── Consumer GPU threshold line ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={THRESHOLD_X}
          y1={FIRST_BAR_Y - 10}
          x2={THRESHOLD_X}
          y2={FIRST_BAR_Y + 4 * ROW_SPACING - 18}
          stroke="var(--color-error)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />

        {/* Threshold label background */}
        <rect
          x={THRESHOLD_X - 62}
          y={FIRST_BAR_Y - 24}
          width="124"
          height="14"
          rx="3"
          fill="var(--color-bg-primary)"
          opacity="0.85"
        />
        <text
          x={THRESHOLD_X}
          y={FIRST_BAR_Y - 14}
          fill="var(--color-error)"
          fontSize="8.5"
          fontWeight="600"
          textAnchor="middle"
        >
          Consumer GPU Memory (~8GB)
        </text>
      </motion.g>

      {/* ── Annotation bracket + label ── */}
      <motion.g
        initial={{ opacity: 0, x: 10 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        {/* Bracket spanning int8 and int4 rows */}
        {(() => {
          const y1 = FIRST_BAR_Y + 2 * ROW_SPACING + 2;
          const y2 = FIRST_BAR_Y + 3 * ROW_SPACING + BAR_HEIGHT - 2;
          const bx = BAR_X + BARS[2].width + 100;
          return (
            <>
              <path
                d={`M ${bx} ${y1} L ${bx + 8} ${y1} L ${bx + 8} ${(y1 + y2) / 2 - 4}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${bx + 8} ${(y1 + y2) / 2 + 4} L ${bx + 8} ${y2} L ${bx} ${y2}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Arrow tip */}
              <path
                d={`M ${bx + 8} ${(y1 + y2) / 2 - 4} L ${bx + 14} ${(y1 + y2) / 2} L ${bx + 8} ${(y1 + y2) / 2 + 4}`}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          );
        })()}

        {/* Annotation text */}
        <text
          x={BAR_X + BARS[2].width + 120}
          y={FIRST_BAR_Y + 2.5 * ROW_SPACING + BAR_HEIGHT / 2 - 4}
          fill="var(--color-accent)"
          fontSize="9.5"
          fontWeight="600"
        >
          int8/int4 fit on
        </text>
        <text
          x={BAR_X + BARS[2].width + 120}
          y={FIRST_BAR_Y + 2.5 * ROW_SPACING + BAR_HEIGHT / 2 + 8}
          fill="var(--color-accent)"
          fontSize="9.5"
          fontWeight="600"
        >
          consumer hardware
        </text>
      </motion.g>

      {/* ── Bottom legend ── */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="250"
          y="248"
          fill="var(--color-text-tertiary)"
          fontSize="9.5"
          textAnchor="middle"
        >
          Lower precision = smaller model = faster inference
        </text>
      </motion.g>
    </svg>
  );
}
