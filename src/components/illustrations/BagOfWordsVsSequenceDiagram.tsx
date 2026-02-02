'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface BagOfWordsVsSequenceDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function BagOfWordsVsSequenceDiagram({
  className,
}: BagOfWordsVsSequenceDiagramProps) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const sentenceWords = ['The', 'cat', 'sat', 'on', 'the', 'mat']
  const jumbledWords = ['mat', 'The', 'sat', 'cat', 'the', 'on']

  // Layout constants
  const sentenceY = 24
  const pathSplitY = 48
  const bowLabelY = 68
  const bowWordsY = 95
  const seqWordsY = 95
  const bowPoolY = 140
  const seqLstmY = 140
  const bowVectorY = 185
  const seqHiddenY = 185
  const noteY = 222
  const insightY = 268

  // Path 1 (BoW) x range: 30 - 230
  const bowCenterX = 130
  // Path 2 (Seq) x range: 270 - 470
  const seqCenterX = 370

  // Delay offsets for sequential path animation
  const bowBaseDelay = 0.3
  const seqBaseDelay = 1.4

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 300"
      className={className}
      role="img"
      aria-label="Diagram contrasting bag-of-words versus sequence model processing, showing that word order matters for meaning"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-bow-vs-seq"
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
          id="arrowhead-bow-vs-seq-muted"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <polygon
            points="0 0, 8 4, 0 8"
            fill="var(--color-text-secondary)"
          />
        </marker>
      </defs>

      {/* ===== Sentence at top ===== */}
      <motion.text
        x="250"
        y={sentenceY}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="13"
        fontWeight="600"
        initial={{ opacity: 0, y: sentenceY - 8 }}
        animate={isInView ? { opacity: 1, y: sentenceY } : { opacity: 0, y: sentenceY - 8 }}
        transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
      >
        &quot;The cat sat on the mat&quot;
      </motion.text>

      {/* ===== Split lines from sentence to two paths ===== */}
      <motion.line
        x1="250"
        y1={sentenceY + 6}
        x2={bowCenterX}
        y2={pathSplitY}
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: PRODUCTIVE_EASE }}
      />
      <motion.line
        x1="250"
        y1={sentenceY + 6}
        x2={seqCenterX}
        y2={pathSplitY}
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: PRODUCTIVE_EASE }}
      />

      {/* ================================================================ */}
      {/*  PATH 1 -- Bag of Words                                         */}
      {/* ================================================================ */}

      {/* Path label */}
      <motion.text
        x={bowCenterX}
        y={bowLabelY}
        textAnchor="middle"
        fill="var(--color-text-secondary)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.04em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: bowBaseDelay, ease: PRODUCTIVE_EASE }}
      >
        Bag of Words
      </motion.text>

      {/* Jumbled words -- scattered / unordered appearance */}
      {jumbledWords.map((word, i) => {
        const cols = 3
        const col = i % cols
        const row = Math.floor(i / cols)
        const xBase = 55 + col * 52
        // stagger rows slightly for a jumbled feel
        const yOff = col === 1 ? 4 : col === 2 ? -2 : 0
        const x = xBase
        const y = bowWordsY + row * 18 + yOff

        return (
          <motion.text
            key={`bow-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="10"
            fontWeight="500"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            transition={{
              duration: 0.3,
              delay: bowBaseDelay + 0.15 + i * 0.05,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {word}
          </motion.text>
        )
      })}

      {/* Arrow from jumbled words to GlobalAveragePooling box */}
      <motion.line
        x1={bowCenterX}
        y1={bowWordsY + 26}
        x2={bowCenterX}
        y2={bowPoolY - 13}
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-bow-vs-seq-muted)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: bowBaseDelay + 0.55, ease: PRODUCTIVE_EASE }}
      />

      {/* GlobalAveragePooling box */}
      <motion.rect
        x={bowCenterX - 65}
        y={bowPoolY - 12}
        width="130"
        height="24"
        rx="4"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border-primary)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.4, delay: bowBaseDelay + 0.65, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={bowCenterX}
        y={bowPoolY + 3}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize="9"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: bowBaseDelay + 0.75, ease: PRODUCTIVE_EASE }}
      >
        GlobalAveragePooling
      </motion.text>

      {/* Arrow from pool to vector */}
      <motion.line
        x1={bowCenterX}
        y1={bowPoolY + 13}
        x2={bowCenterX}
        y2={bowVectorY - 10}
        stroke="var(--color-text-secondary)"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead-bow-vs-seq-muted)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: bowBaseDelay + 0.85, ease: PRODUCTIVE_EASE }}
      />

      {/* Single vector output */}
      <motion.rect
        x={bowCenterX - 28}
        y={bowVectorY - 10}
        width="56"
        height="20"
        rx="3"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: bowBaseDelay + 0.95, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={bowCenterX}
        y={bowVectorY + 4}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: bowBaseDelay + 1.05, ease: PRODUCTIVE_EASE }}
      >
        vector
      </motion.text>

      {/* BoW note */}
      <motion.g
        initial={{ opacity: 0, y: noteY - 6 }}
        animate={isInView ? { opacity: 1, y: noteY } : { opacity: 0, y: noteY - 6 }}
        transition={{ duration: 0.4, delay: bowBaseDelay + 1.15, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={bowCenterX - 75}
          y={noteY - 14}
          width="150"
          height="34"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth="1"
        />
        <text
          x={bowCenterX}
          y={noteY + 1}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontWeight="500"
        >
          &quot;not good&quot; = &quot;good not&quot;
        </text>
        <text
          x={bowCenterX}
          y={noteY + 14}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="9"
          fontStyle="italic"
        >
          (same result)
        </text>
      </motion.g>

      {/* ================================================================ */}
      {/*  PATH 2 -- Sequence Model                                       */}
      {/* ================================================================ */}

      {/* Path label */}
      <motion.text
        x={seqCenterX}
        y={bowLabelY}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="11"
        fontWeight="700"
        letterSpacing="0.04em"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: seqBaseDelay, ease: PRODUCTIVE_EASE }}
      >
        Sequence Model
      </motion.text>

      {/* Words in order */}
      {sentenceWords.map((word, i) => {
        const x = 290 + i * 30
        const y = seqWordsY + 4

        return (
          <motion.text
            key={`seq-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="10"
            fontWeight="500"
            initial={{ opacity: 0, y: y - 6 }}
            animate={isInView ? { opacity: 1, y } : { opacity: 0, y: y - 6 }}
            transition={{
              duration: 0.3,
              delay: seqBaseDelay + 0.1 + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {word}
          </motion.text>
        )
      })}

      {/* Small arrows from each word down to LSTM cells */}
      {sentenceWords.map((_, i) => {
        const x = 290 + i * 30
        return (
          <motion.line
            key={`seq-arr-${i}`}
            x1={x}
            y1={seqWordsY + 10}
            x2={x}
            y2={seqLstmY - 13}
            stroke="var(--color-accent)"
            strokeWidth="1"
            markerEnd="url(#arrowhead-bow-vs-seq)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: 0.25,
              delay: seqBaseDelay + 0.5 + i * 0.08,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* LSTM cells in sequence */}
      {sentenceWords.map((_, i) => {
        const x = 290 + i * 30
        const cellW = 24
        const cellH = 22

        return (
          <motion.g
            key={`lstm-${i}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.7 }
            }
            transition={{
              duration: 0.35,
              delay: seqBaseDelay + 0.6 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          >
            <rect
              x={x - cellW / 2}
              y={seqLstmY - cellH / 2}
              width={cellW}
              height={cellH}
              rx="3"
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <text
              x={x}
              y={seqLstmY + 3.5}
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="700"
            >
              LSTM
            </text>
          </motion.g>
        )
      })}

      {/* Horizontal arrows between LSTM cells (hidden state flow) */}
      {sentenceWords.slice(0, -1).map((_, i) => {
        const x1 = 290 + i * 30 + 12
        const x2 = 290 + (i + 1) * 30 - 12
        return (
          <motion.line
            key={`lstm-flow-${i}`}
            x1={x1}
            y1={seqLstmY}
            x2={x2}
            y2={seqLstmY}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-bow-vs-seq)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: 0.3,
              delay: seqBaseDelay + 0.75 + i * 0.1,
              ease: PRODUCTIVE_EASE,
            }}
          />
        )
      })}

      {/* Hidden state label above the flow arrows */}
      <motion.text
        x={seqCenterX}
        y={seqLstmY - 17}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontStyle="italic"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: seqBaseDelay + 1.0, ease: PRODUCTIVE_EASE }}
      >
        hidden state
      </motion.text>

      {/* Arrow from last LSTM cell down to final hidden state */}
      <motion.line
        x1={290 + 5 * 30}
        y1={seqLstmY + 12}
        x2={290 + 5 * 30}
        y2={seqHiddenY}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: seqBaseDelay + 1.2, ease: PRODUCTIVE_EASE }}
      />

      {/* Final hidden state box */}
      <motion.rect
        x={seqCenterX - 40}
        y={seqHiddenY - 10}
        width="80"
        height="20"
        rx="3"
        fill="var(--color-accent-subtle)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.4, delay: seqBaseDelay + 1.3, ease: PRODUCTIVE_EASE }}
      />
      <motion.text
        x={seqCenterX}
        y={seqHiddenY + 4}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="9"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3, delay: seqBaseDelay + 1.4, ease: PRODUCTIVE_EASE }}
      >
        final hidden state
      </motion.text>

      {/* Connecting line from last LSTM to final hidden state box */}
      <motion.path
        d={`M ${290 + 5 * 30} ${seqHiddenY} L ${seqCenterX + 40} ${seqHiddenY}`}
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        markerEnd="url(#arrowhead-bow-vs-seq)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay: seqBaseDelay + 1.35, ease: PRODUCTIVE_EASE }}
      />

      {/* Seq note */}
      <motion.g
        initial={{ opacity: 0, y: noteY - 6 }}
        animate={isInView ? { opacity: 1, y: noteY } : { opacity: 0, y: noteY - 6 }}
        transition={{ duration: 0.4, delay: seqBaseDelay + 1.5, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={seqCenterX - 75}
          y={noteY - 14}
          width="150"
          height="34"
          rx="4"
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-accent)"
          strokeWidth="1"
        />
        <text
          x={seqCenterX}
          y={noteY + 1}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontWeight="500"
        >
          &quot;not good&quot; ≠ &quot;good not&quot;
        </text>
        <text
          x={seqCenterX}
          y={noteY + 14}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="9"
          fontStyle="italic"
        >
          (different result)
        </text>
      </motion.g>

      {/* ===== Divider between paths ===== */}
      <motion.line
        x1="250"
        y1={pathSplitY + 10}
        x2="250"
        y2={noteY + 26}
        stroke="var(--color-border-primary)"
        strokeWidth="1"
        strokeDasharray="3 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: PRODUCTIVE_EASE }}
      />

      {/* ===== Key Insight at bottom ===== */}
      <motion.g
        initial={{ opacity: 0, y: insightY - 8 }}
        animate={
          isInView
            ? { opacity: 1, y: insightY }
            : { opacity: 0, y: insightY - 8 }
        }
        transition={{ duration: 0.5, delay: seqBaseDelay + 1.8, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x="145"
          y={insightY - 14}
          width="210"
          height="26"
          rx="13"
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
        />
        <text
          x="250"
          y={insightY + 3}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize="11"
          fontWeight="700"
        >
          Order matters for meaning
        </text>
      </motion.g>
    </svg>
  )
}
