'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SgdVariantsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function SgdVariantsDiagram({ className = '' }: SgdVariantsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Loss landscape center (minimum)
  const cx = 310;
  const cy = 200;

  // Contour ellipse parameters (semi-axes at each level)
  const contours = [
    { rx: 40, ry: 28, opacity: 0.7 },
    { rx: 80, ry: 52, opacity: 0.5 },
    { rx: 125, ry: 80, opacity: 0.35 },
    { rx: 170, ry: 110, opacity: 0.2 },
  ];

  // Rotation angle for tilted contours (makes landscape more realistic)
  const contourRotation = -25;

  // Starting point (upper-left area)
  const startX = 80;
  const startY = 60;

  // SGD path: zigzagging, oscillating, slow convergence
  const sgdPath =
    'M 80 60 L 105 90 L 90 115 L 120 135 L 100 160 L 135 175 ' +
    'L 120 195 L 155 205 L 145 215 L 180 218 L 170 225 L 210 222 ' +
    'L 205 230 L 240 225 L 235 232 L 268 228 L 275 222 L 295 210 L 310 200';

  // Momentum path: smoother, faster, less oscillation
  const momentumPath =
    'M 80 60 L 110 85 L 125 120 L 150 150 L 170 172 ' +
    'L 200 190 L 230 202 L 258 210 L 280 212 L 298 208 L 310 200';

  // Adam path: most direct, efficient route
  const adamPath =
    'M 80 60 C 120 90, 160 140, 200 170 C 230 185, 270 198, 310 200';

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 330"
      className={className}
      role="img"
      aria-label="SGD optimizer variants diagram showing three optimization paths on a loss landscape contour plot: vanilla SGD with zigzag oscillations, Momentum with smoother convergence, and Adam with the most direct efficient route to the minimum"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Contour ellipses - loss landscape */}
      {contours.map((contour, i) => (
        <motion.ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={contour.rx}
          ry={contour.ry}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1.2"
          opacity={contour.opacity}
          transform={`rotate(${contourRotation} ${cx} ${cy})`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            isInView
              ? { opacity: contour.opacity, scale: 1 }
              : { opacity: 0, scale: 0.6 }
          }
          transition={{
            duration: 0.6,
            delay: 0.1 + i * 0.12,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Subtle fill for innermost contour to hint at the minimum basin */}
      <motion.ellipse
        cx={cx}
        cy={cy}
        rx={contours[0].rx}
        ry={contours[0].ry}
        fill="var(--color-accent-subtle)"
        stroke="none"
        opacity={0.3}
        transform={`rotate(${contourRotation} ${cx} ${cy})`}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* SGD path (zigzagging) */}
      <motion.path
        d={sgdPath}
        fill="none"
        stroke="var(--color-text-tertiary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 1.8, delay: 0.8, ease: PRODUCTIVE_EASE }}
      />

      {/* Momentum path (smoother) */}
      <motion.path
        d={momentumPath}
        fill="none"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 1.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Adam path (most direct) */}
      <motion.path
        d={adamPath}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 1.2, delay: 2.4, ease: PRODUCTIVE_EASE }}
      />

      {/* Starting point marker */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx={startX}
          cy={startY}
          r="5"
          fill="var(--color-text-primary)"
        />
        <text
          x={startX}
          y={startY - 12}
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Start
        </text>
      </motion.g>

      {/* Minimum point marker */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 3.6, ease: PRODUCTIVE_EASE }}
      >
        {/* Glow ring */}
        <circle
          cx={cx}
          cy={cy}
          r="10"
          fill="var(--color-accent)"
          opacity="0.15"
        />
        <circle
          cx={cx}
          cy={cy}
          r="4"
          fill="var(--color-accent)"
        />
        <text
          x={cx}
          y={cy + 20}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Minimum
        </text>
      </motion.g>

      {/* Path labels */}
      {/* SGD label */}
      <motion.text
        x={82}
        y={175}
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        SGD
      </motion.text>

      {/* Momentum label */}
      <motion.text
        x={140}
        y={138}
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-secondary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.6, ease: PRODUCTIVE_EASE }}
      >
        Momentum
      </motion.text>

      {/* Adam label */}
      <motion.text
        x={168}
        y={110}
        fontSize="11"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 3.2, ease: PRODUCTIVE_EASE }}
      >
        Adam
      </motion.text>

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 3.8, ease: PRODUCTIVE_EASE }}
      >
        {/* Legend background */}
        <rect
          x="16"
          y="248"
          width="150"
          height="60"
          rx="4"
          fill="var(--color-bg-tertiary)"
          opacity="0.6"
        />

        {/* SGD legend entry */}
        <line
          x1="26"
          y1="266"
          x2="48"
          y2="266"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="54"
          y="270"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          SGD
        </text>

        {/* Momentum legend entry */}
        <line
          x1="26"
          y1="283"
          x2="48"
          y2="283"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="54"
          y="287"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Momentum
        </text>

        {/* Adam legend entry */}
        <line
          x1="26"
          y1="300"
          x2="48"
          y2="300"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x="54"
          y="304"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Adam
        </text>
      </motion.g>
    </svg>
  );
}
