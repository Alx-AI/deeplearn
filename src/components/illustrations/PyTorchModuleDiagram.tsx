'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface PyTorchModuleDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function PyTorchModuleDiagram({ className }: PyTorchModuleDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 380 240"
      className={className}
      role="img"
      aria-label="PyTorch nn.Module pattern showing a neural network class with layers and forward pass flow"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Outer container box - MyModel */}
      <motion.g
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="40"
          y="20"
          width="300"
          height="200"
          rx="8"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        <text
          x="190"
          y="40"
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="600"
        >
          MyModel(nn.Module)
        </text>
      </motion.g>

      {/* Layer 1 */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.4, delay: 0.3, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="60"
          y="60"
          width="260"
          height="32"
          rx="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="70"
          y="78"
          fill="var(--color-text-primary)"
          fontSize="9"
          fontWeight="500"
        >
          self.layer1 = Linear(784, 128)
        </text>
      </motion.g>

      {/* ReLU label 1 */}
      <motion.text
        x="190"
        y="105"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        ReLU
      </motion.text>

      {/* Layer 2 */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="60"
          y="115"
          width="260"
          height="32"
          rx="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="70"
          y="133"
          fill="var(--color-text-primary)"
          fontSize="9"
          fontWeight="500"
        >
          self.layer2 = Linear(128, 64)
        </text>
      </motion.g>

      {/* ReLU label 2 */}
      <motion.text
        x="190"
        y="160"
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        ReLU
      </motion.text>

      {/* Layer 3 */}
      <motion.g
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="60"
          y="170"
          width="260"
          height="32"
          rx="4"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="70"
          y="188"
          fill="var(--color-text-primary)"
          fontSize="9"
          fontWeight="500"
        >
          self.layer3 = Linear(64, 10)
        </text>
      </motion.g>

      {/* Forward flow arrows */}
      <motion.g
        initial={{ opacity: 0, pathLength: 0 }}
        animate={isInView ? { opacity: 1, pathLength: 1 } : { opacity: 0, pathLength: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        {/* Arrow from top to layer 1 */}
        <motion.path
          d="M 30 50 L 30 76"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-pytorch-module)"
        />

        {/* Arrow from layer 1 to layer 2 */}
        <motion.path
          d="M 30 92 L 30 131"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-pytorch-module)"
        />

        {/* Arrow from layer 2 to layer 3 */}
        <motion.path
          d="M 30 147 L 30 186"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-pytorch-module)"
        />

        {/* Arrow from layer 3 onwards */}
        <motion.path
          d="M 30 202 L 30 215"
          stroke="var(--color-accent)"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead-pytorch-module)"
        />
      </motion.g>

      {/* Forward label */}
      <motion.text
        x="15"
        y="135"
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="9"
        fontWeight="500"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.1, ease: PRODUCTIVE_EASE }}
        transform="rotate(-90 15 135)"
      >
        forward()
      </motion.text>

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-pytorch-module"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-accent)"
          />
        </marker>
      </defs>
    </svg>
  );
}
