'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BookRoadmapDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function BookRoadmapDiagram({ className = '' }: BookRoadmapDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const partIBoxes = [
    { id: 'rl-foundations', label: 'RL Foundations', chapter: 'Ch 2', x: 45 },
    { id: 'game-models', label: 'Game Models', chapter: 'Ch 3', x: 185 },
    { id: 'solution-concepts', label: 'Solution Concepts', chapter: 'Ch 4', x: 325 },
    { id: 'foundational-marl', label: 'Foundational MARL', chapter: 'Ch 5\u20136', x: 465 },
  ];

  const partIIBoxes = [
    { id: 'deep-learning', label: 'Deep Learning', chapter: 'Ch 7', x: 45 },
    { id: 'deep-rl', label: 'Deep RL', chapter: 'Ch 8', x: 185 },
    { id: 'deep-marl', label: 'Deep MARL', chapter: 'Ch 9', x: 325 },
    { id: 'practice', label: 'Practice', chapter: 'Ch 10\u201311', x: 465 },
  ];

  const boxWidth = 110;
  const boxHeight = 36;
  const partIOffsetX = 20;
  const partIIOffsetX = 20;
  const partIY = 95;
  const partIIY = 95;
  const partIGroupX = 0;
  const partIIGroupX = 350;

  // Compute actual positions for each part
  const getPartIPos = (box: typeof partIBoxes[0]) => ({
    cx: partIGroupX + partIOffsetX + box.x,
    cy: partIY,
  });
  const getPartIIPos = (box: typeof partIIBoxes[0]) => ({
    cx: partIIGroupX + partIOffsetX + box.x,
    cy: partIIY,
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 700 220"
      className={className}
      role="img"
      aria-label="Book Roadmap Diagram showing two-part structure: Part I covers RL Foundations, Game Models, Solution Concepts, and Foundational MARL; Part II covers Deep Learning, Deep RL, Deep MARL, and Practice"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="book-roadmap-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-border-primary)"
          />
        </marker>
        <marker
          id="book-roadmap-arrow-accent"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 10 4, 0 8"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* ===== Part I background region ===== */}
      <motion.rect
        x="5"
        y="40"
        width="335"
        height="140"
        rx="10"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        strokeDasharray="none"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Part I label */}
      <motion.text
        x="172"
        y="60"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        Part I: Foundations
      </motion.text>

      {/* ===== Part II background region ===== */}
      <motion.rect
        x="360"
        y="40"
        width="335"
        height="140"
        rx="10"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      />

      {/* Part II label */}
      <motion.text
        x="527"
        y="60"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        Part II: Deep MARL
      </motion.text>

      {/* ===== Part I boxes and arrows ===== */}
      {partIBoxes.map((box, i) => {
        const pos = getPartIPos(box);
        const bx = pos.cx - boxWidth / 2;
        const by = pos.cy - boxHeight / 2;

        return (
          <g key={box.id}>
            {/* Box */}
            <motion.rect
              x={bx}
              y={by}
              width={boxWidth}
              height={boxHeight}
              rx="8"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-border-primary)"
              strokeWidth="2"
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{
                duration: 0.4,
                delay: 0.25 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Label */}
            <motion.text
              x={pos.cx}
              y={pos.cy + 1}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="10"
              fontWeight="600"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{
                duration: 0.4,
                delay: 0.35 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {box.label}
            </motion.text>

            {/* Chapter number */}
            <motion.text
              x={pos.cx}
              y={pos.cy + boxHeight / 2 + 16}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.45 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {box.chapter}
            </motion.text>
          </g>
        );
      })}

      {/* Arrows between Part I boxes */}
      {partIBoxes.slice(0, -1).map((box, i) => {
        const pos1 = getPartIPos(box);
        const pos2 = getPartIPos(partIBoxes[i + 1]);
        const x1 = pos1.cx + boxWidth / 2 + 2;
        const x2 = pos2.cx - boxWidth / 2 - 2;
        const y = pos1.cy;

        return (
          <motion.line
            key={`partI-arrow-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            markerEnd="url(#book-roadmap-arrow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.5 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* ===== Bridging arrow from Part I to Part II ===== */}
      <motion.line
        x1={getPartIPos(partIBoxes[3]).cx + boxWidth / 2 + 4}
        y1={partIY}
        x2={getPartIIPos(partIIBoxes[0]).cx - boxWidth / 2 - 4}
        y2={partIIY}
        stroke="var(--color-accent)"
        strokeWidth="2.5"
        markerEnd="url(#book-roadmap-arrow-accent)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.1,
          ease: PRODUCTIVE_EASE,
        }}
      />

      {/* ===== Part II boxes and arrows ===== */}
      {partIIBoxes.map((box, i) => {
        const pos = getPartIIPos(box);
        const bx = pos.cx - boxWidth / 2;
        const by = pos.cy - boxHeight / 2;

        return (
          <g key={box.id}>
            {/* Box */}
            <motion.rect
              x={bx}
              y={by}
              width={boxWidth}
              height={boxHeight}
              rx="8"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="2"
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{
                duration: 0.4,
                delay: 1.2 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Label */}
            <motion.text
              x={pos.cx}
              y={pos.cy + 1}
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="10"
              fontWeight="600"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{
                duration: 0.4,
                delay: 1.3 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {box.label}
            </motion.text>

            {/* Chapter number */}
            <motion.text
              x={pos.cx}
              y={pos.cy + boxHeight / 2 + 16}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 1.4 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {box.chapter}
            </motion.text>
          </g>
        );
      })}

      {/* Arrows between Part II boxes */}
      {partIIBoxes.slice(0, -1).map((box, i) => {
        const pos1 = getPartIIPos(box);
        const pos2 = getPartIIPos(partIIBoxes[i + 1]);
        const x1 = pos1.cx + boxWidth / 2 + 2;
        const x2 = pos2.cx - boxWidth / 2 - 2;
        const y = pos1.cy;

        return (
          <motion.line
            key={`partII-arrow-${i}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="var(--color-accent)"
            strokeWidth="2"
            markerEnd="url(#book-roadmap-arrow-accent)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: 0.35,
              delay: 1.45 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* Bottom description */}
      <motion.text
        x="350"
        y="205"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.1, ease: PRODUCTIVE_EASE }}
      >
        Foundations build toward modern deep multi-agent reinforcement learning
      </motion.text>
    </svg>
  );
}
