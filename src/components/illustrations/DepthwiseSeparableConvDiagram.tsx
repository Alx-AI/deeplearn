'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DepthwiseSeparableConvDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function DepthwiseSeparableConvDiagram({
  className = '',
}: DepthwiseSeparableConvDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  /* ── layout constants ─────────────────────────────────── */
  const panelW = 130;
  const panelH = 90;
  const panelY = 38;
  const panelRx = 6;

  // Panel 1 – Standard Conv2D
  const p1x = 14;
  // Panel 2 – Depthwise Conv
  const p2x = 220;
  // Panel 3 – Pointwise Conv
  const p3x = 386;

  // Channel strip dimensions (for depthwise visual)
  const stripW = 28;
  const stripH = 40;
  const stripGap = 6;

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 280"
      role="img"
      aria-label="Depthwise separable convolution diagram showing how standard convolution factorizes into depthwise and pointwise steps with approximately 8 times fewer parameters"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrow-dsc"
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
        <marker
          id="arrow-dsc-accent"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>

      {/* ═══════════════════════════════════════════════════
          PANEL 1 – Standard Conv2D
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel heading */}
        <text
          x={p1x + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Standard Conv2D
        </text>

        {/* Panel box */}
        <rect
          x={p1x}
          y={panelY}
          width={panelW}
          height={panelH}
          rx={panelRx}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />

        {/* Single operation block inside */}
        <rect
          x={p1x + 15}
          y={panelY + 15}
          width={panelW - 30}
          height={panelH - 30}
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />

        {/* Grid lines suggesting spatial + channel mixing */}
        {[0, 1, 2].map((i) => (
          <line
            key={`std-h-${i}`}
            x1={p1x + 20}
            y1={panelY + 28 + i * 14}
            x2={p1x + panelW - 20}
            y2={panelY + 28 + i * 14}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            opacity="0.35"
          />
        ))}
        {[0, 1, 2].map((i) => (
          <line
            key={`std-v-${i}`}
            x1={p1x + 35 + i * 22}
            y1={panelY + 18}
            x2={p1x + 35 + i * 22}
            y2={panelY + panelH - 18}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            opacity="0.35"
          />
        ))}

        <text
          x={p1x + panelW / 2}
          y={panelY + panelH / 2 + 4}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Spatial + Channel
        </text>

        {/* Sub-label */}
        <text
          x={p1x + panelW / 2}
          y={panelY + panelH + 16}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          {'3\u00d73\u00d7C filters, all channels at once'}
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          FACTORIZE ARROW  (Panel 1 → Panels 2 + 3)
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: PRODUCTIVE_EASE }}
      >
        {/* Horizontal stem */}
        <line
          x1={p1x + panelW + 8}
          y1={panelY + panelH / 2}
          x2={p1x + panelW + 32}
          y2={panelY + panelH / 2}
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        {/* Upper branch to Panel 2 */}
        <line
          x1={p1x + panelW + 32}
          y1={panelY + panelH / 2}
          x2={p2x - 8}
          y2={panelY + panelH / 2}
          stroke="var(--color-accent)"
          strokeWidth="2"
          markerEnd="url(#arrow-dsc-accent)"
        />

        {/* "Factorize" label */}
        <text
          x={(p1x + panelW + 8 + p2x - 8) / 2}
          y={panelY + panelH / 2 - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          Factorize
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          PANEL 2 – Depthwise Conv
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel heading */}
        <text
          x={p2x + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Depthwise Conv
        </text>

        {/* Panel box */}
        <rect
          x={p2x}
          y={panelY}
          width={panelW}
          height={panelH}
          rx={panelRx}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />

        {/* Parallel independent channel strips */}
        {[0, 1, 2].map((ch) => {
          const sx = p2x + 16 + ch * (stripW + stripGap);
          const sy = panelY + (panelH - stripH) / 2;
          return (
            <motion.g
              key={`dw-ch-${ch}`}
              initial={{ opacity: 0, y: 8 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
              }
              transition={{
                duration: 0.4,
                delay: 0.65 + ch * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <rect
                x={sx}
                y={sy}
                width={stripW}
                height={stripH}
                rx="3"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
              {/* 3x3 grid inside each strip */}
              {[0, 1, 2].map((r) =>
                [0, 1, 2].map((c) => (
                  <rect
                    key={`dw-${ch}-${r}-${c}`}
                    x={sx + 3 + c * 7.5}
                    y={sy + 5 + r * 9.5}
                    width="6"
                    height="8"
                    rx="1"
                    fill="var(--color-accent)"
                    opacity={0.25 + ((r + c) % 3) * 0.15}
                  />
                ))
              )}
              {/* Channel label */}
              <text
                x={sx + stripW / 2}
                y={sy + stripH - 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="var(--color-accent)"
              >
                {`Ch ${ch + 1}`}
              </text>
            </motion.g>
          );
        })}

        {/* Sub-label */}
        <text
          x={p2x + panelW / 2}
          y={panelY + panelH + 16}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          {'3\u00d73\u00d71 per channel'}
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          ARROW  Panel 2 → Panel 3
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <line
          x1={p2x + panelW + 8}
          y1={panelY + panelH / 2}
          x2={p3x - 8}
          y2={panelY + panelH / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrow-dsc)"
        />
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          PANEL 3 – Pointwise Conv (1x1)
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel heading */}
        <text
          x={p3x + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Pointwise Conv
        </text>

        {/* Panel box */}
        <rect
          x={p3x}
          y={panelY}
          width={panelW}
          height={panelH}
          rx={panelRx}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />

        {/* 1x1 mixing visual: converging lines from left channels into single output */}
        {/* Input channel dots on left side */}
        {[0, 1, 2].map((ch) => {
          const cy = panelY + 22 + ch * 22;
          return (
            <motion.g
              key={`pw-in-${ch}`}
              initial={{ opacity: 0, x: -6 }}
              animate={
                isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }
              }
              transition={{
                duration: 0.4,
                delay: 1.15 + ch * 0.08,
                ease: PRODUCTIVE_EASE,
              }}
            >
              <circle
                cx={p3x + 22}
                cy={cy}
                r="6"
                fill="var(--color-accent-subtle)"
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
              <text
                x={p3x + 22}
                y={cy + 3}
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="var(--color-accent)"
              >
                {ch + 1}
              </text>
              {/* Converging line to output */}
              <line
                x1={p3x + 30}
                y1={cy}
                x2={p3x + panelW - 30}
                y2={panelY + panelH / 2}
                stroke="var(--color-accent)"
                strokeWidth="1"
                opacity="0.5"
              />
            </motion.g>
          );
        })}

        {/* Output mixed node */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            isInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.6 }
          }
          transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
        >
          <circle
            cx={p3x + panelW - 26}
            cy={panelY + panelH / 2}
            r="12"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text
            x={p3x + panelW - 26}
            y={panelY + panelH / 2 - 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="var(--color-accent)"
          >
            1x1
          </text>
          <text
            x={p3x + panelW - 26}
            y={panelY + panelH / 2 + 7}
            textAnchor="middle"
            fontSize="9"
            fontWeight="500"
            fill="var(--color-accent)"
          >
            mix
          </text>
        </motion.g>

        {/* Sub-label */}
        <text
          x={p3x + panelW / 2}
          y={panelY + panelH + 16}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-secondary)"
        >
          {'1\u00d71\u00d7C mixing channels'}
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          PARAMETER COMPARISON  (bottom section)
          ═══════════════════════════════════════════════════ */}

      {/* Divider line */}
      <motion.line
        x1="30"
        y1="170"
        x2="510"
        y2="170"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.5"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.5 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
      />

      {/* Standard param count */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="80"
          y="196"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Standard
        </text>
        <rect
          x="16"
          y="204"
          width="128"
          height="26"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="80"
          y="221"
          textAnchor="middle"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-text-secondary)"
          fontFamily="var(--font-mono, monospace)"
        >
          {`3\u00d73\u00d7C_in\u00d7C_out`}
        </text>
      </motion.g>

      {/* "vs" label */}
      <motion.text
        x="176"
        y="221"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.75, ease: PRODUCTIVE_EASE }}
      >
        vs
      </motion.text>

      {/* Separable param count */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
      >
        <text
          x="310"
          y="196"
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="var(--color-text-primary)"
        >
          Separable
        </text>
        <rect
          x="210"
          y="204"
          width="200"
          height="26"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <text
          x="310"
          y="221"
          textAnchor="middle"
          fontSize="10"
          fontWeight="500"
          fill="var(--color-accent)"
          fontFamily="var(--font-mono, monospace)"
        >
          {`3\u00d73\u00d7C_in + C_in\u00d7C_out`}
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          ~8x FEWER PARAMETERS annotation
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0, scale: 0.85 }}
        animate={
          isInView
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.85 }
        }
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="430"
          y="198"
          width="100"
          height="36"
          rx="18"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="480"
          y="213"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          {'~8\u00d7 fewer'}
        </text>
        <text
          x="480"
          y="226"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          parameters
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          STEP LABELS  (Step 1, Step 2 bracket)
          ═══════════════════════════════════════════════════ */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Step 1 label under depthwise panel */}
        <text
          x={p2x + panelW / 2}
          y={panelY + panelH + 30}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-text-tertiary)"
        >
          Step 1: Spatial filtering
        </text>

        {/* Step 2 label under pointwise panel */}
        <text
          x={p3x + panelW / 2}
          y={panelY + panelH + 30}
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-text-tertiary)"
        >
          Step 2: Channel mixing
        </text>
      </motion.g>

      {/* ═══════════════════════════════════════════════════
          BOTTOM EXPLANATION
          ═══════════════════════════════════════════════════ */}
      <motion.text
        x="270"
        y="264"
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        Depthwise separable convolutions decouple spatial and channel reasoning for efficiency
      </motion.text>
    </svg>
  );
}
