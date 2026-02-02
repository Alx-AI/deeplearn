'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface EncoderDecoderDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function EncoderDecoderDiagram({ className }: EncoderDecoderDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Encoder blocks configuration (left side - downsampling)
  const encoderBlocks = [
    { x: 40, y: 40, width: 60, height: 40, channels: '64' },
    { x: 40, y: 100, width: 50, height: 50, channels: '128' },
    { x: 40, y: 170, width: 40, height: 60, channels: '256' },
  ]

  // Bottleneck (smallest, center bottom)
  const bottleneck = { x: 210, y: 185, width: 60, height: 70, channels: '512' }

  // Decoder blocks configuration (right side - upsampling)
  const decoderBlocks = [
    { x: 380, y: 170, width: 40, height: 60, channels: '256' },
    { x: 380, y: 100, width: 50, height: 50, channels: '128' },
    { x: 380, y: 40, width: 60, height: 40, channels: '64' },
  ]

  // Skip connections (from encoder to decoder)
  const skipConnections = [
    { x1: 100, y1: 60, x2: 380, y2: 200 },
    { x1: 90, y1: 125, x2: 380, y2: 125 },
    { x1: 80, y1: 200, x2: 380, y2: 60 },
  ]

  return (
    <svg
      ref={ref}
      viewBox="0 0 480 270"
      role="img"
      aria-label="Encoder-Decoder U-Net Architecture Diagram showing symmetric downsampling and upsampling paths with skip connections"
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-down"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 6 3, 0 6"
            fill="var(--color-text-tertiary)"
          />
        </marker>
        <marker
          id="arrowhead-up"
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

      {/* Encoder Label */}
      <motion.text
        x="70"
        y="25"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
      >
        Encoder
      </motion.text>

      {/* Decoder Label */}
      <motion.text
        x="410"
        y="25"
        fill="var(--color-text-primary)"
        fontSize="14"
        fontWeight="600"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
      >
        Decoder
      </motion.text>

      {/* Encoder Blocks */}
      {encoderBlocks.map((block, i) => (
        <g key={`encoder-${i}`}>
          <motion.rect
            x={block.x}
            y={block.y}
            width={block.width}
            height={block.height}
            fill={i === 0 ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)'}
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            rx="4"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15, ease: PRODUCTIVE_EASE }}
            style={{ transformOrigin: `${block.x + block.width / 2}px ${block.y}px` }}
          />
          <motion.text
            x={block.x + block.width / 2}
            y={block.y + block.height / 2 + 5}
            fill="var(--color-text-secondary)"
            fontSize="11"
            textAnchor="middle"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.15, ease: PRODUCTIVE_EASE }}
          >
            {block.channels}
          </motion.text>

          {/* Downsampling arrows */}
          {i < encoderBlocks.length - 1 && (
            <motion.line
              x1={block.x + block.width / 2}
              y1={block.y + block.height}
              x2={encoderBlocks[i + 1].x + encoderBlocks[i + 1].width / 2}
              y2={encoderBlocks[i + 1].y}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead-down)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.15, ease: PRODUCTIVE_EASE }}
            />
          )}
        </g>
      ))}

      {/* Arrow from last encoder to bottleneck */}
      <motion.line
        x1={encoderBlocks[2].x + encoderBlocks[2].width / 2}
        y1={encoderBlocks[2].y + encoderBlocks[2].height}
        x2={bottleneck.x}
        y2={bottleneck.y + bottleneck.height / 2}
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-down)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.8, ease: PRODUCTIVE_EASE }}
      />

      {/* Bottleneck Block */}
      <motion.rect
        x={bottleneck.x}
        y={bottleneck.y}
        width={bottleneck.width}
        height={bottleneck.height}
        fill="var(--color-accent)"
        fillOpacity="0.15"
        stroke="var(--color-accent)"
        strokeWidth="2"
        rx="4"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
        style={{ transformOrigin: `${bottleneck.x + bottleneck.width / 2}px ${bottleneck.y + bottleneck.height / 2}px` }}
      />
      <motion.text
        x={bottleneck.x + bottleneck.width / 2}
        y={bottleneck.y + bottleneck.height / 2 + 5}
        fill="var(--color-accent)"
        fontSize="11"
        fontWeight="600"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {bottleneck.channels}
      </motion.text>

      {/* Arrow from bottleneck to first decoder */}
      <motion.line
        x1={bottleneck.x + bottleneck.width}
        y1={bottleneck.y + bottleneck.height / 2}
        x2={decoderBlocks[0].x + decoderBlocks[0].width / 2}
        y2={decoderBlocks[0].y + decoderBlocks[0].height}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-up)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Decoder Blocks */}
      {decoderBlocks.map((block, i) => (
        <g key={`decoder-${i}`}>
          <motion.rect
            x={block.x}
            y={block.y}
            width={block.width}
            height={block.height}
            fill="var(--color-accent-subtle)"
            stroke="var(--color-border-primary)"
            strokeWidth="2"
            rx="4"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.2 + i * 0.15, ease: PRODUCTIVE_EASE }}
            style={{ transformOrigin: `${block.x + block.width / 2}px ${block.y + block.height}px` }}
          />
          <motion.text
            x={block.x + block.width / 2}
            y={block.y + block.height / 2 + 5}
            fill="var(--color-text-secondary)"
            fontSize="11"
            textAnchor="middle"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 1.3 + i * 0.15, ease: PRODUCTIVE_EASE }}
          >
            {block.channels}
          </motion.text>

          {/* Upsampling arrows */}
          {i < decoderBlocks.length - 1 && (
            <motion.line
              x1={block.x + block.width / 2}
              y1={block.y}
              x2={decoderBlocks[i + 1].x + decoderBlocks[i + 1].width / 2}
              y2={decoderBlocks[i + 1].y + decoderBlocks[i + 1].height}
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead-up)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: 1.4 + i * 0.15, ease: PRODUCTIVE_EASE }}
            />
          )}
        </g>
      ))}

      {/* Skip Connections */}
      {skipConnections.map((conn, i) => (
        <g key={`skip-${i}`}>
          <motion.line
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.8 + i * 0.1, ease: PRODUCTIVE_EASE }}
          />
        </g>
      ))}

      {/* Skip Connection Label */}
      <motion.text
        x="240"
        y="125"
        fill="var(--color-accent)"
        fontSize="10"
        textAnchor="middle"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 2.1, ease: PRODUCTIVE_EASE }}
      >
        Skip connections
      </motion.text>

      {/* Dimension indicators */}
      <motion.text
        x="20"
        y="130"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.7, ease: PRODUCTIVE_EASE }}
        transform="rotate(-90, 20, 130)"
      >
        Downsample
      </motion.text>

      <motion.text
        x="460"
        y="130"
        fill="var(--color-text-tertiary)"
        fontSize="9"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
        transform="rotate(-90, 460, 130)"
      >
        Upsample
      </motion.text>
    </svg>
  )
}
