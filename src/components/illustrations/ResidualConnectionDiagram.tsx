'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ResidualConnectionDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function ResidualConnectionDiagram({ className = '' }: ResidualConnectionDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 220"
      role="img"
      aria-label="Residual connection diagram showing skip connection bypassing layers"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Input node */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx="100"
          cy="30"
          r="20"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />
        <text
          x="100"
          y="35"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          x
        </text>
        <text
          x="100"
          y="15"
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-text-secondary)"
        >
          Input
        </text>
      </motion.g>

      {/* Main path - downward arrow */}
      <motion.line
        x1="100"
        y1="50"
        x2="100"
        y2="80"
        stroke="var(--color-border-primary)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="100,80 95,72 105,72"
        fill="var(--color-border-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Layer block - two operations */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        {/* First operation */}
        <rect
          x="50"
          y="85"
          width="100"
          height="30"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Conv + BN
        </text>

        {/* Second operation */}
        <rect
          x="50"
          y="125"
          width="100"
          height="30"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />
        <text
          x="100"
          y="145"
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          ReLU
        </text>

        {/* F(x) label */}
        <text
          x="160"
          y="125"
          fontSize="13"
          fontWeight="600"
          fill="var(--color-text-secondary)"
        >
          F(x)
        </text>
      </motion.g>

      {/* Arrow from layer block to add node */}
      <motion.line
        x1="100"
        y1="155"
        x2="100"
        y2="175"
        stroke="var(--color-border-primary)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="100,175 95,167 105,167"
        fill="var(--color-border-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Skip connection - curved path */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Background glow for skip connection */}
        <motion.path
          d="M 100 50 C 250 50, 250 125, 250 180 L 130 180"
          fill="none"
          stroke="var(--color-accent-subtle)"
          strokeWidth="12"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: PRODUCTIVE_EASE }}
        />
        {/* Skip connection path */}
        <motion.path
          d="M 100 50 C 250 50, 250 125, 250 180 L 130 180"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeDasharray="0"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: PRODUCTIVE_EASE }}
        />
        {/* Arrow head for skip connection */}
        <motion.polygon
          points="130,180 138,175 138,185"
          fill="var(--color-accent)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3, delay: 1.8, ease: PRODUCTIVE_EASE }}
        />
        {/* Skip connection label */}
        <text
          x="270"
          y="120"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Skip
        </text>
        <text
          x="258"
          y="133"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Connection
        </text>
      </motion.g>

      {/* Add node (+) */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.9, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx="100"
          cy="180"
          r="18"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
        />
        <text
          x="100"
          y="188"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          +
        </text>
      </motion.g>

      {/* Output arrow */}
      <motion.line
        x1="100"
        y1="198"
        x2="100"
        y2="205"
        stroke="var(--color-border-primary)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 2.2, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points="100,210 95,202 105,202"
        fill="var(--color-border-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 2.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Output label */}
      <motion.text
        x="100"
        y="216"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.4, ease: PRODUCTIVE_EASE }}
      >
        F(x) + x
      </motion.text>

      {/* Formula display */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
        transition={{ duration: 0.5, delay: 2.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="180"
          y="25"
          width="190"
          height="40"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="275"
          y="42"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-tertiary)"
        >
          Residual Formula
        </text>
        <text
          x="275"
          y="56"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--color-text-primary)"
        >
          output = F(x) + x
        </text>
      </motion.g>
    </svg>
  );
}
