'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface MLWorkflowDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function MLWorkflowDiagram({ className = '' }: MLWorkflowDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stages = [
    { id: 'define', label: 'Define Problem', x: 40, icon: 'target' },
    { id: 'collect', label: 'Collect Data', x: 150, icon: 'database' },
    { id: 'build', label: 'Build Model', x: 270, icon: 'layers' },
    { id: 'evaluate', label: 'Evaluate', x: 390, icon: 'chart' },
    { id: 'deploy', label: 'Deploy', x: 500, icon: 'rocket' },
  ];

  const renderIcon = (type: string, x: number, y: number) => {
    const iconProps = {
      stroke: 'var(--color-text-primary)',
      strokeWidth: 2,
      fill: 'none',
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    };

    switch (type) {
      case 'target':
        return (
          <g>
            <circle cx={x} cy={y} r="8" {...iconProps} />
            <circle cx={x} cy={y} r="4" {...iconProps} />
            <circle cx={x} cy={y} r="1.5" fill="var(--color-text-primary)" stroke="none" />
          </g>
        );
      case 'database':
        return (
          <g>
            <ellipse cx={x} cy={y - 6} rx="8" ry="3" {...iconProps} />
            <path d={`M ${x - 8} ${y - 6} L ${x - 8} ${y + 6}`} {...iconProps} />
            <path d={`M ${x + 8} ${y - 6} L ${x + 8} ${y + 6}`} {...iconProps} />
            <ellipse cx={x} cy={y + 6} rx="8" ry="3" {...iconProps} />
          </g>
        );
      case 'layers':
        return (
          <g>
            <rect x={x - 8} y={y - 6} width="16" height="4" rx="1" {...iconProps} />
            <rect x={x - 6} y={y} width="12" height="4" rx="1" {...iconProps} />
            <rect x={x - 4} y={y + 6} width="8" height="4" rx="1" {...iconProps} />
          </g>
        );
      case 'chart':
        return (
          <g>
            <path d={`M ${x - 8} ${y + 8} L ${x - 8} ${y - 8} L ${x + 8} ${y - 8}`} {...iconProps} />
            <path d={`M ${x - 6} ${y + 4} L ${x - 2} ${y} L ${x + 2} ${y + 2} L ${x + 6} ${y - 4}`} {...iconProps} />
          </g>
        );
      case 'rocket':
        return (
          <g>
            <path d={`M ${x} ${y - 8} L ${x + 4} ${y + 4} L ${x} ${y + 2} L ${x - 4} ${y + 4} Z`} {...iconProps} />
            <path d={`M ${x - 2} ${y + 4} L ${x - 3} ${y + 8}`} {...iconProps} />
            <path d={`M ${x + 2} ${y + 4} L ${x + 3} ${y + 8}`} {...iconProps} />
            <circle cx={x} cy={y - 2} r="1.5" fill="var(--color-text-primary)" stroke="none" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 180"
      className={className}
      role="img"
      aria-label="Machine Learning Workflow Diagram showing five stages: Define Problem, Collect Data, Build Model, Evaluate, and Deploy, with a feedback loop from Evaluate back to Build Model"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Forward connecting arrows */}
      {stages.slice(0, -1).map((stage, i) => {
        const nextStage = stages[i + 1];
        return (
          <motion.line
            key={`arrow-${stage.id}`}
            x1={stage.x + 20}
            y1={70}
            x2={nextStage.x - 20}
            y2={70}
            stroke="var(--color-border-primary)"
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: 0.6 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* Arrowheads for forward arrows */}
      {stages.slice(0, -1).map((stage, i) => {
        const nextStage = stages[i + 1];
        return (
          <motion.polygon
            key={`arrowhead-${stage.id}`}
            points={`${nextStage.x - 20},70 ${nextStage.x - 26},67 ${nextStage.x - 26},73`}
            fill="var(--color-border-primary)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.2,
              delay: 0.9 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* Feedback loop: curved dashed arrow from Evaluate back to Build */}
      <motion.path
        d="M 390 90 Q 330 130 270 90"
        stroke="var(--color-accent)"
        strokeWidth={2}
        strokeDasharray="4 4"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.8 } : {}}
        transition={{
          duration: 0.6,
          delay: 1.8,
          ease: PRODUCTIVE_EASE,
        }}
      />

      {/* Feedback arrow head */}
      <motion.polygon
        points="270,90 276,87 276,93"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : {}}
        transition={{
          duration: 0.2,
          delay: 2.2,
          ease: PRODUCTIVE_EASE,
        }}
      />

      {/* Feedback label */}
      <motion.text
        x={330}
        y={140}
        textAnchor="middle"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{
          duration: 0.4,
          delay: 2.3,
          ease: PRODUCTIVE_EASE,
        }}
      >
        Iterate
      </motion.text>

      {/* Stage nodes */}
      {stages.map((stage, i) => {
        const isDeployStage = stage.id === 'deploy';
        return (
          <g key={stage.id}>
            {/* Node circle */}
            <motion.circle
              cx={stage.x}
              cy={70}
              r={20}
              fill={isDeployStage ? 'var(--color-accent-subtle)' : 'var(--color-bg-elevated)'}
              stroke={isDeployStage ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              strokeWidth={2}
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.2 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            />

            {/* Icon */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: 0.4 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {renderIcon(stage.icon, stage.x, 70)}
            </motion.g>

            {/* Label */}
            <motion.text
              x={stage.x}
              y={105}
              textAnchor="middle"
              fontSize="10"
              fill={isDeployStage ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
              fontWeight={isDeployStage ? '600' : '500'}
              initial={{ opacity: 0, y: -5 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.4,
                delay: 0.5 + i * 0.15,
                ease: PRODUCTIVE_EASE,
              }}
            >
              {stage.label}
            </motion.text>
          </g>
        );
      })}
    </svg>
  );
}
