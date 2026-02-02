'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AutoregressiveGenDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function AutoregressiveGenDiagram({
  className = '',
}: AutoregressiveGenDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    { tokens: ['The'], newToken: 'cat', label: 'Step 1' },
    { tokens: ['The', 'cat'], newToken: 'sat', label: 'Step 2' },
    { tokens: ['The', 'cat', 'sat'], newToken: 'on', label: 'Step 3' },
  ];

  const tokenWidth = 50;
  const tokenHeight = 28;
  const modelWidth = 36;
  const modelHeight = 28;
  const spacing = 8;
  const rowHeight = 55;
  const startX = 70;
  const startY = 25;

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 200"
      className={className}
      role="img"
      aria-label="Autoregressive generation showing token-by-token prediction with growing context"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-autoreg"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {steps.map((step, rowIndex) => {
        const y = startY + rowIndex * rowHeight;
        let currentX = startX;

        return (
          <motion.g
            key={rowIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            transition={{
              duration: 0.5,
              delay: rowIndex * 0.2,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Step Label */}
            <text
              x={10}
              y={y + tokenHeight / 2}
              fill="var(--color-text-secondary)"
              fontSize="12"
              fontWeight="500"
              dominantBaseline="middle"
            >
              {step.label}
            </text>

            {/* Existing Tokens */}
            {step.tokens.map((token, tokenIndex) => {
              const tokenX = currentX;
              currentX += tokenWidth + spacing;

              return (
                <g key={tokenIndex}>
                  <rect
                    x={tokenX}
                    y={y}
                    width={tokenWidth}
                    height={tokenHeight}
                    rx="4"
                    fill="var(--color-bg-elevated)"
                    stroke="var(--color-border-primary)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tokenX + tokenWidth / 2}
                    y={y + tokenHeight / 2}
                    fill="var(--color-text-primary)"
                    fontSize="13"
                    fontWeight="500"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {token}
                  </text>
                </g>
              );
            })}

            {/* Model Box */}
            <g>
              <rect
                x={currentX}
                y={y}
                width={modelWidth}
                height={modelHeight}
                rx="4"
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border-primary)"
                strokeWidth="1.5"
              />
              <text
                x={currentX + modelWidth / 2}
                y={y + modelHeight / 2}
                fill="var(--color-text-secondary)"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                LM
              </text>
            </g>

            {/* Arrow from Model to New Token */}
            <motion.line
              x1={currentX + modelWidth}
              y1={y + modelHeight / 2}
              x2={currentX + modelWidth + spacing}
              y2={y + tokenHeight / 2}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead-autoreg)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                isInView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: rowIndex * 0.2 + 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* New Token (Predicted) */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isInView
                  ? { scale: 1, opacity: 1 }
                  : { scale: 0, opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: rowIndex * 0.2 + 0.5,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <rect
                x={currentX + modelWidth + spacing * 2}
                y={y}
                width={tokenWidth}
                height={tokenHeight}
                rx="4"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="2"
              />
              <text
                x={currentX + modelWidth + spacing * 2 + tokenWidth / 2}
                y={y + tokenHeight / 2}
                fill="var(--color-accent)"
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {step.newToken}
              </text>
            </motion.g>

            {/* Context Arrow (subtle indicator showing growth) */}
            {rowIndex < steps.length - 1 && (
              <motion.line
                x1={startX + (step.tokens.length * (tokenWidth + spacing)) / 2}
                y1={y + tokenHeight + 8}
                x2={startX + (step.tokens.length * (tokenWidth + spacing)) / 2}
                y2={y + tokenHeight + 18}
                stroke="var(--color-text-tertiary)"
                strokeWidth="1"
                strokeDasharray="2,2"
                opacity="0.4"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: rowIndex * 0.2 + 0.6,
                }}
              />
            )}
          </motion.g>
        );
      })}

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <text
          x={10}
          y={185}
          fill="var(--color-text-tertiary)"
          fontSize="10"
          fontWeight="500"
        >
          Context grows with each prediction
        </text>
      </motion.g>
    </svg>
  );
}
