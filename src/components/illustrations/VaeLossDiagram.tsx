'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface VaeLossDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function VaeLossDiagram({ className }: VaeLossDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ------------------------------------------------------------------ */
  /* Timing helpers -- pipeline animates left-to-right, then annotations */
  /* ------------------------------------------------------------------ */
  const t = {
    input: 0.15,
    arrowToEncoder: 0.35,
    encoder: 0.5,
    arrowToParams: 0.7,
    params: 0.85,
    arrowToSample: 1.0,
    sample: 1.1,
    arrowToDecoder: 1.25,
    decoder: 1.4,
    arrowToOutput: 1.55,
    output: 1.7,
    /* loss annotations fade in after pipeline */
    reconLoss: 2.1,
    klDiv: 2.4,
    balance: 2.7,
    totalLoss: 3.0,
  }

  return (
    <div className={className} ref={ref as React.RefObject<HTMLDivElement>}>
      <svg
        viewBox="0 0 540 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="VAE loss function diagram showing reconstruction loss and KL divergence components"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {/* ======================== DEFS ======================== */}
        <defs>
          <marker
            id="arrowhead-vae-loss"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 7 3.5, 0 7"
              fill="var(--color-text-tertiary)"
            />
          </marker>
          <marker
            id="arrowhead-vae-loss-accent"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 7 3.5, 0 7"
              fill="var(--color-accent)"
            />
          </marker>
          <marker
            id="arrowhead-vae-loss-warn"
            markerWidth="7"
            markerHeight="7"
            refX="5"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 7 3.5, 0 7"
              fill="var(--color-text-secondary)"
            />
          </marker>
          {/* Double-headed marker (reverse) for reconstruction loss */}
          <marker
            id="arrowhead-vae-loss-rev"
            markerWidth="7"
            markerHeight="7"
            refX="2"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="7 0, 0 3.5, 7 7"
              fill="var(--color-accent)"
            />
          </marker>
        </defs>

        {/* ============================================================ */}
        {/* PIPELINE ROW -- y centre ~ 72                                */}
        {/* ============================================================ */}

        {/* --- Input Image --- */}
        <motion.g
          initial={{ opacity: 0, x: -14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: t.input, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="14" y="48" width="44" height="44" rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Grid lines to indicate image pixels */}
          <line x1="25" y1="48" x2="25" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="36" y1="48" x2="36" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="47" y1="48" x2="47" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="14" y1="59" x2="58" y2="59" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="14" y1="70" x2="58" y2="70" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="14" y1="81" x2="58" y2="81" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <text x="36" y="107" fontSize="9" fill="var(--color-text-secondary)" textAnchor="middle" fontWeight="500">
            Input x
          </text>
        </motion.g>

        {/* --- Arrow: Input -> Encoder --- */}
        <motion.path
          d="M 62 70 L 82 70"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-loss)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: t.arrowToEncoder, ease: PRODUCTIVE_EASE }}
        />

        {/* --- Encoder trapezoid --- */}
        <motion.g
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: t.encoder, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: '112px 70px' }}
        >
          <path
            d="M 86 44 L 138 54 L 138 86 L 86 96 Z"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text x="112" y="74" fontSize="11" fill="var(--color-text-primary)" textAnchor="middle" fontWeight="600">
            Encoder
          </text>
        </motion.g>

        {/* --- Arrow: Encoder -> Params --- */}
        <motion.path
          d="M 142 70 L 162 70"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-loss)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: t.arrowToParams, ease: PRODUCTIVE_EASE }}
        />

        {/* --- z_mean, z_log_var parameters --- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: t.params, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: '194px 70px' }}
        >
          {/* z_mean box */}
          <rect
            x="166" y="46" width="56" height="19" rx="3"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <text x="194" y="59" fontSize="9" fill="var(--color-accent)" textAnchor="middle" fontWeight="600">
            z_mean
          </text>
          {/* z_log_var box */}
          <rect
            x="166" y="72" width="56" height="19" rx="3"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1"
          />
          <text x="194" y="85" fontSize="9" fill="var(--color-accent)" textAnchor="middle" fontWeight="600">
            z_log_var
          </text>
        </motion.g>

        {/* --- Arrow: Params -> Sample z --- */}
        <motion.path
          d="M 226 70 L 246 70"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-loss)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: t.arrowToSample, ease: PRODUCTIVE_EASE }}
        />

        {/* --- Sample z (circle) --- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.45, delay: t.sample, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: '266px 70px' }}
        >
          <circle
            cx="266" cy="70" r="16"
            fill="var(--color-accent-subtle)"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
          <text x="266" y="74" fontSize="11" fill="var(--color-accent)" textAnchor="middle" fontWeight="700">
            z
          </text>
          <text x="266" y="107" fontSize="8" fill="var(--color-text-tertiary)" textAnchor="middle">
            Sample
          </text>
        </motion.g>

        {/* --- Arrow: Sample z -> Decoder --- */}
        <motion.path
          d="M 286 70 L 306 70"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-loss)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.35, delay: t.arrowToDecoder, ease: PRODUCTIVE_EASE }}
        />

        {/* --- Decoder trapezoid (widening) --- */}
        <motion.g
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: t.decoder, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: '336px 70px' }}
        >
          <path
            d="M 310 54 L 362 44 L 362 96 L 310 86 Z"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          <text x="336" y="74" fontSize="11" fill="var(--color-text-primary)" textAnchor="middle" fontWeight="600">
            Decoder
          </text>
        </motion.g>

        {/* --- Arrow: Decoder -> Output --- */}
        <motion.path
          d="M 366 70 L 386 70"
          stroke="var(--color-text-tertiary)"
          strokeWidth="1.5"
          fill="none"
          markerEnd="url(#arrowhead-vae-loss)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: t.arrowToOutput, ease: PRODUCTIVE_EASE }}
        />

        {/* --- Reconstructed Image --- */}
        <motion.g
          initial={{ opacity: 0, x: 14 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: t.output, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="390" y="48" width="44" height="44" rx="3"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />
          {/* Grid lines (slightly offset to suggest "different" from input) */}
          <line x1="401" y1="48" x2="401" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="412" y1="48" x2="412" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="423" y1="48" x2="423" y2="92" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="390" y1="59" x2="434" y2="59" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="390" y1="70" x2="434" y2="70" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          <line x1="390" y1="81" x2="434" y2="81" stroke="var(--color-text-tertiary)" strokeWidth="0.5" opacity="0.3" />
          {/* Subtle tilde overlay to indicate "reconstruction" */}
          <text x="412" y="74" fontSize="18" fill="var(--color-text-tertiary)" textAnchor="middle" opacity="0.2" fontWeight="300">
            ~
          </text>
          <text x="412" y="107" fontSize="9" fill="var(--color-text-secondary)" textAnchor="middle" fontWeight="500">
            Output x&#x0302;
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* LOSS ANNOTATION 1 -- Reconstruction Loss (below pipeline)    */}
        {/* ============================================================ */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: t.reconLoss, ease: PRODUCTIVE_EASE }}
        >
          {/* Double-headed arrow from input to output at y=134 */}
          <line
            x1="36" y1="134" x2="412" y2="134"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-vae-loss-accent)"
            markerStart="url(#arrowhead-vae-loss-rev)"
          />
          {/* Vertical ticks connecting to images */}
          <line x1="36" y1="114" x2="36" y2="134" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
          <line x1="412" y1="114" x2="412" y2="134" stroke="var(--color-accent)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
          {/* Label */}
          <rect x="150" y="123" width="144" height="18" rx="3" fill="var(--color-bg-elevated)" />
          <text x="222" y="136" fontSize="10" fill="var(--color-accent)" textAnchor="middle" fontWeight="600">
            Reconstruction Loss
          </text>
          <text x="222" y="152" fontSize="8.5" fill="var(--color-text-tertiary)" textAnchor="middle" fontStyle="italic">
            &quot;How similar?&quot;
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* LOSS ANNOTATION 2 -- KL Divergence (above pipeline)          */}
        {/* ============================================================ */}
        <motion.g
          initial={{ opacity: 0, y: -10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: t.klDiv, ease: PRODUCTIVE_EASE }}
        >
          {/* Standard normal reference bubble */}
          <rect
            x="290" y="6" width="56" height="22" rx="4"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          <text x="318" y="21" fontSize="10" fill="var(--color-text-primary)" textAnchor="middle" fontWeight="600">
            N(0,1)
          </text>
          {/* Curved arrow from z circle up to N(0,1) */}
          <path
            d="M 266 53 Q 266 17, 290 17"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
            fill="none"
            markerEnd="url(#arrowhead-vae-loss-warn)"
          />
          {/* Label */}
          <text x="440" y="14" fontSize="10" fill="var(--color-text-secondary)" textAnchor="start" fontWeight="600">
            KL Divergence
          </text>
          <text x="440" y="28" fontSize="8.5" fill="var(--color-text-tertiary)" textAnchor="start" fontStyle="italic">
            &quot;How close to
          </text>
          <text x="440" y="39" fontSize="8.5" fill="var(--color-text-tertiary)" textAnchor="start" fontStyle="italic">
            standard normal?&quot;
          </text>
          {/* Thin connector line from N(0,1) box to KL label */}
          <line
            x1="346" y1="17" x2="437" y2="17"
            stroke="var(--color-text-tertiary)"
            strokeWidth="0.75"
            strokeDasharray="3 2"
            opacity="0.5"
          />
        </motion.g>

        {/* ============================================================ */}
        {/* BALANCE / SCALE ICON (bottom-left area)                      */}
        {/* ============================================================ */}
        <motion.g
          initial={{ opacity: 0, scale: 0.7 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.55, delay: t.balance, ease: PRODUCTIVE_EASE }}
          style={{ transformOrigin: '80px 208px' }}
        >
          {/* Pedestal */}
          <line x1="80" y1="218" x2="80" y2="228" stroke="var(--color-text-tertiary)" strokeWidth="1.5" />
          <line x1="68" y1="228" x2="92" y2="228" stroke="var(--color-text-tertiary)" strokeWidth="1.5" />
          {/* Balance beam */}
          <line x1="50" y1="210" x2="110" y2="210" stroke="var(--color-text-tertiary)" strokeWidth="1.5" />
          {/* Pivot */}
          <polygon points="76,218 84,218 80,212" fill="var(--color-text-tertiary)" />
          {/* Left pan (Reconstruction) */}
          <line x1="50" y1="210" x2="50" y2="218" stroke="var(--color-text-tertiary)" strokeWidth="1" />
          <rect x="40" y="218" width="20" height="3" rx="1" fill="var(--color-accent)" opacity="0.7" />
          {/* Right pan (Structure / KL) */}
          <line x1="110" y1="210" x2="110" y2="218" stroke="var(--color-text-tertiary)" strokeWidth="1" />
          <rect x="100" y="218" width="20" height="3" rx="1" fill="var(--color-text-secondary)" opacity="0.7" />
          {/* Labels under pans */}
          <text x="50" y="235" fontSize="7.5" fill="var(--color-accent)" textAnchor="middle" fontWeight="500">
            Recon.
          </text>
          <text x="110" y="235" fontSize="7.5" fill="var(--color-text-secondary)" textAnchor="middle" fontWeight="500">
            Structure
          </text>
          {/* Tradeoff label */}
          <text x="80" y="250" fontSize="8" fill="var(--color-text-tertiary)" textAnchor="middle">
            Reconstruction &#x2194; Structure
          </text>
        </motion.g>

        {/* ============================================================ */}
        {/* TOTAL LOSS EQUATION (bottom-right)                           */}
        {/* ============================================================ */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: t.totalLoss, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="190" y="170" width="300" height="30" rx="5"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
          />
          {/* Total loss text rendered as a short formula */}
          <text x="200" y="190" fontSize="11" fill="var(--color-text-primary)" fontWeight="700">
            Total Loss
          </text>
          <text x="274" y="190" fontSize="11" fill="var(--color-text-tertiary)">
            =
          </text>
          <text x="288" y="190" fontSize="11" fill="var(--color-accent)" fontWeight="600">
            Reconstruction
          </text>
          <text x="382" y="190" fontSize="11" fill="var(--color-text-tertiary)">
            +
          </text>
          <text x="397" y="190" fontSize="11" fill="var(--color-text-secondary)" fontWeight="600">
            &#x03B2;
          </text>
          <text x="410" y="190" fontSize="11" fill="var(--color-text-tertiary)">
            &#xD7;
          </text>
          <text x="424" y="190" fontSize="11" fill="var(--color-text-secondary)" fontWeight="600">
            KL
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
