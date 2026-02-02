'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DataAugmentationDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function DataAugmentationDiagram({
  className = '',
}: DataAugmentationDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <svg
      ref={ref}
      viewBox="0 0 460 200"
      role="img"
      aria-label="Data augmentation showing one original image transformed into multiple training examples through rotation, flipping, cropping, and color shifting"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        {/* Arrow marker for dashed lines */}
        <marker
          id="arrowhead-data-augmentation"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>

        {/* Pattern for the original cross/plus shape */}
        <g id="cross-pattern">
          <rect
            x="18"
            y="8"
            width="14"
            height="34"
            fill="var(--color-accent)"
          />
          <rect
            x="8"
            y="18"
            width="34"
            height="14"
            fill="var(--color-accent)"
          />
        </g>
      </defs>

      {/* Title */}
      <motion.text
        x="230"
        y="20"
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        initial={{ opacity: 0, y: -10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        One image becomes many training examples
      </motion.text>

      {/* Original Image - Center Left */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE, delay: 0.2 }}
      >
        {/* Original image container */}
        <rect
          x="50"
          y="75"
          width="50"
          height="50"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
          rx="4"
        />
        {/* Cross pattern */}
        <use href="#cross-pattern" x="50" y="75" />

        {/* Label */}
        <text
          x="75"
          y="145"
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="11"
          fontWeight="500"
        >
          Original
        </text>
      </motion.g>

      {/* Arrow 1 - to Rotate */}
      <motion.line
        x1="110"
        y1="85"
        x2="185"
        y2="65"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrowhead-data-augmentation)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.5 }}
      />

      {/* Arrow 2 - to Flip */}
      <motion.line
        x1="110"
        y1="100"
        x2="185"
        y2="100"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrowhead-data-augmentation)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.6 }}
      />

      {/* Arrow 3 - to Crop */}
      <motion.line
        x1="110"
        y1="115"
        x2="280"
        y2="100"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrowhead-data-augmentation)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.7 }}
      />

      {/* Arrow 4 - to Shift */}
      <motion.line
        x1="110"
        y1="115"
        x2="360"
        y2="85"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrowhead-data-augmentation)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.8 }}
      />

      {/* Variant 1 - Rotate */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 0.9 }}
      >
        <rect
          x="190"
          y="40"
          width="50"
          height="50"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="4"
        />
        {/* Rotated cross (45 degrees) */}
        <g transform="translate(215, 65) rotate(45)">
          <rect
            x="-7"
            y="-17"
            width="14"
            height="34"
            fill="var(--color-accent)"
            opacity="0.9"
          />
          <rect
            x="-17"
            y="-7"
            width="34"
            height="14"
            fill="var(--color-accent)"
            opacity="0.9"
          />
        </g>
        <text
          x="215"
          y="105"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
        >
          Rotate
        </text>
      </motion.g>

      {/* Variant 2 - Flip */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 1.0 }}
      >
        <rect
          x="190"
          y="115"
          width="50"
          height="50"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="4"
        />
        {/* Flipped cross (horizontal flip via scale) */}
        <g transform="translate(240, 140) scale(-1, 1)">
          <rect
            x="18"
            y="8"
            width="14"
            height="34"
            fill="var(--color-accent)"
            opacity="0.9"
          />
          <rect
            x="8"
            y="18"
            width="34"
            height="14"
            fill="var(--color-accent)"
            opacity="0.9"
          />
        </g>
        <text
          x="215"
          y="180"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
        >
          Flip
        </text>
      </motion.g>

      {/* Variant 3 - Crop/Zoom */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 1.1 }}
      >
        <rect
          x="285"
          y="75"
          width="50"
          height="50"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="4"
        />
        {/* Cropped/zoomed cross (scaled up and translated) */}
        <g transform="translate(310, 100) scale(1.3)">
          <rect
            x="5"
            y="-5"
            width="14"
            height="34"
            fill="var(--color-accent)"
            opacity="0.9"
          />
          <rect
            x="-5"
            y="5"
            width="34"
            height="14"
            fill="var(--color-accent)"
            opacity="0.9"
          />
        </g>
        <text
          x="310"
          y="140"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
        >
          Crop
        </text>
      </motion.g>

      {/* Variant 4 - Color Shift */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE, delay: 1.2 }}
      >
        <rect
          x="365"
          y="60"
          width="50"
          height="50"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
          rx="4"
        />
        {/* Color-shifted cross (different opacity/color) */}
        <g transform="translate(365, 60)">
          <rect
            x="18"
            y="8"
            width="14"
            height="34"
            fill="var(--color-accent)"
            opacity="0.5"
          />
          <rect
            x="8"
            y="18"
            width="34"
            height="14"
            fill="var(--color-accent)"
            opacity="0.5"
          />
          {/* Add a subtle overlay to suggest color shift */}
          <rect
            x="0"
            y="0"
            width="50"
            height="50"
            fill="var(--color-accent-subtle)"
            opacity="0.2"
            rx="4"
          />
        </g>
        <text
          x="390"
          y="125"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
        >
          Shift
        </text>
      </motion.g>
    </svg>
  );
}
