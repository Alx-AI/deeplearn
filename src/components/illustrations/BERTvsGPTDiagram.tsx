'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BERTvsGPTDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function BERTvsGPTDiagram({ className = '' }: BERTvsGPTDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 220"
      className={className}
      role="img"
      aria-label="Comparison of BERT bidirectional pretraining versus GPT autoregressive pretraining"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-bert"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
        <marker
          id="arrowhead-gpt"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Panel Titles */}
      <motion.text
        x="60"
        y="25"
        fontSize="14"
        fontWeight="700"
        fill="var(--color-text-primary)"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        BERT (Encoder)
      </motion.text>

      <motion.text
        x="310"
        y="25"
        fontSize="14"
        fontWeight="700"
        fill="var(--color-text-primary)"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        GPT (Decoder)
      </motion.text>

      {/* Dashed divider */}
      <motion.line
        x1="180"
        y1="10"
        x2="180"
        y2="210"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* BERT Panel - Left Side */}
      <g>
        {/* Token: "The" */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="15"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="32.5"
            y="78"
            fontSize="11"
            fill="var(--color-text-primary)"
            textAnchor="middle"
          >
            The
          </text>
        </motion.g>

        {/* Token: "[MASK]" - Special accent token */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="55"
            y="60"
            width="50"
            height="28"
            rx="4"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          <text
            x="80"
            y="78"
            fontSize="11"
            fill="var(--color-accent)"
            textAnchor="middle"
            fontWeight="600"
          >
            [MASK]
          </text>
        </motion.g>

        {/* Token: "sat" */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="110"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="127.5"
            y="78"
            fontSize="11"
            fill="var(--color-text-primary)"
            textAnchor="middle"
          >
            sat
          </text>
        </motion.g>

        {/* Bidirectional arrows - from left token to MASK */}
        <motion.path
          d="M 45 74 L 60 74"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-bert)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Bidirectional arrows - from right token to MASK */}
        <motion.path
          d="M 115 74 L 100 74"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-bert)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
        />

        {/* Prediction indicator - "?" above mask */}
        <motion.text
          x="80"
          y="48"
          fontSize="18"
          fontWeight="700"
          fill="var(--color-accent)"
          textAnchor="middle"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          ?
        </motion.text>

        {/* Label */}
        <motion.text
          x="80"
          y="120"
          fontSize="11"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          Predict masked tokens
        </motion.text>

        <motion.text
          x="80"
          y="135"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          (bidirectional context)
        </motion.text>

        {/* Extended context sentence below */}
        <motion.text
          x="80"
          y="165"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          "The [MASK] sat on the mat"
        </motion.text>

        <motion.text
          x="80"
          y="180"
          fontSize="9"
          fill="var(--color-accent)"
          textAnchor="middle"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.7, ease: PRODUCTIVE_EASE }}
        >
          Prediction: "cat"
        </motion.text>
      </g>

      {/* GPT Panel - Right Side */}
      <g>
        {/* Token: "The" */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="210"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="227.5"
            y="78"
            fontSize="11"
            fill="var(--color-text-primary)"
            textAnchor="middle"
          >
            The
          </text>
        </motion.g>

        {/* Token: "cat" */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="250"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="267.5"
            y="78"
            fontSize="11"
            fill="var(--color-text-primary)"
            textAnchor="middle"
          >
            cat
          </text>
        </motion.g>

        {/* Token: "sat" */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="290"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="307.5"
            y="78"
            fontSize="11"
            fill="var(--color-text-primary)"
            textAnchor="middle"
          >
            sat
          </text>
        </motion.g>

        {/* Predicted next token: "on" - Accent colored, separated */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="340"
            y="60"
            width="35"
            height="28"
            rx="4"
            fill="var(--color-accent)"
            stroke="var(--color-accent)"
            strokeWidth="2"
          />
          <text
            x="357.5"
            y="78"
            fontSize="11"
            fill="var(--color-bg-primary)"
            textAnchor="middle"
            fontWeight="600"
          >
            on
          </text>
        </motion.g>

        {/* Left-to-right arrows (autoregressive) */}
        <motion.path
          d="M 240 74 L 255 74"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-gpt)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        <motion.path
          d="M 280 74 L 295 74"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-gpt)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
        />

        <motion.path
          d="M 320 74 L 345 74"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-gpt)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.0, ease: PRODUCTIVE_EASE }}
        />

        {/* Label */}
        <motion.text
          x="290"
          y="120"
          fontSize="11"
          fill="var(--color-text-secondary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          Predict next token
        </motion.text>

        <motion.text
          x="290"
          y="135"
          fontSize="10"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          (left-to-right only)
        </motion.text>

        {/* Extended context sentence below */}
        <motion.text
          x="290"
          y="165"
          fontSize="9"
          fill="var(--color-text-tertiary)"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          "The cat sat..."
        </motion.text>

        <motion.text
          x="290"
          y="180"
          fontSize="9"
          fill="var(--color-accent)"
          textAnchor="middle"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.7, ease: PRODUCTIVE_EASE }}
        >
          Next: "on"
        </motion.text>
      </g>

      {/* Additional visual cue - directional indicators */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        {/* BERT: bidirectional indicator */}
        <path
          d="M 25 105 L 40 105 M 35 100 L 40 105 L 35 110"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M 135 105 L 120 105 M 125 100 L 120 105 L 125 110"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* GPT: unidirectional indicator */}
        <path
          d="M 210 105 L 375 105 M 370 100 L 375 105 L 370 110"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
      </motion.g>
    </svg>
  );
}
