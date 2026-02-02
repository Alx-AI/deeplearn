'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface QuantizationDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function QuantizationDiagram({ className }: QuantizationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const precisionData = [
    { label: 'FP32', value: '0.123456789...', barWidth: 240, memory: '4×', color: 'var(--color-bg-tertiary)' },
    { label: 'FP16', value: '0.1235', barWidth: 180, memory: '2×', color: 'var(--color-border-primary)' },
    { label: 'INT8', value: '31', barWidth: 120, memory: '1×', color: 'var(--color-accent-subtle)' },
  ];

  const barY = 40;
  const barHeight = 24;
  const rowSpacing = 50;

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 200"
      className={className}
      role="img"
      aria-label="Quantization diagram showing precision reduction from FP32 to FP16 to INT8 with memory savings"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrow marker for tradeoff indicator */}
        <marker
          id="arrowhead-quantization"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* Title */}
      <text
        x="220"
        y="20"
        fill="var(--color-text-primary)"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
      >
        Precision Reduction
      </text>

      {/* Precision bars */}
      {precisionData.map((item, index) => {
        const y = barY + index * rowSpacing;
        const delay = index * 0.15;

        return (
          <g key={item.label}>
            {/* Precision label */}
            <motion.text
              x="40"
              y={y + barHeight / 2 + 4}
              fill="var(--color-text-primary)"
              fontSize="11"
              fontWeight="600"
              textAnchor="end"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
            >
              {item.label}
            </motion.text>

            {/* Bar background */}
            <motion.rect
              x="55"
              y={y}
              width={item.barWidth}
              height={barHeight}
              rx="4"
              fill={item.color}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.6, delay, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: '55px center' }}
            />

            {/* Bit pattern decoration */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.3 }}
            >
              {Array.from({ length: Math.floor(item.barWidth / 12) }).map((_, i) => (
                <line
                  key={i}
                  x1={60 + i * 12}
                  y1={y + 4}
                  x2={60 + i * 12}
                  y2={y + barHeight - 4}
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="0.5"
                />
              ))}
            </motion.g>

            {/* Value label */}
            <motion.text
              x={55 + item.barWidth + 10}
              y={y + barHeight / 2 + 4}
              fill="var(--color-text-secondary)"
              fontSize="10"
              fontFamily="monospace"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.5, delay: delay + 0.2, ease: PRODUCTIVE_EASE }}
            >
              {item.value}
            </motion.text>

            {/* Memory savings badge */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.4, ease: PRODUCTIVE_EASE }}
              style={{ transformOrigin: `${55 + item.barWidth + 80}px ${y + barHeight / 2}px` }}
            >
              <rect
                x={55 + item.barWidth + 70}
                y={y + 4}
                width="32"
                height="16"
                rx="8"
                fill={index === 2 ? 'var(--color-accent)' : 'var(--color-bg-elevated)'}
                stroke="var(--color-border-primary)"
                strokeWidth="1"
              />
              <text
                x={55 + item.barWidth + 86}
                y={y + 15}
                fill={index === 2 ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'}
                fontSize="10"
                fontWeight="600"
                textAnchor="middle"
              >
                {item.memory}
              </text>
            </motion.g>
          </g>
        );
      })}

      {/* Right side indicators */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.6, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Size arrow (decreasing) */}
        <line
          x1="370"
          y1="55"
          x2="370"
          y2="125"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-quantization)"
        />
        <text
          x="385"
          y="70"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="500"
        >
          Size
        </text>

        {/* Speed arrow (increasing) */}
        <line
          x1="410"
          y1="125"
          x2="410"
          y2="55"
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-quantization)"
        />
        <text
          x="385"
          y="120"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="500"
        >
          Speed
        </text>
      </motion.g>

      {/* Tradeoff indicator */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <text
          x="390"
          y="93"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          textAnchor="middle"
        >
          ⇅
        </text>
      </motion.g>

      {/* Bottom legend */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="220"
          y="175"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          textAnchor="middle"
        >
          Lower precision = Less memory, faster computation
        </text>
        <text
          x="220"
          y="190"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          textAnchor="middle"
          fontStyle="italic"
        >
          (with some accuracy tradeoff)
        </text>
      </motion.g>
    </svg>
  );
}
