'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FeatureExtractionDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function FeatureExtractionDiagram({ className = '' }: FeatureExtractionDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 180"
        role="img"
        aria-label="Feature extraction visualization showing how convolutional layers transform an input image into progressively smaller feature maps with more channels"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          {/* Gradient for input image */}
          <linearGradient id="inputGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-accent)', stopOpacity: 0.6 }} />
          </linearGradient>

          {/* Patterns for feature maps */}
          <pattern id="featurePattern1" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="var(--color-accent-subtle)" />
            <rect x="4" y="0" width="4" height="4" fill="var(--color-accent)" opacity="0.3" />
          </pattern>

          <pattern id="featurePattern2" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--color-accent-subtle)" />
            <circle cx="3" cy="3" r="2" fill="var(--color-accent)" opacity="0.4" />
          </pattern>

          <pattern id="featurePattern3" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="var(--color-accent-subtle)" />
            <line x1="0" y1="0" x2="4" y2="4" stroke="var(--color-accent)" strokeWidth="1" opacity="0.5" />
          </pattern>
        </defs>

        {/* Input Image - 6x6 grid */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Input grid */}
          <rect
            x="10"
            y="50"
            width="60"
            height="60"
            fill="url(#inputGradient)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            rx="2"
          />
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <g key={`input-grid-${i}`}>
              <line
                x1="10"
                y1={50 + (i + 1) * 10}
                x2="70"
                y2={50 + (i + 1) * 10}
                stroke="var(--color-border-primary)"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <line
                x1={10 + (i + 1) * 10}
                y1="50"
                x2={10 + (i + 1) * 10}
                y2="110"
                stroke="var(--color-border-primary)"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </g>
          ))}

          {/* Input label */}
          <text
            x="40"
            y="135"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
          >
            Input
          </text>
          <text
            x="40"
            y="147"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            (32×32)
          </text>
        </motion.g>

        {/* Arrow 1 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 75 80 L 105 80"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead1)"
          />
          <defs>
            <marker
              id="arrowhead1"
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
        </motion.g>

        {/* Layer 1: 4 feature maps (4x4 grids) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
        >
          {[0, 1, 2, 3].map((i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = 110 + col * 28;
            const y = 55 + row * 28;
            const patterns = ['featurePattern1', 'featurePattern2', 'featurePattern3', 'featurePattern1'];

            return (
              <g key={`layer1-map-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width="24"
                  height="24"
                  fill={`url(#${patterns[i]})`}
                  stroke="var(--color-border-primary)"
                  strokeWidth="1.5"
                  rx="1"
                />
                {/* Grid lines for 4x4 */}
                {[...Array(3)].map((_, j) => (
                  <g key={`l1-grid-${i}-${j}`} opacity="0.2">
                    <line
                      x1={x}
                      y1={y + (j + 1) * 6}
                      x2={x + 24}
                      y2={y + (j + 1) * 6}
                      stroke="var(--color-border-primary)"
                      strokeWidth="0.5"
                    />
                    <line
                      x1={x + (j + 1) * 6}
                      y1={y}
                      x2={x + (j + 1) * 6}
                      y2={y + 24}
                      stroke="var(--color-border-primary)"
                      strokeWidth="0.5"
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* Layer 1 label */}
          <text
            x="147"
            y="135"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
          >
            Layer 1
          </text>
          <text
            x="147"
            y="147"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            (4 maps)
          </text>
        </motion.g>

        {/* Arrow 2 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 172 80 L 202 80"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead2)"
          />
          <defs>
            <marker
              id="arrowhead2"
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
        </motion.g>

        {/* Layer 2: 8 feature maps (3x3 grids, arranged in 2 rows of 4) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: PRODUCTIVE_EASE }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const x = 207 + col * 19;
            const y = 60 + row * 19;
            const patterns = ['featurePattern2', 'featurePattern3', 'featurePattern1', 'featurePattern2', 'featurePattern3', 'featurePattern1', 'featurePattern2', 'featurePattern3'];

            return (
              <g key={`layer2-map-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width="16"
                  height="16"
                  fill={`url(#${patterns[i]})`}
                  stroke="var(--color-border-primary)"
                  strokeWidth="1.2"
                  rx="1"
                />
                {/* Grid lines for 3x3 */}
                {[...Array(2)].map((_, j) => (
                  <g key={`l2-grid-${i}-${j}`} opacity="0.15">
                    <line
                      x1={x}
                      y1={y + (j + 1) * 5.33}
                      x2={x + 16}
                      y2={y + (j + 1) * 5.33}
                      stroke="var(--color-border-primary)"
                      strokeWidth="0.4"
                    />
                    <line
                      x1={x + (j + 1) * 5.33}
                      y1={y}
                      x2={x + (j + 1) * 5.33}
                      y2={y + 16}
                      stroke="var(--color-border-primary)"
                      strokeWidth="0.4"
                    />
                  </g>
                ))}
              </g>
            );
          })}

          {/* Layer 2 label */}
          <text
            x="245"
            y="135"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
          >
            Layer 2
          </text>
          <text
            x="245"
            y="147"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            (8 maps)
          </text>
        </motion.g>

        {/* Arrow 3 */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 290 80 L 320 80"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead3)"
          />
          <defs>
            <marker
              id="arrowhead3"
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
        </motion.g>

        {/* Layer 3: 16 feature maps (represented as dense block with suggestion of quantity) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          {/* Main block representing many tiny feature maps */}
          <rect
            x="325"
            y="55"
            width="70"
            height="50"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            rx="2"
          />

          {/* Grid of tiny rectangles suggesting individual maps */}
          {[0, 1, 2, 3].map((row) => (
            [...Array(4)].map((_, col) => {
              const i = row * 4 + col;
              return (
                <rect
                  key={`layer3-map-${i}`}
                  x={330 + col * 15}
                  y={60 + row * 10}
                  width="12"
                  height="8"
                  fill="var(--color-accent)"
                  opacity={0.4 + (i % 3) * 0.1}
                  stroke="var(--color-accent)"
                  strokeWidth="0.8"
                  rx="0.5"
                />
              );
            })
          ))}

          {/* Overlay to suggest density */}
          <rect
            x="325"
            y="55"
            width="70"
            height="50"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.5"
            rx="2"
          />

          {/* Layer 3 label */}
          <text
            x="360"
            y="135"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="600"
          >
            Layer 3
          </text>
          <text
            x="360"
            y="147"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
          >
            (16 maps)
          </text>
        </motion.g>

        {/* Annotation showing the trend */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          {/* Arrow showing decreasing spatial size */}
          <path
            d="M 80 25 L 350 25"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.5"
          />
          <text
            x="215"
            y="20"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontStyle="italic"
          >
            Decreasing spatial size →
          </text>

          {/* Arrow showing increasing depth */}
          <path
            d="M 425 60 L 425 100"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.5"
          />
          <text
            x="430"
            y="85"
            textAnchor="start"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontStyle="italic"
          >
            Increasing
          </text>
          <text
            x="430"
            y="95"
            textAnchor="start"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontStyle="italic"
          >
            channels ↓
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
