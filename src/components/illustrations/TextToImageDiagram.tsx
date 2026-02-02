'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextToImageDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function TextToImageDiagram({ className }: TextToImageDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 500 200"
        role="img"
        aria-label="Text-to-Image generation pipeline showing text prompt being encoded and fed into diffusion model to generate image"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          {/* Gradient for output image */}
          <linearGradient id="sunsetGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--color-accent-subtle)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="sunsetGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-subtle)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          </linearGradient>

          {/* Arrow marker */}
          <marker
            id="arrowhead-text-to-image"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3, 0 6"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>

        {/* Text Prompt Box */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="10"
            y="20"
            width="110"
            height="50"
            rx="6"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="65"
            y="38"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-primary)"
            fontStyle="italic"
          >
            &ldquo;a sunset over
          </text>
          <text
            x="65"
            y="52"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-primary)"
            fontStyle="italic"
          >
            mountains&rdquo;
          </text>
          <text
            x="65"
            y="10"
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-secondary)"
            fontWeight="600"
          >
            Text Prompt
          </text>
        </motion.g>

        {/* Arrow: Prompt to Encoder */}
        <motion.line
          x1="120"
          y1="45"
          x2="145"
          y2="45"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-text-to-image)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Text Encoder */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="145"
            y="25"
            width="85"
            height="40"
            rx="8"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text
            x="187.5"
            y="42"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-primary)"
            fontWeight="600"
          >
            Text Encoder
          </text>
          <text
            x="187.5"
            y="54"
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-secondary)"
          >
            (CLIP-style)
          </text>
        </motion.g>

        {/* Text Embeddings (small boxes) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.8, ease: PRODUCTIVE_EASE }}
        >
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={240 + i * 12}
              y="38"
              width="8"
              height="14"
              rx="1.5"
              fill="var(--color-accent)"
              opacity={0.7 - i * 0.15}
            />
          ))}
        </motion.g>

        {/* Arrow: Encoder to Diffusion (with cross-attention label) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 275 45 L 290 45 L 290 100 L 305 100"
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead-text-to-image)"
          />
          <rect
            x="255"
            y="68"
            width="70"
            height="16"
            rx="3"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text
            x="290"
            y="79"
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-secondary)"
            fontWeight="500"
          >
            cross-attention
          </text>
        </motion.g>

        {/* Diffusion Model */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="305"
            y="75"
            width="100"
            height="55"
            rx="8"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />
          <text
            x="355"
            y="95"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-primary)"
            fontWeight="600"
          >
            Diffusion
          </text>
          <text
            x="355"
            y="107"
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-text-primary)"
            fontWeight="600"
          >
            Model
          </text>

          {/* Noise particles */}
          {[
            { x: 320, y: 118 },
            { x: 335, y: 115 },
            { x: 350, y: 119 },
            { x: 365, y: 116 },
            { x: 380, y: 118 },
            { x: 327, y: 122 },
            { x: 358, y: 123 },
            { x: 373, y: 121 },
          ].map((pos, i) => (
            <motion.circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="1.5"
              fill="var(--color-text-tertiary)"
              opacity={0.4}
              initial={{ scale: 0 }}
              animate={isInView ? { scale: [0, 1.2, 1] } : {}}
              transition={{
                duration: 0.4,
                delay: 1.4 + i * 0.05,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}
        </motion.g>

        {/* Arrow: Diffusion to Output */}
        <motion.line
          x1="405"
          y1="102"
          x2="425"
          y2="102"
          stroke="var(--color-text-tertiary)"
          strokeWidth="2"
          markerEnd="url(#arrowhead-text-to-image)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        />

        {/* Output Image */}
        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.8, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="425"
            y="65"
            width="65"
            height="65"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
          />

          {/* Generated image content - abstract sunset */}
          <g clipPath="url(#imageClip)">
            <defs>
              <clipPath id="imageClip">
                <rect x="427" y="67" width="61" height="61" rx="3" />
              </clipPath>
            </defs>

            {/* Sky layers */}
            <rect
              x="427"
              y="67"
              width="61"
              height="61"
              fill="url(#sunsetGradient1)"
            />
            <rect
              x="427"
              y="67"
              width="61"
              height="30"
              fill="url(#sunsetGradient2)"
            />

            {/* Mountain silhouettes */}
            <polygon
              points="427,115 445,95 460,110 475,100 488,115"
              fill="var(--color-text-primary)"
              opacity="0.3"
            />
            <polygon
              points="427,120 440,105 455,115 470,108 488,125"
              fill="var(--color-text-primary)"
              opacity="0.25"
            />

            {/* Sun circle */}
            <circle
              cx="465"
              cy="85"
              r="8"
              fill="var(--color-accent)"
              opacity="0.6"
            />
          </g>

          <text
            x="457.5"
            y="145"
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-secondary)"
            fontWeight="600"
          >
            Generated
          </text>
          <text
            x="457.5"
            y="157"
            textAnchor="middle"
            fontSize="10"
            fill="var(--color-text-secondary)"
            fontWeight="600"
          >
            Image
          </text>
        </motion.g>

        {/* Noise input to diffusion */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.3, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 355 165 L 355 135"
            stroke="var(--color-text-tertiary)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
            markerEnd="url(#arrowhead-text-to-image)"
          />
          <text
            x="355"
            y="170"
            textAnchor="middle"
            fontSize="9"
            fill="var(--color-text-tertiary)"
          >
            noise
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
