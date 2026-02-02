'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ConcentricCirclesDiagram
 *
 * The AI > ML > DL bullseye diagram. Three concentric rings draw in
 * sequentially from outside to inside. Each ring shows its abbreviation
 * inside and full label to the right with a connector line.
 * The innermost Deep Learning ring pulses subtly.
 */

interface ConcentricCirclesDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const rings = [
  {
    label: 'Artificial Intelligence',
    abbreviation: 'AI',
    radius: 130,
    strokeColor: 'var(--color-text-tertiary)',
    fillColor: 'var(--color-bg-tertiary)',
    fillOpacity: 0.35,
    delay: 0,
  },
  {
    label: 'Machine Learning',
    abbreviation: 'ML',
    radius: 88,
    strokeColor: 'var(--color-text-secondary)',
    fillColor: 'var(--color-bg-secondary)',
    fillOpacity: 0.5,
    delay: 0.4,
  },
  {
    label: 'Deep Learning',
    abbreviation: 'DL',
    radius: 48,
    strokeColor: 'var(--color-accent)',
    fillColor: 'var(--color-accent-subtle)',
    fillOpacity: 0.6,
    delay: 0.8,
  },
] as const;

export default function ConcentricCirclesDiagram({
  className = '',
}: ConcentricCirclesDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const cx = 180;
  const cy = 160;

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Concentric circles diagram showing the relationship between AI, Machine Learning, and Deep Learning"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      {rings.map((ring, i) => {
        const circumference = 2 * Math.PI * ring.radius;
        const isInnermost = i === rings.length - 1;

        /* Label position: to the right of each ring at its equator */
        const labelX = cx + ring.radius + 16;
        const labelY = cy - ring.radius * 0.35 + i * 30;

        return (
          <g key={ring.abbreviation}>
            {/* Filled background */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill={ring.fillColor}
              fillOpacity={0}
              initial={{ fillOpacity: 0 }}
              animate={isInView ? { fillOpacity: ring.fillOpacity } : { fillOpacity: 0 }}
              transition={{ duration: 0.6, delay: ring.delay + 0.3, ease: PRODUCTIVE_EASE }}
            />

            {/* Animated stroke ring */}
            <motion.circle
              cx={cx}
              cy={cy}
              r={ring.radius}
              fill="none"
              stroke={ring.strokeColor}
              strokeWidth={isInnermost ? 2.5 : 1.5}
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: circumference }}
              transition={{ duration: 1, delay: ring.delay, ease: PRODUCTIVE_EASE }}
            />

            {/* Pulse on innermost ring */}
            {isInnermost && (
              <motion.circle
                cx={cx}
                cy={cy}
                r={ring.radius}
                fill="none"
                stroke={ring.strokeColor}
                strokeWidth={1}
                opacity={0}
                initial={{ opacity: 0, scale: 1 }}
                animate={
                  isInView
                    ? { opacity: [0, 0.4, 0], scale: [1, 1.08, 1.15] }
                    : {}
                }
                transition={{
                  duration: 2.4,
                  delay: ring.delay + 1.2,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: 'easeOut',
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            )}

            {/* Abbreviation centered in each ring's band */}
            <motion.text
              x={cx}
              y={isInnermost ? cy + 5 : cy - ring.radius + (ring.radius - (rings[i + 1]?.radius ?? 0)) / 2 + 4}
              textAnchor="middle"
              fill={isInnermost ? 'var(--color-accent)' : ring.strokeColor}
              fontSize={isInnermost ? 18 : 12}
              fontWeight={isInnermost ? 600 : 500}
              fontFamily="var(--font-sans)"
              letterSpacing="0.05em"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: isInnermost ? 1 : 0.7 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: ring.delay + 0.6, ease: PRODUCTIVE_EASE }}
            >
              {ring.abbreviation}
            </motion.text>

            {/* Connector line from ring edge to label */}
            <motion.line
              x1={cx + ring.radius + 2}
              y1={labelY}
              x2={labelX - 4}
              y2={labelY}
              stroke={ring.strokeColor}
              strokeWidth={1}
              strokeOpacity={0.4}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: ring.delay + 0.7, ease: PRODUCTIVE_EASE }}
            />

            {/* Full label */}
            <motion.text
              x={labelX}
              y={labelY + 4}
              textAnchor="start"
              fill={isInnermost ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              fontSize={isInnermost ? 13 : 11}
              fontWeight={isInnermost ? 600 : 400}
              fontFamily="var(--font-sans)"
              initial={{ opacity: 0, x: -6 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ duration: 0.5, delay: ring.delay + 0.8, ease: PRODUCTIVE_EASE }}
            >
              {ring.label}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
