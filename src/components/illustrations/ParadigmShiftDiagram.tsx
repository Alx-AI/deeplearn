'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * ParadigmShiftDiagram
 *
 * Two-panel comparison: Classical Programming vs Machine Learning.
 * Left:  Rules + Data -> Answers   (classical)
 * Right: Data + Answers -> Rules   (ML - highlighted as the new paradigm)
 *
 * Animated arrows draw in sequentially; the ML side receives
 * a subtle accent highlight.
 */

interface ParadigmShiftDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

/** Reusable rounded-rect box with label */
function AnimatedBox({
  x,
  y,
  width,
  height,
  label,
  fill,
  stroke,
  textColor,
  delay,
  isInView,
  fontSize = 12,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  fill: string;
  stroke: string;
  textColor: string;
  delay: number;
  isInView: boolean;
  fontSize?: number;
}) {
  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.25}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${x + width / 2}px ${y + height / 2}px` }}
      />
      <motion.text
        x={x + width / 2}
        y={y + height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textColor}
        fontSize={fontSize}
        fontWeight={500}
        fontFamily="var(--font-sans)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.15, ease: PRODUCTIVE_EASE }}
      >
        {label}
      </motion.text>
    </g>
  );
}

/** Animated arrow (horizontal) */
function AnimatedArrow({
  x1,
  y1,
  x2,
  y2,
  delay,
  isInView,
  color,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
  isInView: boolean;
  color: string;
}) {
  const headSize = 6;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const tipX = x2;
  const tipY = y2;
  const leftX = tipX - headSize * cos + (headSize * 0.5) * sin;
  const leftY = tipY - headSize * sin - (headSize * 0.5) * cos;
  const rightX = tipX - headSize * cos - (headSize * 0.5) * sin;
  const rightY = tipY - headSize * sin + (headSize * 0.5) * cos;

  return (
    <g>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
      />
      <motion.polygon
        points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
        fill={color}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.35, ease: PRODUCTIVE_EASE }}
      />
    </g>
  );
}

/** "+" symbol between two boxes */
function PlusSymbol({
  x,
  y,
  delay,
  isInView,
  color,
}: {
  x: number;
  y: number;
  delay: number;
  isInView: boolean;
  color: string;
}) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill={color}
      fontSize={16}
      fontWeight={300}
      fontFamily="var(--font-sans)"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4, delay, ease: PRODUCTIVE_EASE }}
    >
      +
    </motion.text>
  );
}

export default function ParadigmShiftDiagram({
  className = '',
}: ParadigmShiftDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  /* Layout constants */
  const boxW = 90;
  const boxH = 36;
  const gap = 14;
  const arrowLen = 30;

  /* ── Left panel: Classical Programming ── */
  const leftPanelX = 16;
  const panelY = 60;

  const rulesX = leftPanelX + 10;
  const rulesY = panelY + 20;

  const plusLeftX = rulesX + boxW + gap;
  const plusLeftY = rulesY + boxH / 2;

  const dataLeftX = plusLeftX + gap;
  const dataLeftY = rulesY;

  const arrowLeftStartX = dataLeftX + boxW + 12;
  const arrowLeftY = rulesY + boxH / 2;
  const arrowLeftEndX = arrowLeftStartX + arrowLen;

  const answersLeftX = arrowLeftEndX + 8;
  const answersLeftY = rulesY;

  /* ── Right panel: Machine Learning ── */
  const rightPanelX = 400;
  const dataRightX = rightPanelX + 10;
  const dataRightY = panelY + 20;

  const plusRightX = dataRightX + boxW + gap;
  const plusRightY = dataRightY + boxH / 2;

  const answersRightX = plusRightX + gap;
  const answersRightY = dataRightY;

  const arrowRightStartX = answersRightX + boxW + 12;
  const arrowRightY = dataRightY + boxH / 2;
  const arrowRightEndX = arrowRightStartX + arrowLen;

  const rulesRightX = arrowRightEndX + 8;
  const rulesRightY = dataRightY;

  const totalWidth = rulesRightX + boxW + 26;

  /* Subtle accent glow rect behind ML panel */
  const mlPanelW = rulesRightX + boxW + 16 - rightPanelX;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${totalWidth} 140`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Paradigm shift diagram comparing Classical Programming to Machine Learning"
      className={className}
      style={{ width: '100%', height: 'auto' }}
    >
      {/* ── Panel titles ── */}
      <motion.text
        x={leftPanelX + 10}
        y={panelY + 4}
        fill="var(--color-text-tertiary)"
        fontSize={11}
        fontWeight={500}
        fontFamily="var(--font-sans)"
        letterSpacing="0.05em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: PRODUCTIVE_EASE }}
      >
        CLASSICAL PROGRAMMING
      </motion.text>

      <motion.text
        x={rightPanelX + 10}
        y={panelY + 4}
        fill="var(--color-accent)"
        fontSize={11}
        fontWeight={600}
        fontFamily="var(--font-sans)"
        letterSpacing="0.05em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        MACHINE LEARNING
      </motion.text>

      {/* ── ML highlight background ── */}
      <motion.rect
        x={rightPanelX}
        y={panelY - 10}
        width={mlPanelW}
        height={80}
        rx={8}
        fill="var(--color-accent-subtle)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Divider line ── */}
      <motion.line
        x1={rightPanelX - 16}
        y1={panelY - 10}
        x2={rightPanelX - 16}
        y2={panelY + 70}
        stroke="var(--color-border-primary)"
        strokeWidth={1}
        strokeDasharray="4 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          isInView
            ? { pathLength: 1, opacity: 0.5 }
            : { pathLength: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
      />

      {/* ══════════ Left panel (Classical) ══════════ */}
      <AnimatedBox
        x={rulesX}
        y={rulesY}
        width={boxW}
        height={boxH}
        label="Rules"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        textColor="var(--color-text-primary)"
        delay={0.15}
        isInView={isInView}
      />

      <PlusSymbol
        x={plusLeftX}
        y={plusLeftY}
        delay={0.25}
        isInView={isInView}
        color="var(--color-text-tertiary)"
      />

      <AnimatedBox
        x={dataLeftX}
        y={dataLeftY}
        width={boxW}
        height={boxH}
        label="Data"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        textColor="var(--color-text-primary)"
        delay={0.3}
        isInView={isInView}
      />

      <AnimatedArrow
        x1={arrowLeftStartX}
        y1={arrowLeftY}
        x2={arrowLeftEndX}
        y2={arrowLeftY}
        delay={0.4}
        isInView={isInView}
        color="var(--color-text-tertiary)"
      />

      <AnimatedBox
        x={answersLeftX}
        y={answersLeftY}
        width={boxW}
        height={boxH}
        label="Answers"
        fill="var(--color-bg-secondary)"
        stroke="var(--color-border-primary)"
        textColor="var(--color-text-secondary)"
        delay={0.55}
        isInView={isInView}
      />

      {/* ══════════ Right panel (ML) ══════════ */}
      <AnimatedBox
        x={dataRightX}
        y={dataRightY}
        width={boxW}
        height={boxH}
        label="Data"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        textColor="var(--color-text-primary)"
        delay={0.85}
        isInView={isInView}
      />

      <PlusSymbol
        x={plusRightX}
        y={plusRightY}
        delay={0.95}
        isInView={isInView}
        color="var(--color-accent)"
      />

      <AnimatedBox
        x={answersRightX}
        y={answersRightY}
        width={boxW}
        height={boxH}
        label="Answers"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-accent)"
        textColor="var(--color-text-primary)"
        delay={1.0}
        isInView={isInView}
      />

      <AnimatedArrow
        x1={arrowRightStartX}
        y1={arrowRightY}
        x2={arrowRightEndX}
        y2={arrowRightY}
        delay={1.1}
        isInView={isInView}
        color="var(--color-accent)"
      />

      <AnimatedBox
        x={rulesRightX}
        y={rulesRightY}
        width={boxW}
        height={boxH}
        label="Rules"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        textColor="var(--color-accent)"
        delay={1.25}
        isInView={isInView}
        fontSize={13}
      />
    </svg>
  );
}
