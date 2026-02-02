'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RegularizationDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function RegularizationDiagram({
  className = '',
}: RegularizationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Define network structure
  const layers = [
    { x: 30, nodes: [40, 80, 120, 160] },
    { x: 80, nodes: [50, 90, 130, 170] },
    { x: 130, nodes: [60, 100, 140] },
  ];

  // Nodes to dropout (random selection)
  const droppedNodes = [
    { layer: 0, node: 1 },
    { layer: 1, node: 2 },
    { layer: 2, node: 1 },
  ];

  // Check if a node is dropped
  const isDropped = (layerIdx: number, nodeIdx: number) => {
    return droppedNodes.some(
      (d) => d.layer === layerIdx && d.node === nodeIdx
    );
  };

  // Check if a connection should be dropped
  const isConnectionDropped = (
    fromLayer: number,
    fromNode: number,
    toLayer: number,
    toNode: number
  ) => {
    return isDropped(fromLayer, fromNode) || isDropped(toLayer, toNode);
  };

  // Weight decay visualization - before/after weights
  const weightConnections = [
    { x1: 280, y1: 60, x2: 320, y2: 70, beforeWidth: 4, afterWidth: 1.5 },
    { x1: 280, y1: 80, x2: 320, y2: 90, beforeWidth: 2, afterWidth: 1.5 },
    { x1: 280, y1: 100, x2: 320, y2: 110, beforeWidth: 5, afterWidth: 1.5 },
    { x1: 280, y1: 120, x2: 320, y2: 70, beforeWidth: 3, afterWidth: 1.5 },
    { x1: 280, y1: 140, x2: 320, y2: 90, beforeWidth: 1.5, afterWidth: 1.5 },
    { x1: 320, y1: 70, x2: 360, y2: 100, beforeWidth: 4.5, afterWidth: 1.5 },
    { x1: 320, y1: 90, x2: 360, y2: 100, beforeWidth: 2.5, afterWidth: 1.5 },
    { x1: 320, y1: 110, x2: 360, y2: 100, beforeWidth: 3.5, afterWidth: 1.5 },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 260"
      className={className}
      role="img"
      aria-label="Regularization techniques comparison: dropout vs weight decay"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-regularization"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-tertiary)"
            opacity="0.4"
          />
        </marker>
      </defs>

      {/* Left Panel - Dropout */}
      <g>
        {/* Panel Title */}
        <text
          x="85"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="700"
        >
          Dropout
        </text>

        {/* Subtitle */}
        <text
          x="85"
          y="200"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          Randomly disable neurons
        </text>
        <text
          x="85"
          y="212"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          during training
        </text>

        {/* Neural Network Connections */}
        {layers.slice(0, -1).map((layer, layerIdx) =>
          layer.nodes.map((fromY, fromNodeIdx) =>
            layers[layerIdx + 1].nodes.map((toY, toNodeIdx) => {
              const dropped = isConnectionDropped(
                layerIdx,
                fromNodeIdx,
                layerIdx + 1,
                toNodeIdx
              );
              return (
                <motion.line
                  key={`conn-${layerIdx}-${fromNodeIdx}-${toNodeIdx}`}
                  x1={layer.x}
                  y1={fromY}
                  x2={layers[layerIdx + 1].x}
                  y2={toY}
                  stroke="var(--color-text-tertiary)"
                  strokeWidth="1"
                  opacity={dropped ? 0.1 : 0.3}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { pathLength: 1, opacity: dropped ? 0.1 : 0.3 }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: PRODUCTIVE_EASE,
                  }}
                />
              );
            })
          )
        )}

        {/* Neural Network Nodes */}
        {layers.map((layer, layerIdx) =>
          layer.nodes.map((y, nodeIdx) => {
            const dropped = isDropped(layerIdx, nodeIdx);
            return (
              <g key={`node-${layerIdx}-${nodeIdx}`}>
                <motion.circle
                  cx={layer.x}
                  cy={y}
                  r="6"
                  fill={dropped ? 'var(--color-bg-tertiary)' : 'var(--color-accent)'}
                  stroke={dropped ? 'var(--color-border-primary)' : 'var(--color-accent)'}
                  strokeWidth="1.5"
                  opacity={dropped ? 0.3 : 1}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={
                    isInView
                      ? { scale: 1, opacity: dropped ? 0.3 : 1 }
                      : {}
                  }
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + layerIdx * 0.1,
                    ease: PRODUCTIVE_EASE,
                  }}
                />
                {/* X mark for dropped nodes */}
                {dropped && (
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: 0.8,
                      ease: PRODUCTIVE_EASE,
                    }}
                  >
                    <line
                      x1={layer.x - 4}
                      y1={y - 4}
                      x2={layer.x + 4}
                      y2={y + 4}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={layer.x + 4}
                      y1={y - 4}
                      x2={layer.x - 4}
                      y2={y + 4}
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </motion.g>
                )}
              </g>
            );
          })
        )}
      </g>

      {/* Divider */}
      <motion.line
        x1="200"
        y1="30"
        x2="200"
        y2="185"
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="4 4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : {}}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Right Panel - Weight Decay */}
      <g>
        {/* Panel Title */}
        <text
          x="340"
          y="20"
          textAnchor="middle"
          fill="var(--color-text-primary)"
          fontSize="14"
          fontWeight="700"
        >
          Weight Decay
        </text>

        {/* Subtitle */}
        <text
          x="340"
          y="206"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
        >
          Push weights toward zero
        </text>

        {/* Before label */}
        <text
          x="245"
          y="45"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          Before
        </text>

        {/* After label */}
        <text
          x="385"
          y="45"
          fill="var(--color-text-tertiary)"
          fontSize="9"
        >
          After
        </text>

        {/* Arrow indicating transformation */}
        <motion.line
          x1="320"
          y1="180"
          x2="360"
          y2="180"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          markerEnd="url(#arrowhead-regularization)"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 0.6, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.9, ease: PRODUCTIVE_EASE }}
        />

        {/* Before connections (thick, varying widths) */}
        {weightConnections.map((conn, idx) => (
          <motion.line
            key={`before-${idx}`}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="var(--color-text-tertiary)"
            strokeWidth={conn.beforeWidth}
            opacity="0.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.4 + idx * 0.05,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* After connections (thin, uniform widths) */}
        {weightConnections.map((conn, idx) => (
          <motion.line
            key={`after-${idx}`}
            x1={conn.x1 + 100}
            y1={conn.y1}
            x2={conn.x2 + 100}
            y2={conn.y2}
            stroke="var(--color-accent)"
            strokeWidth={conn.afterWidth}
            opacity="0.7"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0, strokeWidth: conn.beforeWidth }}
            animate={
              isInView
                ? {
                    pathLength: 1,
                    opacity: 0.7,
                    strokeWidth: conn.afterWidth,
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              delay: 0.8 + idx * 0.05,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Input nodes (before) */}
        {[60, 80, 100, 120, 140].map((y, idx) => (
          <motion.circle
            key={`input-before-${idx}`}
            cx="270"
            cy={y}
            r="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.5,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Hidden nodes (before) */}
        {[70, 90, 110].map((y, idx) => (
          <motion.circle
            key={`hidden-before-${idx}`}
            cx="320"
            cy={y}
            r="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.6,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Output node (before) */}
        <motion.circle
          cx="360"
          cy="100"
          r="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: 0.7,
            ease: PRODUCTIVE_EASE,
          }}
        />

        {/* Input nodes (after) */}
        {[60, 80, 100, 120, 140].map((y, idx) => (
          <motion.circle
            key={`input-after-${idx}`}
            cx="370"
            cy={y}
            r="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.9,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Hidden nodes (after) */}
        {[70, 90, 110].map((y, idx) => (
          <motion.circle
            key={`hidden-after-${idx}`}
            cx="420"
            cy={y}
            r="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 1.0,
              ease: PRODUCTIVE_EASE,
            }}
          />
        ))}

        {/* Output node (after) */}
        <motion.circle
          cx="460"
          cy="100"
          r="4"
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: 1.1,
            ease: PRODUCTIVE_EASE,
          }}
        />
      </g>
    </svg>
  );
}
