'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface KFoldValidationDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function KFoldValidationDiagram({
  className = '',
}: KFoldValidationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const folds = [
    { label: 'Fold 1', validationIndex: 0, score: '92%' },
    { label: 'Fold 2', validationIndex: 1, score: '88%' },
    { label: 'Fold 3', validationIndex: 2, score: '91%' },
    { label: 'Fold 4', validationIndex: 3, score: '89%' },
  ];

  const segmentWidth = 60;
  const segmentHeight = 32;
  const startX = 90;
  const rowSpacing = 45;
  const startY = 20;

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 220"
      role="img"
      aria-label="K-fold cross-validation diagram showing 4-fold validation with training and validation segments"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Rows representing each fold */}
      {folds.map((fold, foldIndex) => {
        const y = startY + foldIndex * rowSpacing;

        return (
          <motion.g
            key={fold.label}
            initial={{ opacity: 0, x: -20 }}
            animate={
              isInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -20 }
            }
            transition={{
              duration: 0.5,
              delay: foldIndex * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Fold label */}
            <text
              x={10}
              y={y + segmentHeight / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fill="var(--color-text-secondary)"
              fontSize="13"
              fontWeight="500"
            >
              {fold.label}
            </text>

            {/* Segments */}
            {[0, 1, 2, 3].map((segmentIndex) => {
              const x = startX + segmentIndex * segmentWidth;
              const isValidation = segmentIndex === fold.validationIndex;

              return (
                <g key={segmentIndex}>
                  {/* Segment rectangle */}
                  <rect
                    x={x}
                    y={y}
                    width={segmentWidth}
                    height={segmentHeight}
                    fill={
                      isValidation
                        ? 'var(--color-accent)'
                        : 'var(--color-bg-tertiary)'
                    }
                    stroke="var(--color-border-primary)"
                    strokeWidth="1"
                  />

                  {/* Segment label */}
                  <text
                    x={x + segmentWidth / 2}
                    y={y + segmentHeight / 2}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill={
                      isValidation
                        ? 'var(--color-bg-primary)'
                        : 'var(--color-text-tertiary)'
                    }
                    fontSize="11"
                    fontWeight={isValidation ? '600' : '500'}
                  >
                    {isValidation ? 'Val' : 'Train'}
                  </text>
                </g>
              );
            })}

            {/* Score value */}
            <text
              x={startX + 4 * segmentWidth + 20}
              y={y + segmentHeight / 2}
              dominantBaseline="middle"
              textAnchor="start"
              fill="var(--color-text-primary)"
              fontSize="13"
              fontWeight="600"
            >
              {fold.score}
            </text>
          </motion.g>
        );
      })}

      {/* Final score text */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={
          isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
        }
        transition={{
          duration: 0.5,
          delay: 0.5,
          ease: PRODUCTIVE_EASE,
        }}
      >
        <text
          x={220}
          y={200}
          dominantBaseline="middle"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="14"
          fontWeight="500"
        >
          Final Score = average (90%)
        </text>
      </motion.g>
    </svg>
  );
}
