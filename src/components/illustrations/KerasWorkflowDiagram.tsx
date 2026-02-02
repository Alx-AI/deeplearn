'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface KerasWorkflowDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function KerasWorkflowDiagram({ className = '' }: KerasWorkflowDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      id: 1,
      title: 'Define',
      subtitle: 'Stack layers',
      icon: (
        <g>
          <rect x="14" y="12" width="32" height="6" rx="1" fill="currentColor" opacity="0.3" />
          <rect x="14" y="21" width="32" height="6" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="14" y="30" width="32" height="6" rx="1" fill="currentColor" />
        </g>
      ),
    },
    {
      id: 2,
      title: 'Compile',
      subtitle: 'Set optimizer',
      icon: (
        <g>
          <circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M30 18 L35 24 L30 30 L25 24 Z" fill="currentColor" />
          <circle cx="30" cy="24" r="3" fill="currentColor" />
        </g>
      ),
    },
    {
      id: 3,
      title: 'Fit',
      subtitle: 'Train on data',
      icon: (
        <g>
          <path d="M15 35 L20 28 L25 32 L30 20 L35 26 L40 18 L45 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="38" width="32" height="2" fill="currentColor" opacity="0.3" />
        </g>
      ),
    },
    {
      id: 4,
      title: 'Predict',
      subtitle: 'Make predictions',
      icon: (
        <g>
          <path d="M20 24 L28 32 L42 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ),
      highlight: true,
    },
  ];

  return (
    <svg
      ref={ref}
      viewBox="0 0 545 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Keras workflow diagram showing four steps: Define, Compile, Fit, and Predict"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-keras-workflow"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path
            d="M1 1 L7 4 L1 7"
            fill="none"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Connecting arrows */}
      {steps.slice(0, -1).map((step, index) => {
        const x1 = 30 + index * 134 + 110;
        const x2 = 30 + (index + 1) * 134;
        const y = 80;

        return (
          <motion.line
            key={`arrow-${step.id}`}
            x1={x1}
            y1={y}
            x2={x2}
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            strokeDasharray="4 4"
            markerEnd="url(#arrowhead-keras-workflow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
            transition={{
              duration: 0.6,
              delay: 0.3 + index * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          />
        );
      })}

      {/* Steps */}
      {steps.map((step, index) => {
        const x = 30 + index * 134;
        const y = 30;

        return (
          <motion.g
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Step box */}
            <rect
              x={x}
              y={y}
              width="110"
              height="90"
              rx="8"
              fill="var(--color-bg-elevated)"
              stroke={step.highlight ? 'var(--color-accent)' : 'var(--color-border-primary)'}
              strokeWidth={step.highlight ? '2' : '1'}
            />

            {/* Number badge */}
            <circle
              cx={x + 14}
              cy={y + 14}
              r="10"
              fill={step.highlight ? 'var(--color-accent)' : 'var(--color-accent-subtle)'}
            />
            <text
              x={x + 14}
              y={y + 14}
              textAnchor="middle"
              dominantBaseline="central"
              fill={step.highlight ? 'var(--color-bg-primary)' : 'var(--color-accent)'}
              fontSize="11"
              fontWeight="600"
            >
              {step.id}
            </text>

            {/* Icon */}
            <g
              transform={`translate(${x + 25}, ${y + 25})`}
              color={step.highlight ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
            >
              {step.icon}
            </g>

            {/* Title */}
            <text
              x={x + 55}
              y={y + 70}
              textAnchor="middle"
              fill={step.highlight ? 'var(--color-accent)' : 'var(--color-text-primary)'}
              fontSize="14"
              fontWeight="600"
            >
              {step.title}
            </text>

            {/* Subtitle */}
            <text
              x={x + 55}
              y={y + 86}
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="11"
            >
              {step.subtitle}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
