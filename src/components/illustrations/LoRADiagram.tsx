'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface LoRADiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function LoRADiagram({ className = '' }: LoRADiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 200"
      className={className}
      role="img"
      aria-label="LoRA parameter-efficient fine-tuning diagram showing a large frozen weight matrix W and small trainable matrices A and B"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <text
        x="230"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
      >
        LoRA: Low-Rank Adaptation
      </text>

      {/* Large W matrix (frozen) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* W matrix background */}
        <rect
          x="30"
          y="50"
          width="120"
          height="120"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
          rx="4"
        />

        {/* Cross-hatching pattern to show frozen state */}
        <pattern
          id="frozenPattern"
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="10"
            y2="10"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>

        <rect
          x="30"
          y="50"
          width="120"
          height="120"
          fill="url(#frozenPattern)"
        />

        {/* W label */}
        <text
          x="90"
          y="105"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="32"
          fontWeight="700"
        >
          W
        </text>

        {/* Size label */}
        <text
          x="90"
          y="130"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="11"
        >
          1000 × 1000
        </text>

        {/* Frozen label */}
        <rect
          x="60"
          y="145"
          width="60"
          height="18"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="9"
        />
        <text
          x="90"
          y="157"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          fontWeight="500"
        >
          FROZEN
        </text>
      </motion.g>

      {/* Plus sign */}
      <motion.text
        x="170"
        y="115"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="24"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        +
      </motion.text>

      {/* A matrix (tall thin) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="210"
          y="60"
          width="40"
          height="100"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          rx="3"
        />

        <text
          x="230"
          y="105"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="24"
          fontWeight="700"
        >
          A
        </text>

        <text
          x="230"
          y="125"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          1000 × 4
        </text>
      </motion.g>

      {/* Multiplication sign */}
      <motion.text
        x="270"
        y="115"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="20"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        ×
      </motion.text>

      {/* B matrix (wide short) */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="290"
          y="85"
          width="100"
          height="40"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          rx="3"
        />

        <text
          x="340"
          y="110"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="24"
          fontWeight="700"
        >
          B
        </text>

        <text
          x="340"
          y="145"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
        >
          4 × 1000
        </text>
      </motion.g>

      {/* Bottom explanation label */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="40"
          y="180"
          width="380"
          height="16"
          fill="var(--color-bg-elevated)"
          rx="8"
        />
        <text
          x="230"
          y="191"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="500"
        >
          Only A and B are trained (0.8% of parameters)
        </text>
      </motion.g>

      {/* Arrow showing trainable components */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        <path
          d="M 230 165 Q 230 173 230 175"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-lora)"
        />
        <path
          d="M 340 130 Q 340 165 280 173"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
      </motion.g>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-lora"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>
    </svg>
  );
}
