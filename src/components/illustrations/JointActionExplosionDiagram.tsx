'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface JointActionExplosionDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function JointActionExplosionDiagram({ className = '' }: JointActionExplosionDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  /* Column centers */
  const col1X = 85;
  const col2X = 250;
  const col3X = 415;

  /* Bar geometry */
  const barY = 140;
  const barH = 28;
  const bar1W = 18;   /* 6 actions - tiny */
  const bar2W = 90;   /* 216 actions - medium */
  const bar3W = 200;  /* enormous - overflows right edge */

  /* Jagged clip: creates a torn/broken right edge to show the bar extends beyond the frame */
  const jaggedClipPath = `
    M ${col3X - 10} ${barY - 2}
    L ${col3X + bar3W - 30} ${barY - 2}
    L ${col3X + bar3W - 28} ${barY + 4}
    L ${col3X + bar3W - 20} ${barY + 1}
    L ${col3X + bar3W - 18} ${barY + 8}
    L ${col3X + bar3W - 10} ${barY + 5}
    L ${col3X + bar3W - 8} ${barY + 12}
    L ${col3X + bar3W} ${barY + 10}
    L ${col3X + bar3W} ${barY + barH - 10}
    L ${col3X + bar3W - 8} ${barY + barH - 12}
    L ${col3X + bar3W - 10} ${barY + barH - 5}
    L ${col3X + bar3W - 18} ${barY + barH - 8}
    L ${col3X + bar3W - 20} ${barY + barH - 1}
    L ${col3X + bar3W - 28} ${barY + barH - 4}
    L ${col3X + bar3W - 30} ${barY + barH + 2}
    L ${col3X - 10} ${barY + barH + 2}
    Z
  `;

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 280"
      className={className}
      role="img"
      aria-label="Joint action space explosion diagram showing exponential growth from 1 agent with 6 actions to 100 agents with 6 to the 100th power actions"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <clipPath id="jae-jagged-clip">
          <path d={jaggedClipPath} />
        </clipPath>
        <marker
          id="arrowhead-jae"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* ===== COLUMN 1: 1 Agent ===== */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Agent count label */}
        <text
          x={col1X}
          y="38"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          1 Agent
        </text>

        {/* Single agent icon */}
        <circle
          cx={col1X}
          cy="60"
          r="10"
          fill="var(--color-accent)"
          opacity="0.6"
        />
        <circle
          cx={col1X}
          cy="60"
          r="4"
          fill="var(--color-bg-elevated)"
        />

        {/* Action count */}
        <text
          x={col1X}
          y="95"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="500"
        >
          6 actions
        </text>

        {/* Value label */}
        <text
          x={col1X}
          y="115"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="12"
          fontWeight="600"
        >
          = 6
        </text>
      </motion.g>

      {/* Bar 1 */}
      <motion.rect
        x={col1X - bar1W / 2}
        y={barY}
        width={bar1W}
        height={barH}
        rx="4"
        fill="var(--color-accent)"
        opacity="0.7"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${col1X - bar1W / 2}px ${barY}px` }}
      />

      {/* ===== COLUMN 2: 3 Agents ===== */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Agent count label */}
        <text
          x={col2X}
          y="38"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          3 Agents
        </text>

        {/* Three agent icons */}
        <circle cx={col2X - 18} cy="60" r="8" fill="var(--color-accent)" opacity="0.5" />
        <circle cx={col2X - 18} cy="60" r="3" fill="var(--color-bg-elevated)" />
        <circle cx={col2X} cy="60" r="8" fill="var(--color-text-secondary)" opacity="0.4" />
        <circle cx={col2X} cy="60" r="3" fill="var(--color-bg-elevated)" />
        <circle cx={col2X + 18} cy="60" r="8" fill="var(--color-text-tertiary)" opacity="0.5" />
        <circle cx={col2X + 18} cy="60" r="3" fill="var(--color-bg-elevated)" />

        {/* Action count */}
        <text
          x={col2X}
          y="95"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="500"
        >
          6 actions each
        </text>

        {/* Value label */}
        <text
          x={col2X}
          y="115"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="12"
          fontWeight="600"
        >
          6&#xB3; = 216
        </text>
      </motion.g>

      {/* Bar 2 */}
      <motion.rect
        x={col2X - bar2W / 2}
        y={barY}
        width={bar2W}
        height={barH}
        rx="4"
        fill="var(--color-accent)"
        opacity="0.7"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${col2X - bar2W / 2}px ${barY}px` }}
      />

      {/* ===== COLUMN 3: 100 Agents ===== */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Agent count label */}
        <text
          x={col3X}
          y="38"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="13"
          fontWeight="600"
        >
          100 Agents
        </text>

        {/* Crowd of tiny agent dots */}
        {[
          [-24, -8], [-16, -8], [-8, -8], [0, -8], [8, -8], [16, -8], [24, -8],
          [-20, 0], [-12, 0], [-4, 0], [4, 0], [12, 0], [20, 0],
          [-24, 8], [-16, 8], [-8, 8], [0, 8], [8, 8], [16, 8], [24, 8],
        ].map(([dx, dy], i) => (
          <circle
            key={`agent-dot-${i}`}
            cx={col3X + dx}
            cy={60 + dy}
            r="3"
            fill={
              i % 3 === 0
                ? 'var(--color-accent)'
                : i % 3 === 1
                ? 'var(--color-text-secondary)'
                : 'var(--color-text-tertiary)'
            }
            opacity={0.4 + (i % 3) * 0.15}
          />
        ))}
        <text
          x={col3X}
          y="80"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          ...
        </text>

        {/* Action count */}
        <text
          x={col3X}
          y="95"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="500"
        >
          6 actions each
        </text>

        {/* Value label */}
        <text
          x={col3X}
          y="115"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="12"
          fontWeight="600"
        >
          {'6\u00B9\u2070\u2070 \u2248 10\u2077\u2078'}
        </text>
      </motion.g>

      {/* Bar 3 - enormous, clipped with jagged edge */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        {/* The enormous bar, clipped */}
        <motion.rect
          x={col3X - 10}
          y={barY}
          width={bar3W}
          height={barH}
          rx="4"
          fill="var(--color-accent)"
          opacity="0.7"
          clipPath="url(#jae-jagged-clip)"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.0, delay: 0.8, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: `${col3X - 10}px ${barY}px` }}
        />

        {/* Overflow indicator: double arrows pointing right beyond the frame */}
        <motion.g
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="490"
            y={barY + barH / 2 + 4}
            textAnchor="end"
            fill="var(--color-accent)"
            fontSize="13"
            fontWeight="700"
          >
            {'>>>'}
          </text>
        </motion.g>
      </motion.g>

      {/* ===== GROWTH ARROWS between columns ===== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {/* Arrow col1 -> col2 */}
        <line
          x1={col1X + 35}
          y1={barY + barH / 2}
          x2={col2X - 55}
          y2={barY + barH / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          markerEnd="url(#arrowhead-jae)"
        />
        {/* Arrow col2 -> col3 */}
        <line
          x1={col2X + 55}
          y1={barY + barH / 2}
          x2={col3X - 20}
          y2={barY + barH / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          strokeDasharray="4,3"
          markerEnd="url(#arrowhead-jae)"
        />
      </motion.g>

      {/* ===== HORIZONTAL AXIS ===== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="40"
          y1={barY + barH + 20}
          x2="490"
          y2={barY + barH + 20}
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="250"
          y={barY + barH + 38}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="500"
        >
          Joint action space size
        </text>
      </motion.g>

      {/* ===== SCALE COMPARISON NOTE ===== */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="130"
          y="228"
          width="240"
          height="30"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="250"
          y="241"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="500"
        >
          {'10\u2077\u2078 > atoms in the observable universe'}
        </text>
        <text
          x="250"
          y="253"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Exhaustive search is impossible
        </text>
      </motion.g>

      {/* ===== BOTTOM LABEL ===== */}
      <motion.text
        x="250"
        y="272"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        Combinatorial explosion of joint actions
      </motion.text>
    </svg>
  );
}
