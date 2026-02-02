'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface EarlyStoppingDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function EarlyStoppingDiagram({
  className = '',
}: EarlyStoppingDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Training loss curve - steadily decreasing
  const trainingPath =
    'M 40 180 Q 80 120, 120 90 Q 160 70, 200 60 Q 240 52, 280 48 Q 320 45, 360 43';

  // Validation loss curve - decreases then rises (minimum at x=220)
  const validationPath =
    'M 40 185 Q 80 135, 120 105 Q 160 85, 200 75 Q 220 72, 240 75 Q 280 85, 320 105 Q 360 130, 380 160';

  // Early stop point (where validation loss is minimum)
  const stopX = 220;
  const stopY = 72;

  // Patience window (5 epochs before stop)
  const patienceStartX = 160;
  const patienceEndX = 220;

  // Would overfit marker
  const overfitX = 320;
  const overfitY = 105;

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 420 220"
        role="img"
        aria-label="Early stopping diagram showing training and validation loss curves with a stop point at minimum validation loss"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Background zones */}
        <motion.rect
          x="40"
          y="30"
          width={stopX - 40}
          height="165"
          fill="var(--color-bg-elevated)"
          opacity="0.3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: PRODUCTIVE_EASE }}
        />
        <motion.rect
          x={stopX}
          y="30"
          width={380 - stopX}
          height="165"
          fill="var(--color-bg-tertiary)"
          opacity="0.3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5, ease: PRODUCTIVE_EASE }}
        />

        {/* Zone labels */}
        <motion.text
          x="130"
          y="25"
          fill="var(--color-text-tertiary)"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          Early stop
        </motion.text>
        <motion.text
          x="300"
          y="25"
          fill="var(--color-text-tertiary)"
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          Would overfit
        </motion.text>

        {/* Axes */}
        <line
          x1="40"
          y1="195"
          x2="380"
          y2="195"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <line
          x1="40"
          y1="30"
          x2="40"
          y2="195"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />

        {/* Axis labels */}
        <text
          x="210"
          y="215"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
        >
          Epochs
        </text>
        <text
          x="25"
          y="115"
          fill="var(--color-text-secondary)"
          fontSize="12"
          fontWeight="500"
          textAnchor="middle"
          transform="rotate(-90, 25, 115)"
        >
          Loss
        </text>

        {/* Training loss curve */}
        <motion.path
          d={trainingPath}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
          }
          transition={{ duration: 1.2, ease: PRODUCTIVE_EASE }}
        />

        {/* Validation loss curve */}
        <motion.path
          d={validationPath}
          fill="none"
          stroke="var(--color-text-secondary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
          }
          transition={{ delay: 0.2, duration: 1.2, ease: PRODUCTIVE_EASE }}
        />

        {/* Legend */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="50"
            y1="50"
            x2="70"
            y2="50"
            stroke="var(--color-accent)"
            strokeWidth="2.5"
          />
          <text
            x="75"
            y="54"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="500"
          >
            Training loss
          </text>

          <line
            x1="180"
            y1="50"
            x2="200"
            y2="50"
            stroke="var(--color-text-secondary)"
            strokeWidth="2.5"
          />
          <text
            x="205"
            y="54"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="500"
          >
            Validation loss
          </text>
        </motion.g>

        {/* Patience bracket annotation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          {/* Bracket */}
          <path
            d={`M ${patienceStartX} 210 L ${patienceStartX} 205 L ${patienceEndX} 205 L ${patienceEndX} 210`}
            fill="none"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
          />
          <text
            x={(patienceStartX + patienceEndX) / 2}
            y="202"
            fill="var(--color-text-tertiary)"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            patience = 5
          </text>
        </motion.g>

        {/* Stop line at minimum validation loss */}
        <motion.line
          x1={stopX}
          y1="30"
          x2={stopX}
          y2="195"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ delay: 1.6, duration: 0.5, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: `${stopX}px 195px` }}
        />

        {/* STOP label */}
        <motion.text
          x={stopX}
          y="18"
          fill="var(--color-accent)"
          fontSize="13"
          fontWeight="700"
          textAnchor="middle"
          initial={{ opacity: 0, y: -5 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
          transition={{ delay: 1.8, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          STOP
        </motion.text>

        {/* Minimum point marker */}
        <motion.circle
          cx={stopX}
          cy={stopY}
          r="4"
          fill="var(--color-accent)"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: 1.7, duration: 0.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Overfit marker (X) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: 2, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1={overfitX - 5}
            y1={overfitY - 5}
            x2={overfitX + 5}
            y2={overfitY + 5}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1={overfitX + 5}
            y1={overfitY - 5}
            x2={overfitX - 5}
            y2={overfitY + 5}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </motion.g>
      </svg>
    </div>
  );
}
