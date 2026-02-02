'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface EvaluationPitfallsDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function EvaluationPitfallsDiagram({
  className = '',
}: EvaluationPitfallsDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  /* Layout constants */
  const panelWidth = 156;
  const panelGap = 18;
  const panelStartX = 16;
  const panelY = 28;
  const panelHeight = 190;

  /* Per-panel x origins */
  const p1x = panelStartX;
  const p2x = panelStartX + panelWidth + panelGap;
  const p3x = panelStartX + 2 * (panelWidth + panelGap);

  /* Shared sub-layout offsets within each panel */
  const titleY = panelY + 16;
  const vizTopY = panelY + 34;
  const warningY = panelY + panelHeight - 14;

  /* Data bar dimensions shared by panels */
  const barInset = 12;
  const barWidth = panelWidth - barInset * 2;
  const barHeight = 18;

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 260"
      role="img"
      aria-label="Three common evaluation pitfalls: unsorted splits, temporal data leakage, and data redundancy between train and validation sets"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Title */}
      <motion.text
        x={270}
        y={18}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="12"
        fontWeight="600"
        initial={{ opacity: 0, y: -6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Common Evaluation Pitfalls
      </motion.text>

      {/* ===== Panel 1: Unsorted Split ===== */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background */}
        <rect
          x={p1x}
          y={panelY}
          width={panelWidth}
          height={panelHeight}
          rx={6}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Panel title */}
        <text
          x={p1x + panelWidth / 2}
          y={titleY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="600"
        >
          Unsorted Split
        </text>

        {/* --- Wrong way: sorted data bar --- */}
        <text
          x={p1x + barInset}
          y={vizTopY + 6}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Sorted by class:
        </text>

        {/* Red section (class A) */}
        <rect
          x={p1x + barInset}
          y={vizTopY + 12}
          width={barWidth * 0.6}
          height={barHeight}
          rx={3}
          fill="var(--color-accent)"
          opacity={0.7}
        />
        <text
          x={p1x + barInset + (barWidth * 0.6) / 2}
          y={vizTopY + 12 + barHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-bg-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Class A
        </text>

        {/* Blue section (class B) */}
        <rect
          x={p1x + barInset + barWidth * 0.6}
          y={vizTopY + 12}
          width={barWidth * 0.4}
          height={barHeight}
          rx={3}
          fill="var(--color-text-secondary)"
          opacity={0.5}
        />
        <text
          x={p1x + barInset + barWidth * 0.6 + (barWidth * 0.4) / 2}
          y={vizTopY + 12 + barHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-bg-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Class B
        </text>

        {/* Split line with scissors icon */}
        <line
          x1={p1x + barInset + barWidth * 0.7}
          y1={vizTopY + 10}
          x2={p1x + barInset + barWidth * 0.7}
          y2={vizTopY + 12 + barHeight + 2}
          stroke="var(--color-text-primary)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        {/* Labels for the wrong split */}
        <text
          x={p1x + barInset + (barWidth * 0.7) / 2}
          y={vizTopY + 38}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Train
        </text>
        <text
          x={p1x + barInset + barWidth * 0.7 + (barWidth * 0.3) / 2}
          y={vizTopY + 38}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
        >
          Val
        </text>

        {/* X mark - wrong */}
        <text
          x={p1x + panelWidth - barInset - 2}
          y={vizTopY + 38}
          textAnchor="end"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="700"
        >
          {'✗'}
        </text>

        {/* Problem annotation */}
        <text
          x={p1x + panelWidth / 2}
          y={vizTopY + 54}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Train = mostly A, Val = mostly B
        </text>

        {/* Divider */}
        <line
          x1={p1x + barInset}
          y1={vizTopY + 64}
          x2={p1x + panelWidth - barInset}
          y2={vizTopY + 64}
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          opacity={0.5}
        />

        {/* --- Correct way: shuffled data bar --- */}
        <text
          x={p1x + barInset}
          y={vizTopY + 78}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          After shuffling:
        </text>

        {/* Shuffled bar - alternating small segments */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const segW = barWidth / 10;
          const isClassA = [0, 2, 3, 5, 7, 9].includes(i);
          return (
            <rect
              key={`shuffle-${i}`}
              x={p1x + barInset + i * segW}
              y={vizTopY + 84}
              width={segW}
              height={barHeight}
              rx={i === 0 ? 3 : i === 9 ? 3 : 0}
              fill={
                isClassA
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)'
              }
              opacity={isClassA ? 0.7 : 0.5}
            />
          );
        })}

        {/* Split line on shuffled bar */}
        <line
          x1={p1x + barInset + barWidth * 0.7}
          y1={vizTopY + 82}
          x2={p1x + barInset + barWidth * 0.7}
          y2={vizTopY + 84 + barHeight + 2}
          stroke="var(--color-text-primary)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        {/* Labels for the correct split */}
        <text
          x={p1x + barInset + (barWidth * 0.7) / 2}
          y={vizTopY + 110}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Train
        </text>
        <text
          x={p1x + barInset + barWidth * 0.7 + (barWidth * 0.3) / 2}
          y={vizTopY + 110}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
        >
          Val
        </text>

        {/* Check mark - correct */}
        <text
          x={p1x + panelWidth - barInset - 2}
          y={vizTopY + 110}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="700"
        >
          {'✓'}
        </text>

        {/* Warning pill */}
        <rect
          x={p1x + panelWidth / 2 - 42}
          y={warningY - 9}
          width={84}
          height={18}
          rx={9}
          fill="var(--color-accent)"
          opacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <text
          x={p1x + panelWidth / 2}
          y={warningY + 2}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Shuffle first!
        </text>
      </motion.g>

      {/* ===== Panel 2: Temporal Leak ===== */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background */}
        <rect
          x={p2x}
          y={panelY}
          width={panelWidth}
          height={panelHeight}
          rx={6}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Panel title */}
        <text
          x={p2x + panelWidth / 2}
          y={titleY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="600"
        >
          Temporal Leak
        </text>

        {/* --- Wrong way: random split on time-series --- */}
        <text
          x={p2x + barInset}
          y={vizTopY + 6}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Random split on time data:
        </text>

        {/* Timeline bar - wrong: train uses future data */}
        {/* Time arrow base */}
        <line
          x1={p2x + barInset}
          y1={vizTopY + 12 + barHeight + 6}
          x2={p2x + panelWidth - barInset}
          y2={vizTopY + 12 + barHeight + 6}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity={0.5}
        />
        {/* Time arrow head */}
        <polygon
          points={`${p2x + panelWidth - barInset},${vizTopY + 12 + barHeight + 6} ${p2x + panelWidth - barInset - 5},${vizTopY + 12 + barHeight + 3} ${p2x + panelWidth - barInset - 5},${vizTopY + 12 + barHeight + 9}`}
          fill="var(--color-text-tertiary)"
          opacity={0.5}
        />
        <text
          x={p2x + panelWidth - barInset}
          y={vizTopY + 12 + barHeight + 16}
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          opacity={0.7}
        >
          time
        </text>

        {/* Scrambled time segments - train mixed with future */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const segW = barWidth / 8;
          const isTrain = [0, 2, 4, 7].includes(i);
          return (
            <rect
              key={`temporal-wrong-${i}`}
              x={p2x + barInset + i * segW}
              y={vizTopY + 12}
              width={segW}
              height={barHeight}
              rx={i === 0 ? 3 : i === 7 ? 3 : 0}
              fill={
                isTrain
                  ? 'var(--color-accent)'
                  : 'var(--color-text-secondary)'
              }
              opacity={isTrain ? 0.7 : 0.4}
            />
          );
        })}

        {/* X mark - wrong */}
        <text
          x={p2x + panelWidth - barInset - 2}
          y={vizTopY + 12 + barHeight / 2 + 1}
          textAnchor="end"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="700"
        >
          {'✗'}
        </text>

        {/* Problem annotation */}
        <text
          x={p2x + panelWidth / 2}
          y={vizTopY + 54}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Train sees future data!
        </text>

        {/* Divider */}
        <line
          x1={p2x + barInset}
          y1={vizTopY + 64}
          x2={p2x + panelWidth - barInset}
          y2={vizTopY + 64}
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          opacity={0.5}
        />

        {/* --- Correct way: chronological split --- */}
        <text
          x={p2x + barInset}
          y={vizTopY + 78}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Chronological split:
        </text>

        {/* Past = train (left), future = test (right) */}
        <rect
          x={p2x + barInset}
          y={vizTopY + 84}
          width={barWidth * 0.65}
          height={barHeight}
          rx={3}
          fill="var(--color-accent)"
          opacity={0.7}
        />
        <text
          x={p2x + barInset + (barWidth * 0.65) / 2}
          y={vizTopY + 84 + barHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-bg-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Past (Train)
        </text>

        <rect
          x={p2x + barInset + barWidth * 0.65}
          y={vizTopY + 84}
          width={barWidth * 0.35}
          height={barHeight}
          rx={3}
          fill="var(--color-text-secondary)"
          opacity={0.5}
        />
        <text
          x={p2x + barInset + barWidth * 0.65 + (barWidth * 0.35) / 2}
          y={vizTopY + 84 + barHeight / 2 + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--color-bg-primary)"
          fontSize="9"
          fontWeight="600"
        >
          Future (Test)
        </text>

        {/* Time arrow for correct */}
        <line
          x1={p2x + barInset}
          y1={vizTopY + 84 + barHeight + 6}
          x2={p2x + panelWidth - barInset}
          y2={vizTopY + 84 + barHeight + 6}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.8"
          opacity={0.5}
        />
        <polygon
          points={`${p2x + panelWidth - barInset},${vizTopY + 84 + barHeight + 6} ${p2x + panelWidth - barInset - 5},${vizTopY + 84 + barHeight + 3} ${p2x + panelWidth - barInset - 5},${vizTopY + 84 + barHeight + 9}`}
          fill="var(--color-text-tertiary)"
          opacity={0.5}
        />
        <text
          x={p2x + panelWidth - barInset}
          y={vizTopY + 84 + barHeight + 16}
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          opacity={0.7}
        >
          time
        </text>

        {/* Check mark - correct */}
        <text
          x={p2x + panelWidth - barInset - 2}
          y={vizTopY + 84 + barHeight / 2 + 1}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="700"
        >
          {'✓'}
        </text>

        {/* Warning pill */}
        <rect
          x={p2x + panelWidth / 2 - 62}
          y={warningY - 9}
          width={124}
          height={18}
          rx={9}
          fill="var(--color-accent)"
          opacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <text
          x={p2x + panelWidth / 2}
          y={warningY + 2}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Chronological split only!
        </text>
      </motion.g>

      {/* ===== Panel 3: Data Redundancy ===== */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, delay: 0.65, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel background */}
        <rect
          x={p3x}
          y={panelY}
          width={panelWidth}
          height={panelHeight}
          rx={6}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Panel title */}
        <text
          x={p3x + panelWidth / 2}
          y={titleY}
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="10"
          fontWeight="600"
        >
          Data Redundancy
        </text>

        {/* --- Wrong way: duplicates in both sets --- */}
        <text
          x={p3x + barInset}
          y={vizTopY + 6}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          Duplicates leak across:
        </text>

        {/* Train set box */}
        <rect
          x={p3x + barInset}
          y={vizTopY + 14}
          width={barWidth * 0.45}
          height={42}
          rx={4}
          fill="var(--color-accent)"
          opacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <text
          x={p3x + barInset + (barWidth * 0.45) / 2}
          y={vizTopY + 24}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Train
        </text>

        {/* Data points in train */}
        {[
          { cx: 20, cy: 34, dup: true },
          { cx: 38, cy: 40, dup: false },
          { cx: 28, cy: 48, dup: true },
        ].map((pt, i) => (
          <circle
            key={`train-pt-${i}`}
            cx={p3x + barInset + pt.cx}
            cy={vizTopY + pt.cy}
            r={4}
            fill={
              pt.dup ? 'var(--color-accent)' : 'var(--color-text-tertiary)'
            }
            opacity={pt.dup ? 0.9 : 0.5}
          />
        ))}

        {/* Validation set box */}
        <rect
          x={p3x + barInset + barWidth * 0.55}
          y={vizTopY + 14}
          width={barWidth * 0.45}
          height={42}
          rx={4}
          fill="var(--color-text-secondary)"
          opacity={0.08}
          stroke="var(--color-text-secondary)"
          strokeWidth="0.8"
        />
        <text
          x={p3x + barInset + barWidth * 0.55 + (barWidth * 0.45) / 2}
          y={vizTopY + 24}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
        >
          Val
        </text>

        {/* Data points in val - some duplicates highlighted */}
        {[
          { cx: 16, cy: 34, dup: true },
          { cx: 34, cy: 42, dup: false },
          { cx: 24, cy: 48, dup: true },
        ].map((pt, i) => (
          <circle
            key={`val-pt-${i}`}
            cx={p3x + barInset + barWidth * 0.55 + pt.cx}
            cy={vizTopY + pt.cy}
            r={4}
            fill={
              pt.dup ? 'var(--color-accent)' : 'var(--color-text-tertiary)'
            }
            opacity={pt.dup ? 0.9 : 0.5}
          />
        ))}

        {/* Dashed lines connecting duplicates */}
        <line
          x1={p3x + barInset + 20}
          y1={vizTopY + 34}
          x2={p3x + barInset + barWidth * 0.55 + 16}
          y2={vizTopY + 34}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity={0.6}
        />
        <line
          x1={p3x + barInset + 28}
          y1={vizTopY + 48}
          x2={p3x + barInset + barWidth * 0.55 + 24}
          y2={vizTopY + 48}
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity={0.6}
        />

        {/* "Same!" annotations */}
        <text
          x={p3x + panelWidth / 2}
          y={vizTopY + 33}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          same!
        </text>
        <text
          x={p3x + panelWidth / 2}
          y={vizTopY + 47}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          same!
        </text>

        {/* X mark */}
        <text
          x={p3x + panelWidth - barInset - 2}
          y={vizTopY + 62}
          textAnchor="end"
          fill="var(--color-accent)"
          fontSize="10"
          fontWeight="700"
        >
          {'✗'}
        </text>

        {/* Problem annotation */}
        <text
          x={p3x + panelWidth / 2}
          y={vizTopY + 68}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          Model memorizes, not generalizes
        </text>

        {/* Divider */}
        <line
          x1={p3x + barInset}
          y1={vizTopY + 76}
          x2={p3x + panelWidth - barInset}
          y2={vizTopY + 76}
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          opacity={0.5}
        />

        {/* --- Correct way: deduplicated --- */}
        <text
          x={p3x + barInset}
          y={vizTopY + 90}
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          After deduplication:
        </text>

        {/* Clean train set box */}
        <rect
          x={p3x + barInset}
          y={vizTopY + 96}
          width={barWidth * 0.45}
          height={30}
          rx={4}
          fill="var(--color-accent)"
          opacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <text
          x={p3x + barInset + (barWidth * 0.45) / 2}
          y={vizTopY + 104}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Train
        </text>

        {/* Unique points in train */}
        {[
          { cx: 18, cy: 116 },
          { cx: 34, cy: 118 },
          { cx: 50, cy: 114 },
        ].map((pt, i) => (
          <circle
            key={`clean-train-${i}`}
            cx={p3x + barInset + pt.cx}
            cy={vizTopY + pt.cy - vizTopY + vizTopY}
            r={3.5}
            fill="var(--color-accent)"
            opacity={0.7}
          />
        ))}

        {/* Clean val set box */}
        <rect
          x={p3x + barInset + barWidth * 0.55}
          y={vizTopY + 96}
          width={barWidth * 0.45}
          height={30}
          rx={4}
          fill="var(--color-text-secondary)"
          opacity={0.08}
          stroke="var(--color-text-secondary)"
          strokeWidth="0.8"
        />
        <text
          x={p3x + barInset + barWidth * 0.55 + (barWidth * 0.45) / 2}
          y={vizTopY + 104}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="600"
        >
          Val
        </text>

        {/* Different unique points in val */}
        {[
          { cx: 14, cy: 116 },
          { cx: 30, cy: 114 },
          { cx: 46, cy: 118 },
        ].map((pt, i) => (
          <circle
            key={`clean-val-${i}`}
            cx={p3x + barInset + barWidth * 0.55 + pt.cx}
            cy={vizTopY + pt.cy - vizTopY + vizTopY}
            r={3.5}
            fill="var(--color-text-secondary)"
            opacity={0.5}
          />
        ))}

        {/* No overlap indicator */}
        <text
          x={p3x + panelWidth / 2}
          y={vizTopY + 134}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontWeight="500"
        >
          No overlap
        </text>

        {/* Check mark */}
        <text
          x={p3x + panelWidth - barInset - 2}
          y={vizTopY + 134}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="700"
        >
          {'✓'}
        </text>

        {/* Warning pill */}
        <rect
          x={p3x + panelWidth / 2 - 58}
          y={warningY - 9}
          width={116}
          height={18}
          rx={9}
          fill="var(--color-accent)"
          opacity={0.12}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
        />
        <text
          x={p3x + panelWidth / 2}
          y={warningY + 2}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="600"
        >
          Check for duplicates!
        </text>
      </motion.g>

      {/* Bottom summary line */}
      <motion.text
        x={270}
        y={248}
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        Poor evaluation strategy leads to misleading metrics
      </motion.text>
    </svg>
  );
}
