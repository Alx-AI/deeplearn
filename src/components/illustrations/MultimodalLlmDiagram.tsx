'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface MultimodalLlmDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function MultimodalLlmDiagram({
  className = '',
}: MultimodalLlmDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg
      ref={ref}
      viewBox="0 0 520 280"
      className={className}
      role="img"
      aria-label="Multimodal LLM diagram showing image and text inputs processed through a vision encoder and text tokenizer, merged into an LLM decoder that produces text output"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-multimodal"
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
          id="arrowhead-multimodal-accent"
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

      {/* ===== IMAGE PATH (top row) ===== */}

      {/* Image Input */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        {/* Thumbnail frame */}
        <rect
          x="10"
          y="30"
          width="52"
          height="42"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        {/* Simple image icon: mountain + sun */}
        <circle cx="26" cy="44" r="4" fill="var(--color-text-tertiary)" opacity="0.5" />
        <polygon
          points="16,64 36,48 46,58 56,46 56,64"
          fill="var(--color-text-tertiary)"
          opacity="0.35"
        />
        <text
          x="36"
          y="86"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          Image
        </text>
      </motion.g>

      {/* Arrow: Image -> Vision Encoder */}
      <motion.line
        x1="62"
        y1="51"
        x2="96"
        y2="51"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* Vision Encoder Box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.5, delay: 0.4, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="100"
          y="30"
          width="90"
          height="42"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="145"
          y="47"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Vision
        </text>
        <text
          x="145"
          y="62"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Encoder
        </text>
      </motion.g>

      {/* Arrow: Vision Encoder -> Image Embeddings */}
      <motion.line
        x1="190"
        y1="51"
        x2="222"
        y2="51"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.65, ease: PRODUCTIVE_EASE }}
      />

      {/* Image Embeddings */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, delay: 0.75, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="226"
          y="34"
          width="68"
          height="34"
          rx="4"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Mini bar chart to represent embedding vector */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const heights = [14, 22, 10, 18, 24, 12, 20, 16]
          return (
            <rect
              key={`img-emb-${i}`}
              x={232 + i * 7.5}
              y={62 - heights[i]}
              width="4"
              height={heights[i]}
              rx="1"
              fill="var(--color-accent)"
              opacity="0.6"
            />
          )
        })}
        <text
          x="260"
          y="82"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Image embeddings
        </text>
      </motion.g>

      {/* ===== TEXT PATH (bottom row) ===== */}

      {/* Text Input */}
      <motion.g
        initial={{ opacity: 0, x: -16 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
        transition={{ duration: 0.5, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="10"
          y="170"
          width="52"
          height="42"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="36"
          y="186"
          textAnchor="middle"
          fontSize="9"
          fontStyle="italic"
          fill="var(--color-text-secondary)"
        >
          What&apos;s in
        </text>
        <text
          x="36"
          y="197"
          textAnchor="middle"
          fontSize="9"
          fontStyle="italic"
          fill="var(--color-text-secondary)"
        >
          this image?
        </text>
        <text
          x="36"
          y="226"
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary)"
        >
          Text
        </text>
      </motion.g>

      {/* Arrow: Text -> Text Tokenizer */}
      <motion.line
        x1="62"
        y1="191"
        x2="96"
        y2="191"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.45, ease: PRODUCTIVE_EASE }}
      />

      {/* Text Tokenizer Box */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.5, delay: 0.55, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="100"
          y="170"
          width="90"
          height="42"
          rx="6"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth="1.5"
        />
        <text
          x="145"
          y="187"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Text
        </text>
        <text
          x="145"
          y="202"
          textAnchor="middle"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-text-primary)"
        >
          Tokenizer
        </text>
      </motion.g>

      {/* Arrow: Text Tokenizer -> Text Embeddings */}
      <motion.line
        x1="190"
        y1="191"
        x2="222"
        y2="191"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.35, delay: 0.8, ease: PRODUCTIVE_EASE }}
      />

      {/* Text Embeddings */}
      <motion.g
        initial={{ opacity: 0, scale: 0.92 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.45, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="226"
          y="174"
          width="68"
          height="34"
          rx="4"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Mini bar chart for text embedding vector */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const heights = [18, 10, 20, 14, 8, 22, 12, 16]
          return (
            <rect
              key={`txt-emb-${i}`}
              x={232 + i * 7.5}
              y={202 - heights[i]}
              width="4"
              height={heights[i]}
              rx="1"
              fill="var(--color-accent)"
              opacity="0.6"
            />
          )
        })}
        <text
          x="260"
          y="222"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Text embeddings
        </text>
      </motion.g>

      {/* ===== MERGE / CONCATENATION ===== */}

      {/* Diagonal arrow: Image embeddings -> merge point */}
      <motion.line
        x1="294"
        y1="60"
        x2="328"
        y2="110"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal-accent)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.05, ease: PRODUCTIVE_EASE }}
      />

      {/* Diagonal arrow: Text embeddings -> merge point */}
      <motion.line
        x1="294"
        y1="182"
        x2="328"
        y2="132"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal-accent)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      />

      {/* Merge circle */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
      >
        <circle
          cx="336"
          cy="121"
          r="12"
          fill="var(--color-accent)"
          fillOpacity="0.15"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        {/* Concatenate symbol */}
        <text
          x="336"
          y="126"
          textAnchor="middle"
          fontSize="14"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          +
        </text>
        <text
          x="336"
          y="147"
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          Concat
        </text>
      </motion.g>

      {/* Arrow: Merge -> LLM Decoder */}
      <motion.line
        x1="348"
        y1="121"
        x2="372"
        y2="121"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal-accent)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.35, ease: PRODUCTIVE_EASE }}
      />

      {/* ===== LLM DECODER (central, prominent) ===== */}
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, delay: 1.45, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="376"
          y="93"
          width="74"
          height="56"
          rx="8"
          fill="var(--color-bg-elevated)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
        {/* Stacked transformer layers inside */}
        {[0, 1, 2].map((i) => (
          <rect
            key={`layer-${i}`}
            x="384"
            y={100 + i * 15}
            width="58"
            height="10"
            rx="2"
            fill="var(--color-accent)"
            fillOpacity={0.12 + i * 0.06}
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        ))}
        <text
          x="413"
          y="108"
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          fill="var(--color-accent)"
          opacity="0.7"
        >
          Transformer
        </text>
        <text
          x="413"
          y="156"
          textAnchor="middle"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-accent)"
        >
          LLM Decoder
        </text>
      </motion.g>

      {/* Arrow: LLM Decoder -> Output */}
      <motion.line
        x1="450"
        y1="121"
        x2="468"
        y2="121"
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-multimodal)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: 1.7, ease: PRODUCTIVE_EASE }}
      />

      {/* ===== TEXT OUTPUT ===== */}
      <motion.g
        initial={{ opacity: 0, x: 14 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 14 }}
        transition={{ duration: 0.5, delay: 1.85, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="472"
          y="101"
          width="42"
          height="40"
          rx="6"
          fill="var(--color-accent)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="493"
          y="117"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-bg-primary)"
        >
          Text
        </text>
        <text
          x="493"
          y="128"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="var(--color-bg-primary)"
        >
          Output
        </text>
        {/* Output text example */}
        <text
          x="493"
          y="155"
          textAnchor="middle"
          fontSize="9"
          fontStyle="italic"
          fill="var(--color-text-secondary)"
        >
          &quot;A cat sitting
        </text>
        <text
          x="493"
          y="164"
          textAnchor="middle"
          fontSize="9"
          fontStyle="italic"
          fill="var(--color-text-secondary)"
        >
          on a mat&quot;
        </text>
      </motion.g>

      {/* ===== ANNOTATION ===== */}
      <motion.text
        x="260"
        y="268"
        textAnchor="middle"
        fontSize="11"
        fontStyle="italic"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.1, ease: PRODUCTIVE_EASE }}
      >
        Single model handles multiple modalities
      </motion.text>
    </svg>
  )
}
