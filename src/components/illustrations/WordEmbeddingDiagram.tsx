'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface WordEmbeddingDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function WordEmbeddingDiagram({ className = '' }: WordEmbeddingDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Word positions in 2D embedding space
  // Positions chosen to show clear parallelogram: king - man + woman ≈ queen
  const words = [
    { word: 'king', x: 280, y: 80, highlight: true },
    { word: 'queen', x: 320, y: 100, highlight: true },
    { word: 'man', x: 240, y: 180, highlight: true },
    { word: 'woman', x: 280, y: 200, highlight: true },
    { word: 'cat', x: 120, y: 120, highlight: false },
    { word: 'dog', x: 140, y: 140, highlight: false },
    { word: 'car', x: 100, y: 220, highlight: false },
    { word: 'bus', x: 130, y: 240, highlight: false },
  ];

  // Analogy vectors: king - man, woman - man, and the result showing king - man ≈ queen - woman
  const vectors = [
    // king to man (shown as man to king for visual clarity)
    { x1: 240, y1: 180, x2: 280, y2: 80, label: 'royalty' },
    // woman to queen (parallel vector)
    { x1: 280, y1: 200, x2: 320, y2: 100, label: 'royalty' },
    // man to woman (gender shift)
    { x1: 240, y1: 180, x2: 280, y2: 200, label: 'gender' },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label="Word embedding visualization showing semantic relationships in vector space"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Light axis lines for reference */}
      <motion.line
        x1="50"
        y1="250"
        x2="350"
        y2="250"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      />
      <motion.line
        x1="50"
        y1="50"
        x2="50"
        y2="250"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        opacity="0.3"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      />

      {/* Highlight circles around word pairs */}
      <motion.ellipse
        cx="300"
        cy="90"
        rx="35"
        ry="25"
        fill="var(--color-accent-subtle)"
        opacity="0.15"
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.15 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />
      <motion.ellipse
        cx="260"
        cy="190"
        rx="35"
        ry="25"
        fill="var(--color-accent-subtle)"
        opacity="0.15"
        stroke="var(--color-accent)"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.15 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* Word dots and labels */}
      {words.map((item, index) => (
        <g key={item.word}>
          <motion.circle
            cx={item.x}
            cy={item.y}
            r="4"
            fill={item.highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.6 + index * 0.08,
              ease: PRODUCTIVE_EASE
            }}
          />
          <motion.text
            x={item.x + 8}
            y={item.y + 4}
            fontSize="13"
            fontWeight={item.highlight ? '600' : '500'}
            fill={item.highlight ? 'var(--color-accent)' : 'var(--color-text-primary)'}
            initial={{ opacity: 0, x: item.x }}
            animate={isInView ? { opacity: 1, x: item.x + 8 } : { opacity: 0, x: item.x }}
            transition={{
              duration: 0.3,
              delay: 0.6 + index * 0.08,
              ease: PRODUCTIVE_EASE
            }}
          >
            {item.word}
          </motion.text>
        </g>
      ))}

      {/* Defs for arrow markers */}
      <defs>
        <marker
          id="arrowhead-analogy"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* Analogy vectors showing the parallelogram */}
      {vectors.map((vec, index) => (
        <motion.line
          key={`vector-${index}`}
          x1={vec.x1}
          y1={vec.y1}
          x2={vec.x2}
          y2={vec.y2}
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="4 4"
          markerEnd="url(#arrowhead-analogy)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: 1.4 + index * 0.2,
            ease: PRODUCTIVE_EASE
          }}
        />
      ))}

      {/* Annotation text for the analogy */}
      <motion.text
        x="200"
        y="30"
        fontSize="12"
        fontWeight="500"
        fill="var(--color-text-tertiary)"
        textAnchor="middle"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 30 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        king - man + woman ≈ queen
      </motion.text>
    </svg>
  );
}
