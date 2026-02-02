'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * WarehouseRobotsDiagram
 *
 * Top-down view of a multi-robot warehouse management scenario.
 * Shows shelf rows, mobile robots navigating between them with planned
 * routes, and a packing station on the right side.
 */

interface WarehouseRobotsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

const shelfRows = [
  { y: 60, width: 260 },
  { y: 100, width: 260 },
  { y: 140, width: 260 },
  { y: 180, width: 260 },
  { y: 220, width: 260 },
];

const robots = [
  { id: 'r1', cx: 130, cy: 120, color: 'var(--color-accent)', label: 'R1', carrying: true },
  { id: 'r2', cx: 80, cy: 200, color: '#e07850', label: 'R2', carrying: false },
  { id: 'r3', cx: 220, cy: 80, color: '#5aa080', label: 'R3', carrying: false },
];

const routes = [
  { id: 'route1', d: 'M 130 120 L 300 120 L 380 120', robotId: 'r1' },
  { id: 'route2', d: 'M 80 200 L 80 160 L 180 160 L 300 160 L 380 160', robotId: 'r2' },
  { id: 'route3', d: 'M 220 80 L 300 80 L 300 120 L 380 120', robotId: 'r3' },
];

export default function WarehouseRobotsDiagram({ className = '' }: WarehouseRobotsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 300"
      className={className}
      role="img"
      aria-label="Top-down warehouse diagram with shelf rows, three mobile robots navigating planned routes, and a packing station"
      style={{ width: '100%', height: 'auto', fontFamily: 'var(--font-sans)' }}
    >
      <defs>
        <marker
          id="warehouse-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M 0 0 L 6 3 L 0 6 Z" fill="var(--color-text-tertiary)" />
        </marker>
      </defs>

      {/* ── Title ── */}
      <motion.text
        x="260"
        y="16"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Multi-Robot Warehouse
      </motion.text>

      {/* ── Warehouse outline ── */}
      <motion.rect
        x="20"
        y="30"
        width="330"
        height="240"
        rx="8"
        fill="none"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="6 3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Warehouse label ── */}
      <motion.text
        x="185"
        y="22"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        Warehouse Floor
      </motion.text>

      {/* ── Shelf rows ── */}
      {shelfRows.map((shelf, i) => (
        <motion.g
          key={`shelf-${i}`}
          initial={{ opacity: 0, x: -15 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="40"
            y={shelf.y}
            width={shelf.width}
            height="12"
            rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Shelf segment dividers */}
          {[0, 1, 2, 3, 4].map((seg) => (
            <line
              key={`seg-${i}-${seg}`}
              x1={40 + (seg + 1) * (shelf.width / 6)}
              y1={shelf.y + 1}
              x2={40 + (seg + 1) * (shelf.width / 6)}
              y2={shelf.y + 11}
              stroke="var(--color-border-primary)"
              strokeWidth="0.5"
              strokeOpacity="0.5"
            />
          ))}
        </motion.g>
      ))}

      {/* ── "Storage Racks" label ── */}
      <motion.text
        x="45"
        y="255"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        Storage Racks
      </motion.text>

      {/* ── Packing station ── */}
      <motion.g
        initial={{ opacity: 0, x: 15 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
        transition={{ duration: 0.5, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="390"
          y="70"
          width="110"
          height="170"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        {/* Conveyor belt lines */}
        {[0, 1, 2].map((j) => (
          <line
            key={`conveyor-${j}`}
            x1="405"
            y1={120 + j * 35}
            x2="485"
            y2={120 + j * 35}
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            strokeDasharray="4 2"
            strokeOpacity="0.6"
          />
        ))}
        {/* Packing boxes */}
        {[0, 1, 2].map((j) => (
          <rect
            key={`box-${j}`}
            x={415 + j * 22}
            y={100}
            width="14"
            height="12"
            rx="2"
            fill="var(--color-accent)"
            fillOpacity="0.2"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
        ))}
        <text
          x="445"
          y="88"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          Packing
        </text>
        <text
          x="445"
          y="215"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          Station
        </text>
      </motion.g>

      {/* ── Dotted route paths ── */}
      {routes.map((route, i) => (
        <motion.path
          key={route.id}
          d={route.d}
          fill="none"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeOpacity="0.6"
          markerEnd="url(#warehouse-arrow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.9, delay: 1.2 + i * 0.2, ease: PRODUCTIVE_EASE }}
        />
      ))}

      {/* ── Robots ── */}
      {robots.map((robot, i) => (
        <motion.g
          key={robot.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.5, delay: 0.9 + i * 0.15, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: `${robot.cx}px ${robot.cy}px` }}
        >
          {/* Robot body */}
          <circle
            cx={robot.cx}
            cy={robot.cy}
            r="12"
            fill={robot.color}
            fillOpacity="0.15"
            stroke={robot.color}
            strokeWidth="2"
          />
          <circle
            cx={robot.cx}
            cy={robot.cy}
            r="5"
            fill={robot.color}
          />

          {/* Carried item (small square) */}
          {robot.carrying && (
            <rect
              x={robot.cx + 6}
              y={robot.cy - 10}
              width="8"
              height="8"
              rx="1.5"
              fill="var(--color-accent)"
              fillOpacity="0.4"
              stroke="var(--color-accent)"
              strokeWidth="1"
            />
          )}

          {/* Robot label */}
          <text
            x={robot.cx}
            y={robot.cy + 24}
            textAnchor="middle"
            fill={robot.color}
            fontSize="9"
            fontWeight="600"
          >
            {robot.label}
          </text>
        </motion.g>
      ))}

      {/* ── "Mobile Robots" label ── */}
      <motion.text
        x="145"
        y="268"
        fill="var(--color-text-secondary)"
        fontSize="10"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
      >
        Mobile Robots
      </motion.text>

      {/* ── Legend: planned route line ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1="250"
          y1="282"
          x2="280"
          y2="282"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.2"
          strokeDasharray="4 3"
          strokeOpacity="0.6"
        />
        <text
          x="285"
          y="285"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Planned Route
        </text>
      </motion.g>

      {/* ── Legend: carrying item ── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.1, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="370"
          y="277"
          width="8"
          height="8"
          rx="1.5"
          fill="var(--color-accent)"
          fillOpacity="0.4"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <text
          x="383"
          y="285"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Carried Item
        </text>
      </motion.g>
    </svg>
  );
}
