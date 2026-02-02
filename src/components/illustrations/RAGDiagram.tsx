'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RAGDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function RAGDiagram({ className = '' }: RAGDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 220"
      className={className}
      role="img"
      aria-label="Retrieval-Augmented Generation diagram showing question flowing through document retrieval and LLM to produce an answer"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-rag"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* Question Box - Left */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="10"
          y="90"
          width="70"
          height="40"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="45"
          y="115"
          textAnchor="middle"
          fontSize="14"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Question
        </text>
      </motion.g>

      {/* Arrow to Retriever */}
      <motion.line
        x1="80"
        y1="110"
        x2="115"
        y2="110"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-rag)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Document Store - Top */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.5, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Stack of document icons */}
        <rect
          x="135"
          y="20"
          width="50"
          height="30"
          rx="3"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
        />
        <rect
          x="138"
          y="17"
          width="50"
          height="30"
          rx="3"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
        />
        <rect
          x="141"
          y="14"
          width="50"
          height="30"
          rx="3"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
        />

        {/* Document icon lines */}
        <line x1="147" y1="20" x2="185" y2="20" stroke="var(--color-text-tertiary)" strokeWidth="1" />
        <line x1="147" y1="26" x2="180" y2="26" stroke="var(--color-text-tertiary)" strokeWidth="1" />
        <line x1="147" y1="32" x2="185" y2="32" stroke="var(--color-text-tertiary)" strokeWidth="1" />
        <line x1="147" y1="38" x2="175" y2="38" stroke="var(--color-text-tertiary)" strokeWidth="1" />

        <text
          x="166"
          y="65"
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-text-secondary)"
        >
          Document
        </text>
        <text
          x="166"
          y="77"
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-text-secondary)"
        >
          Store
        </text>
      </motion.g>

      {/* Arrow from Document Store to Retriever */}
      <motion.line
        x1="166"
        y1="77"
        x2="166"
        y2="85"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-rag)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
      />

      {/* Retriever Box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="121"
          y="90"
          width="90"
          height="40"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="166"
          y="115"
          textAnchor="middle"
          fontSize="14"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Retriever
        </text>
      </motion.g>

      {/* Arrow to LLM with label */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="211"
          y1="110"
          x2="265"
          y2="110"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-rag)"
        />
        <text
          x="238"
          y="102"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          docs +
        </text>
        <text
          x="238"
          y="126"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          query
        </text>
      </motion.g>

      {/* LLM Box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="270"
          y="85"
          width="90"
          height="50"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="315"
          y="116"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          LLM
        </text>
      </motion.g>

      {/* Arrow to Answer */}
      <motion.line
        x1="360"
        y1="110"
        x2="395"
        y2="110"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-rag)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Answer Box - Right with accent */}
      <motion.g
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="400"
          y="90"
          width="90"
          height="40"
          rx="6"
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="445"
          y="115"
          textAnchor="middle"
          fontSize="14"
          fontWeight="600"
          fill="var(--color-bg-primary)"
        >
          Answer
        </text>
      </motion.g>

      {/* Flow description labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="250"
          y="200"
          textAnchor="middle"
          fontSize="12"
          fontStyle="italic"
          fill="var(--color-text-tertiary)"
        >
          Retrieval-Augmented Generation (RAG)
        </text>
      </motion.g>

      {/* Retrieval arrow label */}
      <motion.text
        x="100"
        y="102"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        search
      </motion.text>
    </svg>
  );
}
