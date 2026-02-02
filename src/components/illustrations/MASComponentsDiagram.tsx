'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MASComponentsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function MASComponentsDiagram({ className = '' }: MASComponentsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 300"
      className={className}
      role="img"
      aria-label="Multi-Agent System components diagram showing Environment, Agents, and Goals and Rewards connected in a triangle"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-mas"
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
        <marker
          id="arrowhead-mas-accent"
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

      {/* ===== ENVIRONMENT BOX (top center) ===== */}
      <motion.g
        initial={{ opacity: 0, y: -15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="160"
          y="20"
          width="180"
          height="80"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />

        {/* Grid icon inside Environment box */}
        <g transform="translate(190, 36)">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`grid-${row}-${col}`}
                x={col * 11}
                y={row * 11}
                width="9"
                height="9"
                rx="1.5"
                fill={
                  (row + col) % 3 === 0
                    ? 'var(--color-accent)'
                    : 'var(--color-bg-tertiary)'
                }
                opacity={(row + col) % 3 === 0 ? 0.5 : 0.6}
                stroke="var(--color-border-primary)"
                strokeWidth="0.5"
              />
            ))
          )}
        </g>

        {/* Environment label */}
        <text
          x="300"
          y="56"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          Environment
        </text>
        <text
          x="300"
          y="72"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          States, transitions
        </text>
      </motion.g>

      {/* ===== AGENTS BOX (bottom left) ===== */}
      <motion.g
        initial={{ opacity: 0, x: -15 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
        transition={{ duration: 0.6, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="30"
          y="180"
          width="170"
          height="80"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />

        {/* Three agent circles */}
        <circle cx="75" cy="210" r="10" fill="var(--color-accent)" opacity="0.7" />
        <circle cx="75" cy="210" r="4" fill="var(--color-bg-elevated)" />

        <circle cx="105" cy="210" r="10" fill="var(--color-text-secondary)" opacity="0.5" />
        <circle cx="105" cy="210" r="4" fill="var(--color-bg-elevated)" />

        <circle cx="135" cy="210" r="10" fill="var(--color-text-tertiary)" opacity="0.6" />
        <circle cx="135" cy="210" r="4" fill="var(--color-bg-elevated)" />

        {/* Agents label */}
        <text
          x="115"
          y="240"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          Agents
        </text>
        <text
          x="115"
          y="253"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Policies, actions
        </text>
      </motion.g>

      {/* ===== GOALS & REWARDS BOX (bottom right) ===== */}
      <motion.g
        initial={{ opacity: 0, x: 15 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
        transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="300"
          y="180"
          width="170"
          height="80"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="2"
        />

        {/* Target/reward icon */}
        <g transform="translate(385, 210)">
          <circle cx="0" cy="0" r="14" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.4" />
          <circle cx="0" cy="0" r="9" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.6" />
          <circle cx="0" cy="0" r="4" fill="var(--color-accent)" opacity="0.8" />
        </g>

        {/* Goals label */}
        <text
          x="365"
          y="240"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          Goals &amp; Rewards
        </text>
        <text
          x="365"
          y="253"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Reward signals, objectives
        </text>
      </motion.g>

      {/* ===== CONNECTING LINES ===== */}

      {/* Line: Environment -> Agents (left side) with label "observes / acts" */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="195"
          y1="100"
          x2="130"
          y2="180"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-mas)"
        />
        <line
          x1="145"
          y1="180"
          x2="210"
          y2="100"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          markerEnd="url(#arrowhead-mas)"
        />
        {/* Label */}
        <rect
          x="97"
          y="126"
          width="78"
          height="18"
          rx="4"
          fill="var(--color-bg-elevated)"
          opacity="0.9"
        />
        <text
          x="136"
          y="139"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
        >
          observes / acts
        </text>
      </motion.g>

      {/* Line: Environment -> Goals (right side) with label "defines rewards" */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="305"
          y1="100"
          x2="370"
          y2="180"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-mas)"
        />
        <line
          x1="355"
          y1="180"
          x2="290"
          y2="100"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          markerEnd="url(#arrowhead-mas)"
        />
        {/* Label */}
        <rect
          x="310"
          y="126"
          width="85"
          height="18"
          rx="4"
          fill="var(--color-bg-elevated)"
          opacity="0.9"
        />
        <text
          x="352"
          y="139"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
        >
          defines rewards
        </text>
      </motion.g>

      {/* Line: Agents -> Goals (bottom) with label "pursue goals" */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="200"
          y1="225"
          x2="300"
          y2="225"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-mas-accent)"
        />
        <line
          x1="300"
          y1="215"
          x2="200"
          y2="215"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          markerEnd="url(#arrowhead-mas-accent)"
        />
        {/* Label */}
        <rect
          x="215"
          y="199"
          width="72"
          height="16"
          rx="4"
          fill="var(--color-bg-elevated)"
          opacity="0.9"
        />
        <text
          x="250"
          y="211"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
        >
          pursue goals
        </text>
      </motion.g>

      {/* ===== TITLE / SUBTITLE ===== */}
      <motion.text
        x="250"
        y="290"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="11"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Core components of a Multi-Agent System
      </motion.text>
    </svg>
  );
}
