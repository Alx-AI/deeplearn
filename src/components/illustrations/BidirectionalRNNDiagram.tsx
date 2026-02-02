'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BidirectionalRNNDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function BidirectionalRNNDiagram({ className = '' }: BidirectionalRNNDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Layout constants
  const inputY = 200;
  const forwardY = 130;
  const backwardY = 70;
  const outputY = 20;
  const positions = [90, 180, 270, 360];
  const cellWidth = 40;
  const cellHeight = 30;

  return (
    <svg
      ref={ref}
      viewBox="0 -10 440 260"
      className={className}
      role="img"
      aria-label="Bidirectional RNN diagram showing forward and backward processing paths that combine into output nodes"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Input Nodes */}
      {positions.map((x, i) => (
        <g key={`input-${i}`}>
          <motion.circle
            cx={x}
            cy={inputY}
            r="12"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1, ease: PRODUCTIVE_EASE }}
          />
          <motion.text
            x={x}
            y={inputY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 + 0.2, ease: PRODUCTIVE_EASE }}
          >
            x{i + 1}
          </motion.text>
        </g>
      ))}

      {/* Forward RNN Cells (Top Row) */}
      {positions.map((x, i) => (
        <g key={`forward-${i}`}>
          {/* Cell */}
          <motion.rect
            x={x - cellWidth / 2}
            y={forwardY - cellHeight / 2}
            width={cellWidth}
            height={cellHeight}
            rx="4"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />
          <motion.text
            x={x}
            y={forwardY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-accent)"
            fontSize="16"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 + 0.2, ease: PRODUCTIVE_EASE }}
          >
            →
          </motion.text>

          {/* Arrow from input to forward cell */}
          <motion.line
            x1={x}
            y1={inputY - 12}
            x2={x}
            y2={forwardY + cellHeight / 2}
            stroke="var(--color-accent)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-birnn-accent)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />

          {/* Horizontal arrow to next forward cell */}
          {i < positions.length - 1 && (
            <motion.line
              x1={x + cellWidth / 2}
              y1={forwardY}
              x2={positions[i + 1] - cellWidth / 2}
              y2={forwardY}
              stroke="var(--color-accent)"
              strokeWidth="2"
              markerEnd="url(#arrowhead-birnn-accent)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.0 + i * 0.15, ease: PRODUCTIVE_EASE }}
            />
          )}
        </g>
      ))}

      {/* Backward RNN Cells (Bottom Row) */}
      {positions.map((x, i) => (
        <g key={`backward-${i}`}>
          {/* Cell */}
          <motion.rect
            x={x - cellWidth / 2}
            y={backwardY - cellHeight / 2}
            width={cellWidth}
            height={cellHeight}
            rx="4"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />
          <motion.text
            x={x}
            y={backwardY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-tertiary)"
            fontSize="16"
            fontWeight="700"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.1 + 0.2, ease: PRODUCTIVE_EASE }}
          >
            ←
          </motion.text>

          {/* Arrow from input to backward cell */}
          <motion.line
            x1={x}
            y1={inputY - 12}
            x2={x}
            y2={backwardY + cellHeight / 2}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-backward)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.4 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />

          {/* Horizontal arrow to previous backward cell (right to left) */}
          {i > 0 && (
            <motion.line
              x1={x - cellWidth / 2}
              y1={backwardY}
              x2={positions[i - 1] + cellWidth / 2}
              y2={backwardY}
              stroke="var(--color-text-tertiary)"
              strokeWidth="2"
              markerEnd="url(#arrowhead-backward)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 1.6 + (positions.length - i) * 0.15, ease: PRODUCTIVE_EASE }}
            />
          )}
        </g>
      ))}

      {/* Output Nodes */}
      {positions.map((x, i) => (
        <g key={`output-${i}`}>
          <motion.circle
            cx={x}
            cy={outputY}
            r="12"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 2.0 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />
          <motion.text
            x={x}
            y={outputY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 2.0 + i * 0.1 + 0.2, ease: PRODUCTIVE_EASE }}
          >
            y{i + 1}
          </motion.text>

          {/* Arrow from forward cell to output */}
          <motion.line
            x1={x + 8}
            y1={forwardY - cellHeight / 2}
            x2={x + 8}
            y2={outputY + 12}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-birnn-accent-small)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.2 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />

          {/* Arrow from backward cell to output */}
          <motion.line
            x1={x - 8}
            y1={backwardY - cellHeight / 2}
            x2={x - 8}
            y2={outputY + 12}
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-backward-small)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 2.2 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />
        </g>
      ))}

      {/* Labels */}
      <motion.text
        x="66"
        y={forwardY}
        textAnchor="end"
        fill="var(--color-accent)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        Forward
      </motion.text>

      <motion.text
        x="66"
        y={backwardY}
        textAnchor="end"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        Backward
      </motion.text>

      <motion.text
        x="225"
        y="10"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 2.4, ease: PRODUCTIVE_EASE }}
      >
        Combined Output
      </motion.text>

      {/* Arrow markers */}
      <defs>
        <marker
          id="arrowhead-birnn-accent"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="var(--color-accent)" />
        </marker>
        <marker
          id="arrowhead-birnn-accent-small"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="2.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,5 L7,2.5 z" fill="var(--color-accent)" />
        </marker>
        <marker
          id="arrowhead-backward"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="var(--color-text-tertiary)" />
        </marker>
        <marker
          id="arrowhead-backward-small"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="2.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,5 L7,2.5 z" fill="var(--color-text-tertiary)" />
        </marker>
      </defs>
    </svg>
  );
}
