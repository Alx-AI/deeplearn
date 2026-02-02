'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface VisionTransformerPatchDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function VisionTransformerPatchDiagram({ className }: VisionTransformerPatchDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  /* ---------- Layout constants ---------- */
  const patchCount = 4
  const patchSize = 20
  const gridGap = 1
  const imageX = 18
  const imageY = 30
  const imageTotal = patchCount * patchSize + (patchCount - 1) * gridGap // 83

  // Flattened token columns
  const tokenColW = 8
  const tokenColH = 46
  const tokenStartX = 148
  const tokenStartY = 38
  const tokenGapX = 12

  // Transformer encoder block
  const encoderX = 360
  const encoderY = 22
  const encoderW = 160
  const encoderH = 130

  // Colour palette per patch row (used for both grid cells and token columns)
  const patchColors = [
    'var(--color-accent)',
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)',
  ]

  // Build patch data: 4x4 grid -> 16 patches
  const patches: { row: number; col: number; idx: number }[] = []
  for (let r = 0; r < patchCount; r++) {
    for (let c = 0; c < patchCount; c++) {
      patches.push({ row: r, col: c, idx: r * patchCount + c })
    }
  }

  // Token column positions (show first 5 + ellipsis + last)
  const visibleTokens = [0, 1, 2, 3, 4]
  const lastToken = 15

  const tokenX = (idx: number) => tokenStartX + idx * tokenGapX

  return (
    <svg
      ref={ref}
      viewBox="0 0 540 260"
      className={className}
      role="img"
      aria-label="Vision Transformer patch diagram showing an image split into a 4 by 4 grid of patches, linearly projected into token vectors, then fed into a Transformer encoder with positional embeddings"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-vit-patch"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 8 4, 0 8"
            fill="var(--color-accent)"
          />
        </marker>
        <marker
          id="arrowhead-vit-patch-subtle"
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
      </defs>

      {/* ====== SECTION 1: Image grid (left) ====== */}
      <motion.text
        x={imageX + imageTotal / 2}
        y={imageY - 14}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
      >
        Input Image
      </motion.text>

      {/* 4x4 patch grid */}
      {patches.map(({ row, col, idx }) => {
        const px = imageX + col * (patchSize + gridGap)
        const py = imageY + row * (patchSize + gridGap)
        return (
          <motion.rect
            key={`patch-${idx}`}
            x={px}
            y={py}
            width={patchSize}
            height={patchSize}
            rx="2"
            fill={patchColors[row]}
            fillOpacity={0.15 + col * 0.1}
            stroke={patchColors[row]}
            strokeWidth="1"
            strokeOpacity={0.6}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{
              duration: 0.35,
              delay: idx * 0.025,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* Grid dimension annotation */}
      <motion.text
        x={imageX + imageTotal / 2}
        y={imageY + imageTotal + 14}
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        4 x 4 patches
      </motion.text>

      {/* ====== Arrow: Image -> Tokens ====== */}
      <motion.line
        x1={imageX + imageTotal + 8}
        y1={imageY + imageTotal / 2}
        x2={tokenStartX - 12}
        y2={imageY + imageTotal / 2}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-vit-patch)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x={(imageX + imageTotal + tokenStartX) / 2 - 2}
        y={imageY + imageTotal / 2 - 8}
        textAnchor="middle"
        fontSize="9"
        fontWeight="500"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.6, ease: PRODUCTIVE_EASE }}
      >
        Flatten
      </motion.text>

      {/* ====== SECTION 2: Token columns (middle) ====== */}
      <motion.text
        x={tokenStartX + 2.5 * tokenGapX}
        y={tokenStartY - 12}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: PRODUCTIVE_EASE }}
      >
        Patch Tokens
      </motion.text>

      {/* Visible token columns */}
      {visibleTokens.map((tIdx, i) => {
        const cx = tokenX(i)
        const rowColor = patchColors[Math.floor(tIdx / patchCount)]
        return (
          <motion.g
            key={`token-${tIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{
              duration: 0.4,
              delay: 0.55 + i * 0.06,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <rect
              x={cx}
              y={tokenStartY}
              width={tokenColW}
              height={tokenColH}
              rx="2"
              fill={rowColor}
              fillOpacity="0.2"
              stroke={rowColor}
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            {/* Small horizontal lines inside to suggest vector elements */}
            {[0.2, 0.4, 0.6, 0.8].map((frac, li) => (
              <line
                key={li}
                x1={cx + 2}
                y1={tokenStartY + tokenColH * frac}
                x2={cx + tokenColW - 2}
                y2={tokenStartY + tokenColH * frac}
                stroke={rowColor}
                strokeWidth="0.5"
                strokeOpacity="0.4"
              />
            ))}
            {/* Token index label */}
            <text
              x={cx + tokenColW / 2}
              y={tokenStartY + tokenColH + 10}
              textAnchor="middle"
              fontSize="9"
              fill="var(--color-text-tertiary)"
            >
              {tIdx + 1}
            </text>
          </motion.g>
        )
      })}

      {/* Ellipsis */}
      <motion.text
        x={tokenX(5) + tokenColW / 2}
        y={tokenStartY + tokenColH / 2 + 2}
        textAnchor="middle"
        fontSize="10"
        fill="var(--color-text-tertiary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: 0.9, ease: PRODUCTIVE_EASE }}
      >
        ...
      </motion.text>

      {/* Last token (16) */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, delay: 0.95, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={tokenX(6)}
          y={tokenStartY}
          width={tokenColW}
          height={tokenColH}
          rx="2"
          fill={patchColors[3]}
          fillOpacity="0.2"
          stroke={patchColors[3]}
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        {[0.2, 0.4, 0.6, 0.8].map((frac, li) => (
          <line
            key={li}
            x1={tokenX(6) + 2}
            y1={tokenStartY + tokenColH * frac}
            x2={tokenX(6) + tokenColW - 2}
            y2={tokenStartY + tokenColH * frac}
            stroke={patchColors[3]}
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        ))}
        <text
          x={tokenX(6) + tokenColW / 2}
          y={tokenStartY + tokenColH + 10}
          textAnchor="middle"
          fontSize="9"
          fill="var(--color-text-tertiary)"
        >
          {lastToken + 1}
        </text>
      </motion.g>

      {/* Positional Embeddings annotation */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
      >
        {/* "+" circles above select tokens */}
        {[0, 2, 4, 6].map((tI, idx) => {
          const cx = tokenX(tI) + tokenColW / 2
          return (
            <g key={`pos-${idx}`}>
              <circle
                cx={cx}
                cy={tokenStartY + tokenColH + 22}
                r="5"
                fill="var(--color-bg-elevated)"
                stroke="var(--color-accent)"
                strokeWidth="1"
              />
              <text
                x={cx}
                y={tokenStartY + tokenColH + 25}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="var(--color-accent)"
              >
                +
              </text>
            </g>
          )
        })}
        <text
          x={tokenStartX + 3 * tokenGapX}
          y={tokenStartY + tokenColH + 38}
          textAnchor="middle"
          fontSize="9"
          fontWeight="500"
          fill="var(--color-accent)"
        >
          + Positional Embeddings
        </text>
      </motion.g>

      {/* ====== Arrow: Tokens -> Encoder (Linear Projection) ====== */}
      <motion.line
        x1={tokenX(6) + tokenColW + 14}
        y1={imageY + imageTotal / 2}
        x2={encoderX - 6}
        y2={imageY + imageTotal / 2}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-vit-patch)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 1.05, ease: PRODUCTIVE_EASE }}
      />

      <motion.text
        x={(tokenX(6) + tokenColW + 14 + encoderX - 6) / 2}
        y={imageY + imageTotal / 2 - 8}
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="var(--color-accent)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.15, ease: PRODUCTIVE_EASE }}
      >
        Linear Projection
      </motion.text>

      {/* ====== SECTION 3: Transformer Encoder (right) ====== */}
      <motion.text
        x={encoderX + encoderW / 2}
        y={encoderY - 4}
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-text-primary)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
      >
        Transformer Encoder
      </motion.text>

      {/* Encoder bounding box */}
      <motion.rect
        x={encoderX}
        y={encoderY}
        width={encoderW}
        height={encoderH}
        rx="8"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, delay: 1.15, ease: PRODUCTIVE_EASE }}
      />

      {/* Token slots inside encoder */}
      {(() => {
        const slotCount = 5
        const slotW = 14
        const slotH = 50
        const slotGap = (encoderW - 24 - slotCount * slotW) / (slotCount - 1)
        const slotBaseX = encoderX + 12
        const slotBaseY = encoderY + 18

        return (
          <>
            {/* Token slots */}
            {Array.from({ length: slotCount }).map((_, i) => {
              const sx = slotBaseX + i * (slotW + slotGap)
              return (
                <motion.rect
                  key={`slot-${i}`}
                  x={sx}
                  y={slotBaseY}
                  width={slotW}
                  height={slotH}
                  rx="3"
                  fill="var(--color-accent-subtle)"
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.4,
                    delay: 1.25 + i * 0.06,
                    ease: PRODUCTIVE_EASE,
                  }}
                />
              )
            })}

            {/* Self-attention arcs between tokens */}
            {[
              { from: 0, to: 1 },
              { from: 0, to: 2 },
              { from: 1, to: 3 },
              { from: 2, to: 4 },
              { from: 3, to: 4 },
              { from: 0, to: 4 },
            ].map(({ from, to }, i) => {
              const x1 = slotBaseX + from * (slotW + slotGap) + slotW / 2
              const x2 = slotBaseX + to * (slotW + slotGap) + slotW / 2
              const arcY = slotBaseY - 3 - Math.abs(to - from) * 4
              const d = `M ${x1} ${slotBaseY} Q ${(x1 + x2) / 2} ${arcY}, ${x2} ${slotBaseY}`
              return (
                <motion.path
                  key={`attn-arc-${i}`}
                  d={d}
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                  strokeDasharray="2 2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={isInView ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 1.6 + i * 0.08,
                    ease: PRODUCTIVE_EASE,
                  }}
                />
              )
            })}

            {/* Self-Attention label inside encoder */}
            <motion.text
              x={encoderX + encoderW / 2}
              y={slotBaseY + slotH + 16}
              textAnchor="middle"
              fontSize="9"
              fontWeight="500"
              fill="var(--color-text-secondary)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
            >
              Self-Attention
            </motion.text>

            {/* Multi-Head Attention block label */}
            <motion.rect
              x={encoderX + 10}
              y={slotBaseY + slotH + 24}
              width={encoderW - 20}
              height={20}
              rx="4"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeOpacity="0.4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.75, ease: PRODUCTIVE_EASE }}
            />
            <motion.text
              x={encoderX + encoderW / 2}
              y={slotBaseY + slotH + 38}
              textAnchor="middle"
              fontSize="9"
              fontWeight="600"
              fill="var(--color-accent)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
            >
              Multi-Head Attention + FFN
            </motion.text>
          </>
        )
      })()}

      {/* ====== SECTION 4: Contrast annotation (bottom) ====== */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        {/* Dividing line */}
        <line
          x1="30"
          y1="178"
          x2="510"
          y2="178"
          stroke="var(--color-border-primary)"
          strokeWidth="0.5"
          strokeDasharray="4 3"
        />

        {/* ConvNet side */}
        <rect
          x="30"
          y="188"
          width="230"
          height="58"
          rx="6"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x="145"
          y="206"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="var(--color-text-primary)"
        >
          ConvNet: sliding kernel
        </text>
        {/* Mini illustration: small sliding kernel */}
        <rect x="70" y="215" width="30" height="20" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-primary)" strokeWidth="0.8" />
        <rect x="104" y="215" width="30" height="20" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-primary)" strokeWidth="0.8" />
        <rect x="138" y="215" width="30" height="20" rx="2" fill="var(--color-bg-elevated)" stroke="var(--color-border-primary)" strokeWidth="0.8" />
        {/* Kernel highlight on first */}
        <rect x="74" y="218" width="10" height="10" rx="1" fill="var(--color-accent)" fillOpacity="0.3" stroke="var(--color-accent)" strokeWidth="1" />
        {/* Arrow showing slide */}
        <line x1="88" y1="225" x2="99" y2="225" stroke="var(--color-text-tertiary)" strokeWidth="1" markerEnd="url(#arrowhead-vit-patch-subtle)" />
        <text x="145" y="242" textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">
          Local receptive field, weight sharing
        </text>

        {/* ViT side */}
        <rect
          x="280"
          y="188"
          width="230"
          height="58"
          rx="6"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />
        <text
          x="395"
          y="206"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="var(--color-accent)"
        >
          ViT: patches as tokens
        </text>
        {/* Mini illustration: patches -> tokens */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={`mini-tok-${i}`}
            x={320 + i * 16}
            y="214"
            width={10}
            height={22}
            rx="2"
            fill="var(--color-accent)"
            fillOpacity={0.15 + i * 0.05}
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
        ))}
        {/* Double-headed attention arc */}
        <path
          d={`M 325 214 Q 357 204, 389 214`}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          strokeOpacity="0.6"
        />
        <text x="395" y="244" textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">
          Global self-attention, no locality bias
        </text>
      </motion.g>
    </svg>
  )
}
