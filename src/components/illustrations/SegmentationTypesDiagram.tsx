'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SegmentationTypesDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

/** Layout for each of the three panels */
const PANEL_WIDTH = 150;
const PANEL_GAP = 30;
const PANEL_START_X = 15;
const SCENE_Y = 38;
const SCENE_WIDTH = 150;
const SCENE_HEIGHT = 110;

/** Scene object positions (relative to each panel's origin) */
const CIRCLE_1 = { cx: 50, cy: 60, r: 22 };
const CIRCLE_2 = { cx: 112, cy: 72, r: 18 };

function panelX(index: number): number {
  return PANEL_START_X + index * (PANEL_WIDTH + PANEL_GAP);
}

export default function SegmentationTypesDiagram({
  className = '',
}: SegmentationTypesDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const panels = [
    {
      title: 'Semantic',
      annotation: 'Class-level only',
      bgFill: 'var(--color-bg-elevated)',
      circle1Fill: 'var(--color-accent)',
      circle1Opacity: 0.85,
      circle2Fill: 'var(--color-accent)',
      circle2Opacity: 0.85,
    },
    {
      title: 'Instance',
      annotation: 'Individual objects',
      bgFill: 'var(--color-bg-elevated)',
      circle1Fill: 'var(--color-accent)',
      circle1Opacity: 0.9,
      circle2Fill: 'var(--color-accent)',
      circle2Opacity: 0.45,
    },
    {
      title: 'Panoptic',
      annotation: 'Classes + Instances',
      bgFill: 'var(--color-bg-tertiary)',
      circle1Fill: 'var(--color-accent)',
      circle1Opacity: 0.9,
      circle2Fill: 'var(--color-accent)',
      circle2Opacity: 0.45,
    },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 240"
      role="img"
      aria-label="Three types of image segmentation: semantic (class-level), instance (individual objects), and panoptic (classes plus instances combined)"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {panels.map((panel, idx) => {
        const px = panelX(idx);
        const baseDelay = idx * 0.3;

        return (
          <g key={panel.title}>
            {/* Panel title */}
            <motion.text
              x={px + SCENE_WIDTH / 2}
              y={24}
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fill="var(--color-text-primary)"
              initial={{ opacity: 0, y: -6 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -6 }
              }
              transition={{
                duration: 0.5,
                delay: baseDelay,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {panel.title}
            </motion.text>

            {/* Scene background rectangle */}
            <motion.rect
              x={px}
              y={SCENE_Y}
              width={SCENE_WIDTH}
              height={SCENE_HEIGHT}
              rx={6}
              fill={panel.bgFill}
              stroke="var(--color-border-primary)"
              strokeWidth="1.5"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.92 }
              }
              transition={{
                duration: 0.5,
                delay: baseDelay + 0.1,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${px + SCENE_WIDTH / 2}px ${SCENE_Y + SCENE_HEIGHT / 2}px`,
              }}
            />

            {/* Circle 1 (left object) */}
            <motion.circle
              cx={px + CIRCLE_1.cx}
              cy={SCENE_Y + CIRCLE_1.cy}
              r={CIRCLE_1.r}
              fill={panel.circle1Fill}
              opacity={panel.circle1Opacity}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isInView
                  ? { opacity: panel.circle1Opacity, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: 0.45,
                delay: baseDelay + 0.25,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${px + CIRCLE_1.cx}px ${SCENE_Y + CIRCLE_1.cy}px`,
              }}
            />

            {/* Circle 2 (right object) */}
            <motion.circle
              cx={px + CIRCLE_2.cx}
              cy={SCENE_Y + CIRCLE_2.cy}
              r={CIRCLE_2.r}
              fill={panel.circle2Fill}
              opacity={panel.circle2Opacity}
              stroke="var(--color-border-primary)"
              strokeWidth="1"
              initial={{ opacity: 0, scale: 0 }}
              animate={
                isInView
                  ? { opacity: panel.circle2Opacity, scale: 1 }
                  : { opacity: 0, scale: 0 }
              }
              transition={{
                duration: 0.45,
                delay: baseDelay + 0.35,
                ease: PRODUCTIVE_EASE,
              }}
              style={{
                transformOrigin: `${px + CIRCLE_2.cx}px ${SCENE_Y + CIRCLE_2.cy}px`,
              }}
            />

            {/* Small legend indicators beneath the scene */}
            {/* Circle 1 swatch */}
            <motion.circle
              cx={px + SCENE_WIDTH / 2 - 28}
              cy={SCENE_Y + SCENE_HEIGHT + 20}
              r={5}
              fill={panel.circle1Fill}
              opacity={panel.circle1Opacity}
              initial={{ opacity: 0 }}
              animate={
                isInView
                  ? { opacity: panel.circle1Opacity }
                  : { opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: baseDelay + 0.5,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Circle 2 swatch */}
            <motion.circle
              cx={px + SCENE_WIDTH / 2 - 12}
              cy={SCENE_Y + SCENE_HEIGHT + 20}
              r={5}
              fill={panel.circle2Fill}
              opacity={panel.circle2Opacity}
              initial={{ opacity: 0 }}
              animate={
                isInView
                  ? { opacity: panel.circle2Opacity }
                  : { opacity: 0 }
              }
              transition={{
                duration: 0.4,
                delay: baseDelay + 0.55,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Background swatch (only visible for panoptic) */}
            {idx === 2 && (
              <motion.rect
                x={px + SCENE_WIDTH / 2 + 2}
                y={SCENE_Y + SCENE_HEIGHT + 15}
                width={10}
                height={10}
                rx={2}
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border-primary)"
                strokeWidth="0.75"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: baseDelay + 0.6,
                  ease: PRODUCTIVE_EASE,
                }}
              />
            )}

            {/* Annotation text */}
            <motion.text
              x={px + SCENE_WIDTH / 2}
              y={SCENE_Y + SCENE_HEIGHT + 42}
              textAnchor="middle"
              fontSize="11"
              fontWeight="500"
              fill="var(--color-text-secondary)"
              initial={{ opacity: 0, y: 4 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 4 }
              }
              transition={{
                duration: 0.45,
                delay: baseDelay + 0.55,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {panel.annotation}
            </motion.text>
          </g>
        );
      })}

      {/* Dashed dividers between panels */}
      {[0, 1].map((i) => {
        const divX =
          panelX(i) + SCENE_WIDTH + PANEL_GAP / 2;
        return (
          <motion.line
            key={`divider-${i}`}
            x1={divX}
            y1={SCENE_Y - 8}
            x2={divX}
            y2={SCENE_Y + SCENE_HEIGHT + 48}
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.4 } : { opacity: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* Bottom summary line */}
      <motion.text
        x="270"
        y="228"
        textAnchor="middle"
        fontSize="11"
        fill="var(--color-text-tertiary)"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.1,
          ease: PRODUCTIVE_EASE,
        }}
      >
        Same scene, three segmentation strategies
      </motion.text>
    </svg>
  );
}
