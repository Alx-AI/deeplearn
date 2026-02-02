'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface KerasAPIsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function KerasAPIsDiagram({ className = '' }: KerasAPIsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 240"
      className={className}
      role="img"
      aria-label="Keras Model-Building APIs: Sequential vs Functional API"
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
        style={{
          fill: 'var(--color-text-primary)',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        Keras Model-Building APIs
      </text>

      {/* Left Panel: Sequential API */}
      <g>
        {/* Panel Label */}
        <text
          x="115"
          y="50"
          textAnchor="middle"
          style={{
            fill: 'var(--color-accent)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Sequential API
        </text>

        {/* Layer 1: Dense */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 0.2, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="50"
            y="65"
            width="130"
            height="35"
            rx="6"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="115"
            y="87"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            Dense Layer
          </text>
        </motion.g>

        {/* Arrow 1 */}
        <motion.path
          d="M 115 100 L 115 115"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.3, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 2,
            fill: 'none',
          }}
        />
        <motion.polygon
          points="115,118 112,113 118,113"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.2 }}
          style={{ fill: 'var(--color-text-tertiary)' }}
        />

        {/* Layer 2: Dense */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 0.5, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="50"
            y="120"
            width="130"
            height="35"
            rx="6"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="115"
            y="142"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            Dense Layer
          </text>
        </motion.g>

        {/* Arrow 2 */}
        <motion.path
          d="M 115 155 L 115 170"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 0.7, duration: 0.3, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 2,
            fill: 'none',
          }}
        />
        <motion.polygon
          points="115,173 112,168 118,168"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.2 }}
          style={{ fill: 'var(--color-text-tertiary)' }}
        />

        {/* Layer 3: Output */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 0.8, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="50"
            y="175"
            width="130"
            height="35"
            rx="6"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-accent)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="115"
            y="197"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            Output Layer
          </text>
        </motion.g>
      </g>

      {/* Divider */}
      <line
        x1="230"
        y1="40"
        x2="230"
        y2="215"
        style={{
          stroke: 'var(--color-border-primary)',
          strokeWidth: 1.5,
          strokeDasharray: '4 4',
        }}
      />

      {/* Right Panel: Functional API */}
      <g>
        {/* Panel Label */}
        <text
          x="345"
          y="50"
          textAnchor="middle"
          style={{
            fill: 'var(--color-accent)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Functional API
        </text>

        {/* Input 1 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 1.0, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="260"
            y="65"
            width="70"
            height="28"
            rx="5"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="295"
            y="82"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            Input 1
          </text>
        </motion.g>

        {/* Input 2 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 1.1, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="360"
            y="65"
            width="70"
            height="28"
            rx="5"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="395"
            y="82"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            Input 2
          </text>
        </motion.g>

        {/* Converging arrows to merge point */}
        <motion.path
          d="M 295 93 L 295 108 L 330 118"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.4, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 1.5,
            fill: 'none',
          }}
        />
        <motion.path
          d="M 395 93 L 395 108 L 360 118"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.4, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 1.5,
            fill: 'none',
          }}
        />

        {/* Merge point */}
        <motion.circle
          cx="345"
          cy="118"
          r="4"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ delay: 1.4, duration: 0.3, ease: PRODUCTIVE_EASE }}
          style={{
            fill: 'var(--color-accent)',
            stroke: 'var(--color-bg-elevated)',
            strokeWidth: 1,
          }}
        />

        {/* Shared Processing Layer */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ delay: 1.5, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="280"
            y="130"
            width="130"
            height="28"
            rx="5"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-accent)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="345"
            y="147"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            Shared Dense
          </text>
        </motion.g>

        {/* Branching arrows from shared layer */}
        <motion.path
          d="M 310 158 L 295 175"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 1.7, duration: 0.4, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 1.5,
            fill: 'none',
          }}
        />
        <motion.path
          d="M 380 158 L 395 175"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ delay: 1.7, duration: 0.4, ease: PRODUCTIVE_EASE }}
          style={{
            stroke: 'var(--color-text-tertiary)',
            strokeWidth: 1.5,
            fill: 'none',
          }}
        />

        {/* Output 1 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 1.9, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="260"
            y="177"
            width="70"
            height="28"
            rx="5"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="295"
            y="194"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            Output 1
          </text>
        </motion.g>

        {/* Output 2 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ delay: 2.0, duration: 0.4, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="360"
            y="177"
            width="70"
            height="28"
            rx="5"
            style={{
              fill: 'var(--color-bg-elevated)',
              stroke: 'var(--color-border-primary)',
              strokeWidth: 1.5,
            }}
          />
          <text
            x="395"
            y="194"
            textAnchor="middle"
            style={{
              fill: 'var(--color-text-primary)',
              fontSize: '10px',
              fontWeight: 500,
            }}
          >
            Output 2
          </text>
        </motion.g>
      </g>

      {/* Bottom Label */}
      <motion.text
        x="230"
        y="230"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 2.2, duration: 0.4 }}
        style={{
          fill: 'var(--color-text-secondary)',
          fontSize: '11px',
        }}
      >
        Sequential: Simple stacks | Functional: Any graph
      </motion.text>
    </svg>
  );
}
