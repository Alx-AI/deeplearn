'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface VAELatentSpaceDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function VAELatentSpaceDiagram({ className }: VAELatentSpaceDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Latent space dots representing encoded images
  const latentDots = [
    { x: 250, y: 70, color: 'var(--color-accent)', opacity: 0.6, isHighlighted: false },
    { x: 265, y: 85, color: 'var(--color-accent)', opacity: 0.7, isHighlighted: false },
    { x: 245, y: 95, color: 'var(--color-accent)', opacity: 0.8, isHighlighted: false },
    { x: 270, y: 105, color: 'var(--color-accent)', opacity: 0.9, isHighlighted: false },
    { x: 255, y: 120, color: 'var(--color-accent)', opacity: 0.6, isHighlighted: false },
    { x: 260, y: 100, color: 'var(--color-accent)', opacity: 1.0, isHighlighted: true }, // Sampled point
    { x: 248, y: 110, color: 'var(--color-accent)', opacity: 0.7, isHighlighted: false },
    { x: 268, y: 90, color: 'var(--color-accent)', opacity: 0.8, isHighlighted: false },
  ]

  return (
    <div className={className} ref={ref}>
      <svg
        viewBox="0 0 520 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="VAE architecture diagram showing encoder, latent space, and decoder"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* Input Image */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="20"
            y="60"
            width="60"
            height="60"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Grid pattern for image */}
          <line x1="35" y1="60" x2="35" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="50" y1="60" x2="50" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="65" y1="60" x2="65" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="75" x2="80" y2="75" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="90" x2="80" y2="90" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="20" y1="105" x2="80" y2="105" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <text
            x="50"
            y="145"
            fontSize="11"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
            fontWeight="500"
          >
            Input
          </text>
        </motion.g>

        {/* Arrow: Input to Encoder */}
        <motion.path
          d="M 85 90 L 105 90"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-latent)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Encoder (tapered trapezoid narrowing to the right) */}
        <motion.g
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 110 55 L 180 70 L 180 110 L 110 125 Z"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="145"
            y="95"
            fontSize="12"
            fill="var(--color-text-primary)"
            textAnchor="middle"
            fontWeight="600"
          >
            Encoder
          </text>
        </motion.g>

        {/* Arrow: Encoder to Latent Space */}
        <motion.path
          d="M 185 90 L 215 90"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-latent)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Latent Space (compressed bottleneck) */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 1, ease: PRODUCTIVE_EASE }}
        >
          <ellipse
            cx="260"
            cy="95"
            rx="38"
            ry="50"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="2"
            opacity="0.2"
          />
          <rect
            x="222"
            y="60"
            width="76"
            height="70"
            rx="8"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Latent space dots */}
          {latentDots.map((dot, index) => (
            <motion.circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={dot.isHighlighted ? 4 : 2.5}
              fill={dot.color}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: dot.opacity, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: 1.2 + index * 0.05,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}

          {/* Highlighted sampled point ring */}
          <motion.circle
            cx="260"
            cy="100"
            r="8"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
          />

          <text
            x="260"
            y="155"
            fontSize="11"
            fill="var(--color-accent)"
            textAnchor="middle"
            fontWeight="600"
          >
            z ~ N(μ,σ)
          </text>
        </motion.g>

        {/* Arrow: Latent Space to Decoder */}
        <motion.path
          d="M 305 90 L 335 90"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-latent)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.8, ease: PRODUCTIVE_EASE }}
        />

        {/* Decoder (tapered trapezoid widening to the right) */}
        <motion.g
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 2, ease: PRODUCTIVE_EASE }}
        >
          <path
            d="M 340 70 L 410 55 L 410 125 L 340 110 Z"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text
            x="375"
            y="95"
            fontSize="12"
            fill="var(--color-text-primary)"
            textAnchor="middle"
            fontWeight="600"
          >
            Decoder
          </text>
        </motion.g>

        {/* Arrow: Decoder to Output */}
        <motion.path
          d="M 415 90 L 435 90"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-latent)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 2.3, ease: PRODUCTIVE_EASE }}
        />

        {/* Reconstructed Image */}
        <motion.g
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 2.5, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="440"
            y="60"
            width="60"
            height="60"
            rx="4"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Grid pattern for reconstructed image */}
          <line x1="455" y1="60" x2="455" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="470" y1="60" x2="470" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="485" y1="60" x2="485" y2="120" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="440" y1="75" x2="500" y2="75" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="440" y1="90" x2="500" y2="90" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="440" y1="105" x2="500" y2="105" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <text
            x="470"
            y="145"
            fontSize="11"
            fill="var(--color-text-secondary)"
            textAnchor="middle"
            fontWeight="500"
          >
            Output
          </text>
        </motion.g>

        {/* Title */}
        <motion.text
          x="260"
          y="25"
          fontSize="13"
          fill="var(--color-text-primary)"
          textAnchor="middle"
          fontWeight="700"
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: PRODUCTIVE_EASE }}
        >
          Variational Autoencoder (VAE)
        </motion.text>

        {/* Arrowhead marker definition */}
        <defs>
          <marker
            id="arrowhead-vae-latent"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 6 3, 0 6"
              fill="var(--color-text-tertiary)"
            />
          </marker>
        </defs>
      </svg>
    </div>
  )
}
