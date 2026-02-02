'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MlLifecycleDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

/* ---------- geometry helpers ---------- */
const CX = 220;
const CY = 185;
const ORBIT = 110; // radius of the imaginary circle the 3 nodes sit on

/** Returns {x, y} for an angle (degrees, 0 = top) on the orbit circle. */
function pos(angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + ORBIT * Math.cos(rad), y: CY + ORBIT * Math.sin(rad) };
}

/* Phase positions: equilateral triangle, "Define" at top */
const DEFINE = pos(270); // top
const DEVELOP = pos(30); // bottom-right
const DEPLOY = pos(150); // bottom-left

const phases = [
  {
    id: 'define',
    label: 'Define Task',
    sub: ['Frame problem', 'Collect data', 'Choose metric'],
    ...DEFINE,
    color: 'var(--color-accent)',
    bgColor: 'var(--color-accent-subtle)',
  },
  {
    id: 'develop',
    label: 'Develop Model',
    sub: ['Baseline', 'Overfit', 'Regularize'],
    ...DEVELOP,
    color: 'var(--color-text-secondary)',
    bgColor: 'var(--color-bg-elevated)',
  },
  {
    id: 'deploy',
    label: 'Deploy & Monitor',
    sub: ['Export & serve', 'A/B test', 'Retrain'],
    ...DEPLOY,
    color: 'var(--color-text-secondary)',
    bgColor: 'var(--color-bg-elevated)',
  },
] as const;

/* Arrow pairs: from → to index */
const arrows = [
  { from: 0, to: 1 }, // define → develop
  { from: 1, to: 2 }, // develop → deploy
  { from: 2, to: 0 }, // deploy → define (retrain loop)
];

/**
 * Build a curved path (arc) between two phase centres, offset inward
 * slightly so the arrow visually rides the triangle edge.
 */
function arcPath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  /* Pull the control point toward the center for a gentle curve */
  const cpx = mx + (CX - mx) * 0.35;
  const cpy = my + (CY - my) * 0.35;

  /* Shorten start/end so the path doesn't overlap the node circles */
  const R = 36; // node radius buffer
  const dx1 = to.x - from.x;
  const dy1 = to.y - from.y;
  const len = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  const sx = from.x + (dx1 / len) * R;
  const sy = from.y + (dy1 / len) * R;
  const ex = to.x - (dx1 / len) * R;
  const ey = to.y - (dy1 / len) * R;

  return `M ${sx} ${sy} Q ${cpx} ${cpy} ${ex} ${ey}`;
}

/* ---------- icons ---------- */
const iconProps = {
  stroke: 'var(--color-text-primary)',
  strokeWidth: 1.8,
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function TargetIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r="10" {...iconProps} />
      {/* Middle ring */}
      <circle cx={cx} cy={cy} r="5.5" {...iconProps} />
      {/* Bullseye dot */}
      <circle cx={cx} cy={cy} r="1.8" fill="var(--color-text-primary)" stroke="none" />
      {/* Crosshair ticks */}
      <line x1={cx} y1={cy - 13} x2={cx} y2={cy - 10} {...iconProps} />
      <line x1={cx} y1={cy + 10} x2={cx} y2={cy + 13} {...iconProps} />
      <line x1={cx - 13} y1={cy} x2={cx - 10} y2={cy} {...iconProps} />
      <line x1={cx + 10} y1={cy} x2={cx + 13} y2={cy} {...iconProps} />
    </g>
  );
}

function CodeIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Left angle bracket < */}
      <polyline points={`${cx - 4},${cy - 7} ${cx - 10},${cy} ${cx - 4},${cy + 7}`} {...iconProps} />
      {/* Right angle bracket > */}
      <polyline points={`${cx + 4},${cy - 7} ${cx + 10},${cy} ${cx + 4},${cy + 7}`} {...iconProps} />
      {/* Slash / */}
      <line x1={cx + 2} y1={cy - 9} x2={cx - 2} y2={cy + 9} {...iconProps} strokeWidth={1.5} />
    </g>
  );
}

function ServerIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      {/* Top box */}
      <rect x={cx - 10} y={cy - 11} width="20" height="9" rx="2" {...iconProps} />
      {/* Bottom box */}
      <rect x={cx - 10} y={cy + 2} width="20" height="9" rx="2" {...iconProps} />
      {/* Status dots */}
      <circle cx={cx - 6} cy={cy - 6.5} r="1.2" fill="var(--color-text-primary)" stroke="none" />
      <circle cx={cx - 6} cy={cy + 6.5} r="1.2" fill="var(--color-text-primary)" stroke="none" />
      {/* Mini chart line inside bottom box */}
      <polyline
        points={`${cx - 2},${cy + 8} ${cx + 1},${cy + 5} ${cx + 4},${cy + 7} ${cx + 7},${cy + 4}`}
        {...iconProps}
        strokeWidth={1.2}
      />
    </g>
  );
}

function renderIcon(phaseId: string, cx: number, cy: number) {
  switch (phaseId) {
    case 'define':
      return <TargetIcon cx={cx} cy={cy} />;
    case 'develop':
      return <CodeIcon cx={cx} cy={cy} />;
    case 'deploy':
      return <ServerIcon cx={cx} cy={cy} />;
    default:
      return null;
  }
}

/* ---------- sub-label layout helper ---------- */
function subLabelAnchor(phaseId: string): {
  textAnchor: 'start' | 'middle' | 'end';
  dx: number;
  dy: number;
} {
  switch (phaseId) {
    case 'define':
      return { textAnchor: 'middle', dx: 0, dy: -50 };
    case 'develop':
      return { textAnchor: 'start', dx: 38, dy: 2 };
    case 'deploy':
      return { textAnchor: 'end', dx: -38, dy: 2 };
    default:
      return { textAnchor: 'middle', dx: 0, dy: 50 };
  }
}

/* ========== Component ========== */

export default function MlLifecycleDiagram({ className = '' }: MlLifecycleDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 440 360"
      className={className}
      role="img"
      aria-label="ML Lifecycle diagram showing three phases in a continuous cycle: Define Task, Develop Model, and Deploy and Monitor"
      style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
    >
      <defs>
        <marker
          id="arrowhead-ml-lifecycle"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* ---- Center label ---- */}
      <motion.g
        initial={{ opacity: 0, scale: 0.7 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx={CX}
          cy={CY}
          r="30"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          opacity="0.6"
        />
        <text
          x={CX}
          y={CY - 5}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          ML
        </text>
        <text
          x={CX}
          y={CY + 9}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-text-secondary)"
        >
          Lifecycle
        </text>
      </motion.g>

      {/* ---- Curved arrows between phases ---- */}
      {arrows.map((arrow, i) => {
        const from = phases[arrow.from];
        const to = phases[arrow.to];
        const d = arcPath(from, to);
        const isRetrain = i === 2; // deploy → define
        return (
          <motion.path
            key={`arrow-${i}`}
            d={d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
            strokeDasharray={isRetrain ? '5 4' : undefined}
            markerEnd="url(#arrowhead-ml-lifecycle)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: isRetrain ? 0.7 : 1 } : {}}
            transition={{
              duration: 0.6,
              delay: 1.0 + i * 0.35,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* ---- Phase nodes ---- */}
      {phases.map((phase, i) => {
        const anchor = subLabelAnchor(phase.id);
        return (
          <g key={phase.id}>
            {/* Node circle */}
            <motion.circle
              cx={phase.x}
              cy={phase.y}
              r={30}
              fill={phase.bgColor}
              stroke={phase.color}
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.3,
                ease: PRODUCTIVE_EASE,
              }}
              style={{ transformOrigin: `${phase.x}px ${phase.y}px` }}
            />

            {/* Icon inside the node */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.35 + i * 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {renderIcon(phase.id, phase.x, phase.y)}
            </motion.g>

            {/* Phase label (bold, outside the node) */}
            <motion.text
              x={phase.x + anchor.dx}
              y={phase.y + anchor.dy}
              textAnchor={anchor.textAnchor}
              dominantBaseline="middle"
              fontSize="12"
              fontWeight="600"
              fill={phase.id === 'define' ? 'var(--color-accent)' : 'var(--color-text-primary)'}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.3,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {phase.label}
            </motion.text>

            {/* Sub-labels (small, stacked) */}
            {phase.sub.map((step, j) => (
              <motion.text
                key={`${phase.id}-sub-${j}`}
                x={phase.x + anchor.dx}
                y={phase.y + anchor.dy + 15 + j * 13}
                textAnchor={anchor.textAnchor}
                dominantBaseline="middle"
                fontSize="9"
                fill="var(--color-text-tertiary)"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{
                  duration: 0.3,
                  delay: 0.65 + i * 0.3 + j * 0.08,
                  ease: PRODUCTIVE_EASE,
                }}
              >
                {step}
              </motion.text>
            ))}
          </g>
        );
      })}

      {/* ---- "retrain" annotation on the dashed arrow ---- */}
      <motion.text
        x={DEPLOY.x - 22}
        y={(DEPLOY.y + DEFINE.y) / 2 + 4}
        textAnchor="end"
        fontSize="9"
        fontStyle="italic"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : {}}
        transition={{ duration: 0.4, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        retrain
      </motion.text>
    </svg>
  );
}
