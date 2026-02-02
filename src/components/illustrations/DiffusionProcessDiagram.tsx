'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DiffusionProcessDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function DiffusionProcessDiagram({ className = '' }: DiffusionProcessDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Deterministic noise patterns for each step
  const noisePatterns = [
    // t=0: No noise
    [],
    // t=1: Light noise (8 dots)
    [
      { x: 15, y: 12 }, { x: 45, y: 18 }, { x: 22, y: 48 }, { x: 52, y: 38 },
      { x: 8, y: 35 }, { x: 38, y: 8 }, { x: 48, y: 52 }, { x: 18, y: 55 }
    ],
    // t=2: Medium noise (16 dots)
    [
      { x: 12, y: 8 }, { x: 28, y: 6 }, { x: 45, y: 12 }, { x: 54, y: 22 },
      { x: 8, y: 25 }, { x: 52, y: 35 }, { x: 18, y: 42 }, { x: 38, y: 48 },
      { x: 48, y: 8 }, { x: 6, y: 48 }, { x: 25, y: 55 }, { x: 42, y: 25 },
      { x: 55, y: 52 }, { x: 15, y: 18 }, { x: 35, y: 35 }, { x: 58, y: 8 }
    ],
    // t=3: Heavy noise (24 dots)
    [
      { x: 8, y: 6 }, { x: 18, y: 8 }, { x: 28, y: 6 }, { x: 38, y: 8 }, { x: 48, y: 6 }, { x: 58, y: 8 },
      { x: 6, y: 18 }, { x: 52, y: 18 }, { x: 12, y: 28 }, { x: 42, y: 28 }, { x: 58, y: 28 },
      { x: 8, y: 38 }, { x: 22, y: 38 }, { x: 48, y: 38 }, { x: 6, y: 48 }, { x: 35, y: 48 },
      { x: 52, y: 48 }, { x: 15, y: 52 }, { x: 28, y: 55 }, { x: 45, y: 52 }, { x: 58, y: 55 },
      { x: 18, y: 15 }, { x: 42, y: 15 }, { x: 32, y: 22 }
    ],
    // t=T: Full noise (32 dots, shape barely visible)
    [
      { x: 6, y: 6 }, { x: 14, y: 6 }, { x: 22, y: 6 }, { x: 30, y: 6 }, { x: 38, y: 6 }, { x: 46, y: 6 }, { x: 54, y: 6 }, { x: 58, y: 6 },
      { x: 6, y: 14 }, { x: 18, y: 14 }, { x: 42, y: 14 }, { x: 54, y: 14 }, { x: 58, y: 14 },
      { x: 6, y: 22 }, { x: 22, y: 22 }, { x: 38, y: 22 }, { x: 58, y: 22 },
      { x: 6, y: 30 }, { x: 14, y: 30 }, { x: 46, y: 30 }, { x: 58, y: 30 },
      { x: 6, y: 38 }, { x: 26, y: 38 }, { x: 50, y: 38 }, { x: 58, y: 38 },
      { x: 6, y: 46 }, { x: 18, y: 46 }, { x: 34, y: 46 }, { x: 54, y: 46 }, { x: 58, y: 46 },
      { x: 10, y: 54 }, { x: 30, y: 54 }, { x: 50, y: 54 }
    ]
  ];

  const steps = [
    { x: 40, label: 't=0', noise: 0 },
    { x: 140, label: 't=1', noise: 1 },
    { x: 240, label: 't=2', noise: 2 },
    { x: 340, label: 't=3', noise: 3 },
    { x: 440, label: 't=T', noise: 4 }
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 200"
      className={className}
      role="img"
      aria-label="Diffusion process diagram showing forward noise addition and reverse denoising"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Title */}
      <text
        x="260"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
      >
        Diffusion Process
      </text>

      {/* Steps with frames */}
      {steps.map((step, index) => {
        const noiseLevel = step.noise;
        const opacity = 1 - (noiseLevel * 0.15); // Shape fades slightly with noise

        return (
          <motion.g
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: PRODUCTIVE_EASE
            }}
          >
            {/* Frame */}
            <rect
              x={step.x - 30}
              y="45"
              width="60"
              height="60"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
              rx="4"
            />

            {/* Original shape (star) - fades as noise increases */}
            {noiseLevel < 5 && (
              <g opacity={opacity}>
                {/* Center circle */}
                <circle
                  cx={step.x}
                  cy="75"
                  r="12"
                  fill="var(--color-accent)"
                  opacity={0.8}
                />
                {/* Star points */}
                <circle cx={step.x} cy="60" r="4" fill="var(--color-accent)" />
                <circle cx={step.x + 10} cy="65" r="4" fill="var(--color-accent)" />
                <circle cx={step.x + 10} cy="85" r="4" fill="var(--color-accent)" />
                <circle cx={step.x} cy="90" r="4" fill="var(--color-accent)" />
                <circle cx={step.x - 10} cy="85" r="4" fill="var(--color-accent)" />
                <circle cx={step.x - 10} cy="65" r="4" fill="var(--color-accent)" />
              </g>
            )}

            {/* Noise dots */}
            {noisePatterns[noiseLevel].map((dot, dotIndex) => (
              <motion.circle
                key={dotIndex}
                cx={step.x - 30 + dot.x}
                cy={45 + dot.y}
                r="1.5"
                fill="var(--color-text-tertiary)"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 0.6, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.15 + dotIndex * 0.01,
                  ease: PRODUCTIVE_EASE
                }}
              />
            ))}

            {/* Step label */}
            <text
              x={step.x}
              y="125"
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize="11"
              fontWeight="500"
            >
              {step.label}
            </text>

            {/* Arrow to next step (except last) */}
            {index < steps.length - 1 && (
              <motion.g
                initial={{ opacity: 0, x: -5 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15 + 0.2,
                  ease: PRODUCTIVE_EASE
                }}
              >
                <line
                  x1={step.x + 35}
                  y1="75"
                  x2={steps[index + 1].x - 35}
                  y2="75"
                  stroke="var(--color-text-secondary)"
                  strokeWidth="1.5"
                  markerEnd="url(#arrowhead-forward)"
                />
              </motion.g>
            )}
          </motion.g>
        );
      })}

      {/* Forward process label */}
      <motion.text
        x="260"
        y="42"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Add Noise (Forward)
      </motion.text>

      {/* Reverse process arrow */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1, ease: PRODUCTIVE_EASE }}
      >
        {/* Arrow path */}
        <motion.line
          x1={440}
          y1="145"
          x2={40}
          y2="145"
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-reverse)"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: PRODUCTIVE_EASE }}
        />

        {/* Reverse process label */}
        <text
          x="260"
          y="165"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          Denoise (Reverse) - Learned
        </text>
      </motion.g>

      {/* Arrow markers */}
      <defs>
        <marker
          id="arrowhead-forward"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
        <marker
          id="arrowhead-reverse"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 8 4, 0 8"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>
    </svg>
  );
}
