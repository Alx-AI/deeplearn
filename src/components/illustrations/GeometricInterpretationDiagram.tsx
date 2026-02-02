'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface GeometricInterpretationDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function GeometricInterpretationDiagram({
  className = '',
}: GeometricInterpretationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Panel layout constants
  const panelW = 150
  const panelH = 140
  const panelY = 30
  const gap = 20
  const panelStartX = (540 - (3 * panelW + 2 * gap)) / 2

  const panel1X = panelStartX
  const panel2X = panelStartX + panelW + gap
  const panel3X = panelStartX + 2 * (panelW + gap)

  // Coordinate system offsets within each panel
  const axisMargin = 25
  const originYOffset = panelH - axisMargin

  // ---- Panel 1: Addition (Translation) ----
  // Original points (relative to panel origin)
  const addOriginalPoints = [
    { x: 35, y: 55 },
    { x: 50, y: 40 },
    { x: 45, y: 70 },
    { x: 60, y: 50 },
    { x: 55, y: 65 },
  ]
  // Displacement vector
  const addDx = 40
  const addDy = -30
  const addTranslatedPoints = addOriginalPoints.map((p) => ({
    x: p.x + addDx,
    y: p.y + addDy,
  }))

  // ---- Panel 2: MatMul (Rotation + Scale) ----
  // Points positioned around origin (center of coordinate space)
  const matmulCx = panelW / 2
  const matmulCy = panelH / 2
  const matmulOriginalPoints = [
    { x: -25, y: -15 },
    { x: -15, y: -30 },
    { x: -30, y: -5 },
    { x: -10, y: -20 },
    { x: -20, y: -10 },
  ]
  // Apply rotation (~40 deg) + scale (1.3)
  const angle = (40 * Math.PI) / 180
  const scale = 1.3
  const cosA = Math.cos(angle) * scale
  const sinA = Math.sin(angle) * scale
  const matmulTransformedPoints = matmulOriginalPoints.map((p) => ({
    x: p.x * cosA - p.y * sinA,
    y: p.x * sinA + p.y * cosA,
  }))

  // ---- Panel 3: ReLU (Fold) ----
  // Points with some having negative x values (relative to axis origin in panel)
  const reluAxisX = 35
  const reluOriginalPoints = [
    { x: -20, y: 25 },
    { x: -15, y: 55 },
    { x: -25, y: 75 },
    { x: 15, y: 35 },
    { x: 30, y: 60 },
    { x: 45, y: 45 },
    { x: 50, y: 80 },
  ]
  // After ReLU: negative x values become 0
  const reluFoldedPoints = reluOriginalPoints.map((p) => ({
    x: Math.max(0, p.x),
    y: p.y,
  }))

  // Helper to render a set of dots
  function renderDots(
    points: { x: number; y: number }[],
    offsetX: number,
    offsetY: number,
    color: string,
    strokeColor: string,
    baseDelay: number,
    keyPrefix: string,
    r: number = 3.5
  ) {
    return points.map((p, i) => (
      <motion.circle
        key={`${keyPrefix}-${i}`}
        cx={offsetX + p.x}
        cy={offsetY + p.y}
        r={r}
        fill={color}
        stroke={strokeColor}
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{
          duration: 0.35,
          delay: baseDelay + i * 0.04,
          ease: PRODUCTIVE_EASE,
        }}
      />
    ))
  }

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 240"
      className={className}
      role="img"
      aria-label="Geometric interpretation of tensor operations: addition as translation, matrix multiply as rotation and scaling, ReLU as folding negative values onto the axis"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-geom-interp"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 8 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
        <marker
          id="arrowhead-geom-axis"
          markerWidth="6"
          markerHeight="5"
          refX="5"
          refY="2.5"
          orient="auto"
        >
          <polygon
            points="0 0, 6 2.5, 0 5"
            fill="var(--color-text-tertiary)"
          />
        </marker>
      </defs>

      {/* ================================================================ */}
      {/* Panel 1: Addition (Translation)                                  */}
      {/* ================================================================ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel title */}
        <text
          x={panel1X + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="600"
        >
          Addition (Translation)
        </text>

        {/* Panel border */}
        <rect
          x={panel1X}
          y={panelY}
          width={panelW}
          height={panelH}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Axes */}
        <line
          x1={panel1X + 10}
          y1={panelY + originYOffset}
          x2={panel1X + panelW - 8}
          y2={panelY + originYOffset}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />
        <line
          x1={panel1X + 10}
          y1={panelY + originYOffset}
          x2={panel1X + 10}
          y2={panelY + 8}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />
      </motion.g>

      {/* Original points (faded) */}
      {renderDots(
        addOriginalPoints,
        panel1X,
        panelY,
        'var(--color-text-tertiary)',
        'var(--color-text-tertiary)',
        0.3,
        'add-orig'
      )}

      {/* Translated points (accent) */}
      {renderDots(
        addTranslatedPoints,
        panel1X,
        panelY,
        'var(--color-accent)',
        'var(--color-accent)',
        0.55,
        'add-trans'
      )}

      {/* Displacement arrows from original to translated */}
      {addOriginalPoints.map((p, i) => (
        <motion.line
          key={`add-arrow-${i}`}
          x1={panel1X + p.x}
          y1={panelY + p.y}
          x2={panel1X + addTranslatedPoints[i].x}
          y2={panelY + addTranslatedPoints[i].y}
          stroke="var(--color-accent)"
          strokeWidth="0.8"
          strokeDasharray="3,2"
          opacity="0.5"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={
            isInView
              ? { opacity: 0.5, pathLength: 1 }
              : { opacity: 0, pathLength: 0 }
          }
          transition={{
            duration: 0.5,
            delay: 0.7 + i * 0.04,
            ease: PRODUCTIVE_EASE,
          }}
        />
      ))}

      {/* Bold displacement arrow showing the translation vector */}
      <motion.line
        x1={panel1X + 48}
        y1={panelY + 85}
        x2={panel1X + 48 + addDx}
        y2={panelY + 85 + addDy}
        stroke="var(--color-accent)"
        strokeWidth="2"
        markerEnd="url(#arrowhead-geom-interp)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={
          isInView
            ? { opacity: 1, pathLength: 1 }
            : { opacity: 0, pathLength: 0 }
        }
        transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
      />

      {/* + b label on displacement arrow */}
      <motion.text
        x={panel1X + 48 + addDx / 2 + 10}
        y={panelY + 85 + addDy / 2 + 2}
        textAnchor="start"
        fill="var(--color-accent)"
        fontSize="10"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        + b
      </motion.text>

      {/* ================================================================ */}
      {/* Panel 2: Matrix Multiply (Rotation + Scale)                      */}
      {/* ================================================================ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel title */}
        <text
          x={panel2X + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="600"
        >
          {'Matrix Multiply (Rot + Scale)'}
        </text>

        {/* Panel border */}
        <rect
          x={panel2X}
          y={panelY}
          width={panelW}
          height={panelH}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Cross-hair axes through center */}
        <line
          x1={panel2X + 10}
          y1={panelY + matmulCy}
          x2={panel2X + panelW - 8}
          y2={panelY + matmulCy}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />
        <line
          x1={panel2X + matmulCx}
          y1={panelY + panelH - 8}
          x2={panel2X + matmulCx}
          y2={panelY + 8}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />
      </motion.g>

      {/* Original points (faded) */}
      {renderDots(
        matmulOriginalPoints.map((p) => ({
          x: matmulCx + p.x,
          y: matmulCy + p.y,
        })),
        panel2X,
        panelY,
        'var(--color-text-tertiary)',
        'var(--color-text-tertiary)',
        0.4,
        'matmul-orig'
      )}

      {/* Transformed points (accent) */}
      {renderDots(
        matmulTransformedPoints.map((p) => ({
          x: matmulCx + p.x,
          y: matmulCy + p.y,
        })),
        panel2X,
        panelY,
        'var(--color-accent)',
        'var(--color-accent)',
        0.65,
        'matmul-trans'
      )}

      {/* Connection lines from original to transformed */}
      {matmulOriginalPoints.map((p, i) => {
        const tp = matmulTransformedPoints[i]
        return (
          <motion.line
            key={`matmul-arrow-${i}`}
            x1={panel2X + matmulCx + p.x}
            y1={panelY + matmulCy + p.y}
            x2={panel2X + matmulCx + tp.x}
            y2={panelY + matmulCy + tp.y}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            strokeDasharray="3,2"
            opacity="0.5"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={
              isInView
                ? { opacity: 0.5, pathLength: 1 }
                : { opacity: 0, pathLength: 0 }
            }
            transition={{
              duration: 0.5,
              delay: 0.8 + i * 0.04,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* Curved arrow showing rotation */}
      <motion.path
        d={`M ${panel2X + matmulCx + 10} ${panelY + matmulCy - 40} A 42 42 0 0 1 ${panel2X + matmulCx + 42} ${panelY + matmulCy - 14}`}
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-geom-interp)"
        initial={{ opacity: 0, pathLength: 0 }}
        animate={
          isInView
            ? { opacity: 0.7, pathLength: 1 }
            : { opacity: 0, pathLength: 0 }
        }
        transition={{ duration: 0.6, delay: 1.0, ease: PRODUCTIVE_EASE }}
      />

      {/* Wx label */}
      <motion.text
        x={panel2X + matmulCx + 38}
        y={panelY + matmulCy - 38}
        textAnchor="start"
        fill="var(--color-accent)"
        fontSize="10"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        Wx
      </motion.text>

      {/* ================================================================ */}
      {/* Panel 3: ReLU (Fold)                                             */}
      {/* ================================================================ */}
      <motion.g
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        {/* Panel title */}
        <text
          x={panel3X + panelW / 2}
          y={panelY - 10}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="600"
        >
          ReLU (Fold)
        </text>

        {/* Panel border */}
        <rect
          x={panel3X}
          y={panelY}
          width={panelW}
          height={panelH}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
          rx="4"
        />

        {/* Vertical axis at reluAxisX (the x=0 line) */}
        <line
          x1={panel3X + reluAxisX}
          y1={panelY + 8}
          x2={panel3X + reluAxisX}
          y2={panelY + panelH - 8}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />
        {/* Horizontal axis */}
        <line
          x1={panel3X + 8}
          y1={panelY + panelH - 20}
          x2={panel3X + panelW - 8}
          y2={panelY + panelH - 20}
          stroke="var(--color-text-tertiary)"
          strokeWidth="0.7"
          opacity="0.4"
          markerEnd="url(#arrowhead-geom-axis)"
        />

        {/* x=0 label */}
        <text
          x={panel3X + reluAxisX - 4}
          y={panelY + 16}
          textAnchor="end"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          opacity="0.6"
        >
          x=0
        </text>
      </motion.g>

      {/* Shaded region for negative x (gets "folded") */}
      <motion.rect
        x={panel3X + 1}
        y={panelY + 1}
        width={reluAxisX - 1}
        height={panelH - 2}
        fill="var(--color-accent)"
        opacity="0"
        rx="3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.06 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
      />

      {/* Original points (faded) */}
      {renderDots(
        reluOriginalPoints.map((p) => ({
          x: reluAxisX + p.x,
          y: p.y,
        })),
        panel3X,
        panelY,
        'var(--color-text-tertiary)',
        'var(--color-text-tertiary)',
        0.5,
        'relu-orig'
      )}

      {/* Folded points (accent) */}
      {renderDots(
        reluFoldedPoints.map((p) => ({
          x: reluAxisX + p.x,
          y: p.y,
        })),
        panel3X,
        panelY,
        'var(--color-accent)',
        'var(--color-accent)',
        0.75,
        'relu-fold'
      )}

      {/* Arrows from original to folded positions (only for negative-x points) */}
      {reluOriginalPoints.map((p, i) => {
        if (p.x >= 0) return null
        const fp = reluFoldedPoints[i]
        return (
          <motion.line
            key={`relu-arrow-${i}`}
            x1={panel3X + reluAxisX + p.x}
            y1={panelY + p.y}
            x2={panel3X + reluAxisX + fp.x}
            y2={panelY + fp.y}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="3,2"
            markerEnd="url(#arrowhead-geom-interp)"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={
              isInView
                ? { opacity: 0.6, pathLength: 1 }
                : { opacity: 0, pathLength: 0 }
            }
            transition={{
              duration: 0.5,
              delay: 0.95 + i * 0.06,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* "fold" label with arrow pointing to axis */}
      <motion.text
        x={panel3X + 14}
        y={panelY + panelH / 2 + 2}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontWeight="600"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        fold
      </motion.text>

      {/* ================================================================ */}
      {/* Bottom caption                                                   */}
      {/* ================================================================ */}
      <motion.text
        x="270"
        y="224"
        textAnchor="middle"
        fill="var(--color-text-tertiary)"
        fontSize="10"
        fontStyle="italic"
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 0.7, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
      >
        Neural networks compose these transforms to untangle data
      </motion.text>
    </svg>
  )
}
