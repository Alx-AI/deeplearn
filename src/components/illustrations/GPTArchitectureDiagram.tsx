'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface GPTArchitectureDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function GPTArchitectureDiagram({ className }: GPTArchitectureDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 360 310"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="GPT decoder-only architecture showing token embeddings, stacked decoder blocks with masked self-attention and feed-forward networks, and output prediction head"
        style={{ width: '100%', height: 'auto' }}
      >
        <defs>
          {/* Arrow marker */}
          <marker
            id="arrowhead-gpt-arch"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>

        {/* Title */}
        <text
          x="180"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="600"
          fontFamily="var(--font-sans)"
        >
          GPT Architecture
        </text>

        {/* Input Embeddings (Bottom) */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="60"
            y="240"
            width="240"
            height="40"
            rx="6"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="180"
            y="257"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Token Embeddings
          </text>
          <text
            x="180"
            y="270"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            + Position Embeddings
          </text>
        </motion.g>

        {/* Arrow from embeddings to first decoder block */}
        <motion.line
          x1="180"
          y1="235"
          x2="180"
          y2="215"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-gpt-arch)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Decoder Block 1 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="70"
            y="155"
            width="220"
            height="55"
            rx="6"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />

          {/* Masked Attention sub-block */}
          <rect
            x="80"
            y="163"
            width="90"
            height="18"
            rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="125"
            y="175"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            Masked Attn
          </text>

          {/* Add & Norm */}
          <text
            x="125"
            y="190"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            Add & Norm
          </text>

          {/* FFN sub-block */}
          <rect
            x="190"
            y="163"
            width="90"
            height="18"
            rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="235"
            y="175"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            Feed Forward
          </text>

          {/* Add & Norm */}
          <text
            x="235"
            y="190"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            Add & Norm
          </text>

          <text
            x="180"
            y="204"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Decoder Block
          </text>
        </motion.g>

        {/* Arrow between blocks */}
        <motion.line
          x1="180"
          y1="150"
          x2="180"
          y2="130"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-gpt-arch)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
        />

        {/* Decoder Block 2 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="70"
            y="75"
            width="220"
            height="50"
            rx="6"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="180"
            y="105"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Decoder Block
          </text>
          <text
            x="180"
            y="90"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontFamily="var(--font-sans)"
          >
            (same structure)
          </text>
        </motion.g>

        {/* "×N" badge */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="295"
            y="140"
            width="30"
            height="20"
            rx="4"
            fill="var(--color-accent)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="310"
            y="153"
            textAnchor="middle"
            fill="var(--color-bg-primary)"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-sans)"
          >
            ×N
          </text>
        </motion.g>

        {/* Arrow to output head */}
        <motion.line
          x1="180"
          y1="70"
          x2="180"
          y2="50"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-gpt-arch)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
        />

        {/* Output Head */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="100"
            y="35"
            width="160"
            height="10"
            rx="3"
            fill="var(--color-accent)"
            opacity="0.8"
          />
          <text
            x="180"
            y="42"
            textAnchor="middle"
            fill="var(--color-bg-primary)"
            fontSize="9"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Linear → Softmax
          </text>
        </motion.g>

        {/* Causal Mask Visualization (bottom left) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="30"
            y="250"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Causal
          </text>
          <text
            x="30"
            y="260"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="500"
            fontFamily="var(--font-sans)"
          >
            Mask
          </text>

          {/* 4x4 lower triangular matrix */}
          {[0, 1, 2, 3].map((row) => (
            <g key={row}>
              {[0, 1, 2, 3].map((col) => (
                <rect
                  key={col}
                  x={12 + col * 10}
                  y={265 + row * 10}
                  width="8"
                  height="8"
                  rx="1"
                  fill={col <= row ? "var(--color-accent)" : "var(--color-bg-tertiary)"}
                  stroke="var(--color-border-primary)"
                  strokeWidth="0.5"
                  opacity={col <= row ? 0.7 : 0.3}
                />
              ))}
            </g>
          ))}
        </motion.g>
      </svg>
    </div>
  );
}
