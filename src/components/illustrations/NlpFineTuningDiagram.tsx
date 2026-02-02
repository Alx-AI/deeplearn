'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface NlpFineTuningDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

export default function NlpFineTuningDiagram({ className = '' }: NlpFineTuningDiagramProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  /* ── Layout constants ─────────────────────────────────────── */
  const stackX = 160;
  const stackW = 180;
  const layerH = 28;
  const layerGap = 5;
  const stackBottom = 250;

  const layers = [
    { label: 'Transformer Layer 1', frozen: true },
    { label: 'Transformer Layer 2', frozen: true },
    { label: 'Transformer Layer 3', frozen: false },
    { label: 'Transformer Layer 4', frozen: false },
  ];

  /* ── Task head positions ──────────────────────────────────── */
  const headY = 68;
  const headH = 20;
  const headW = 110;
  const heads = [
    {
      label: 'Sentiment',
      output: '+  /  -',
      cx: 80,
    },
    {
      label: 'NER',
      output: 'B-PER  I-PER  O',
      cx: 250,
    },
    {
      label: 'QA',
      output: 'start / end pos',
      cx: 420,
    },
  ];

  /* ── Helpers ──────────────────────────────────────────────── */
  const layerY = (i: number) => stackBottom - (i + 1) * (layerH + layerGap);

  const renderLockIcon = (cx: number, cy: number) => (
    <g transform={`translate(${cx}, ${cy})`}>
      <rect x={-4} y={-2} width={8} height={6} rx={1} fill="var(--color-text-tertiary)" />
      <path
        d="M -2,-2 L -2,-4 A 2,2 0 0,1 2,-4 L 2,-2"
        stroke="var(--color-text-tertiary)"
        strokeWidth={1.5}
        fill="none"
      />
    </g>
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 500 300"
      className={className}
      role="img"
      aria-label="NLP fine-tuning diagram showing how a pretrained BERT Transformer is adapted for sentiment analysis, named entity recognition, and question answering tasks"
      style={{
        width: '100%',
        height: 'auto',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <defs>
        <marker
          id="arrowhead-nlp-finetune"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-accent)" />
        </marker>
        <marker
          id="arrowhead-nlp-finetune-muted"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 7 3.5, 0 7" fill="var(--color-text-tertiary)" />
        </marker>
      </defs>

      {/* ── Title ─────────────────────────────────────────────── */}
      <motion.text
        x={250}
        y={18}
        textAnchor="middle"
        fill="var(--color-text-primary)"
        fontSize={13}
        fontWeight={700}
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
      >
        NLP Fine-Tuning: Pretrained BERT / Transformer
      </motion.text>

      {/* ── Pretrained Transformer stack ──────────────────────── */}
      {layers.map((layer, i) => {
        const y = layerY(i);
        const isFrozen = layer.frozen;
        const delay = 0.25 + i * 0.1;

        return (
          <motion.g
            key={layer.label}
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
          >
            <rect
              x={stackX}
              y={y}
              width={stackW}
              height={layerH}
              rx={4}
              fill={isFrozen ? 'var(--color-bg-tertiary)' : 'var(--color-accent-subtle)'}
              stroke={isFrozen ? 'var(--color-border-primary)' : 'var(--color-accent)'}
              strokeWidth={1.5}
            />

            {/* Layer label */}
            <text
              x={stackX + stackW / 2}
              y={y + layerH / 2 + 4}
              textAnchor="middle"
              fill={isFrozen ? 'var(--color-text-secondary)' : 'var(--color-accent)'}
              fontSize={9}
              fontWeight={500}
            >
              {layer.label}
            </text>

            {/* Lock icon for frozen layers */}
            {isFrozen && renderLockIcon(stackX + stackW - 12, y + layerH / 2)}
          </motion.g>
        );
      })}

      {/* ── "Pretrained BERT" bracket label (left side) ──────── */}
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
        transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
      >
        {/* Bracket line */}
        <path
          d={`M ${stackX - 8} ${layerY(0) + layerH} L ${stackX - 14} ${layerY(0) + layerH} L ${stackX - 14} ${layerY(3)} L ${stackX - 8} ${layerY(3)}`}
          stroke="var(--color-text-tertiary)"
          strokeWidth={1.2}
          fill="none"
        />
        {/* Bracket midpoint tick */}
        <line
          x1={stackX - 14}
          y1={(layerY(0) + layerH + layerY(3)) / 2}
          x2={stackX - 20}
          y2={(layerY(0) + layerH + layerY(3)) / 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth={1.2}
        />
        <text
          x={stackX - 24}
          y={(layerY(0) + layerH + layerY(3)) / 2 - 6}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize={9}
          fontWeight={600}
        >
          Pretrained
        </text>
        <text
          x={stackX - 24}
          y={(layerY(0) + layerH + layerY(3)) / 2 + 5}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize={9}
          fontWeight={600}
        >
          BERT
        </text>
      </motion.g>

      {/* ── [CLS] token indicator ────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 0.8, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={stackX + stackW / 2 - 22}
          y={layerY(3) - 22}
          width={44}
          height={16}
          rx={3}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
        />
        <text
          x={stackX + stackW / 2}
          y={layerY(3) - 11}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize={9}
          fontWeight={700}
        >
          [CLS]
        </text>
      </motion.g>

      {/* ── Vertical trunk line from [CLS] up to branching point ─ */}
      <motion.line
        x1={stackX + stackW / 2}
        y1={layerY(3) - 22}
        x2={stackX + stackW / 2}
        y2={headY + headH + 4}
        stroke="var(--color-accent)"
        strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.95, ease: PRODUCTIVE_EASE }}
      />

      {/* ── Branching lines to each task head ────────────────── */}
      {heads.map((head, i) => {
        const delay = 1.1 + i * 0.12;
        return (
          <motion.path
            key={head.label}
            d={`M ${stackX + stackW / 2} ${headY + headH + 4} L ${head.cx} ${headY + headH + 2}`}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            fill="none"
            markerEnd="url(#arrowhead-nlp-finetune)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
          />
        );
      })}

      {/* ── Task heads ───────────────────────────────────────── */}
      {heads.map((head, i) => {
        const hx = head.cx - headW / 2;
        const delay = 1.3 + i * 0.15;

        return (
          <motion.g
            key={head.label}
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, delay, ease: PRODUCTIVE_EASE }}
          >
            {/* Dense layer box */}
            <rect
              x={hx}
              y={headY}
              width={headW}
              height={headH}
              rx={4}
              fill="var(--color-accent-subtle)"
              stroke="var(--color-accent)"
              strokeWidth={1.5}
            />
            <text
              x={head.cx}
              y={headY + headH / 2 + 4}
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize={9}
              fontWeight={600}
            >
              Dense ({head.label})
            </text>

            {/* Output label above */}
            <text
              x={head.cx}
              y={headY - 8}
              textAnchor="middle"
              fill="var(--color-text-secondary)"
              fontSize={9}
              fontWeight={500}
            >
              {head.output}
            </text>

            {/* Arrow from head box upward to output label */}
            <line
              x1={head.cx}
              y1={headY}
              x2={head.cx}
              y2={headY - 3}
              stroke="var(--color-text-tertiary)"
              strokeWidth={1}
              markerEnd="url(#arrowhead-nlp-finetune-muted)"
            />
          </motion.g>
        );
      })}

      {/* ── Task description labels ──────────────────────────── */}
      {[
        { cx: 80, text: 'Classification' },
        { cx: 250, text: 'Token-level' },
        { cx: 420, text: 'Span extraction' },
      ].map((item, i) => (
        <motion.text
          key={item.text}
          x={item.cx}
          y={headY - 18}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize={9}
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 1.7 + i * 0.1, ease: PRODUCTIVE_EASE }}
        >
          {item.text}
        </motion.text>
      ))}

      {/* ── Learning rate annotation ─────────────────────────── */}
      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
        transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
      >
        <rect
          x={350}
          y={layerY(0) + 4}
          width={140}
          height={32}
          rx={5}
          fill="var(--color-bg-elevated)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
        />
        <text
          x={420}
          y={layerY(0) + 16}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize={9}
          fontWeight={500}
        >
          Low LR for pretrained layers
        </text>
        <text
          x={420}
          y={layerY(0) + 28}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize={9}
          fontWeight={600}
        >
          Normal LR for task head
        </text>

        {/* Connecting line from annotation to stack */}
        <line
          x1={350}
          y1={layerY(0) + 20}
          x2={stackX + stackW + 4}
          y2={layerY(0) + 20}
          stroke="var(--color-border-primary)"
          strokeWidth={1}
          strokeDasharray="3 3"
        />
      </motion.g>

      {/* ── Legend ────────────────────────────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 2.2, ease: PRODUCTIVE_EASE }}
      >
        {/* Frozen layer legend */}
        <rect
          x={22}
          y={274}
          width={28}
          height={12}
          rx={2}
          fill="var(--color-bg-tertiary)"
          stroke="var(--color-border-primary)"
          strokeWidth={1}
        />
        {renderLockIcon(36 + 10, 280)}
        <text
          x={66}
          y={283}
          fill="var(--color-text-secondary)"
          fontSize={9}
        >
          Frozen
        </text>

        {/* Trainable layer legend */}
        <rect
          x={110}
          y={274}
          width={28}
          height={12}
          rx={2}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1}
        />
        <text
          x={146}
          y={283}
          fill="var(--color-text-secondary)"
          fontSize={9}
        >
          Trainable
        </text>

        {/* [CLS] legend */}
        <rect
          x={205}
          y={274}
          width={34}
          height={12}
          rx={2}
          fill="var(--color-accent-subtle)"
          stroke="var(--color-accent)"
          strokeWidth={1.5}
        />
        <text
          x={222}
          y={283}
          textAnchor="middle"
          fill="var(--color-accent)"
          fontSize={9}
          fontWeight={700}
        >
          [CLS]
        </text>
        <text
          x={248}
          y={283}
          fill="var(--color-text-secondary)"
          fontSize={9}
        >
          pooled repr.
        </text>
      </motion.g>

      {/* ── Input tokens at the bottom ───────────────────────── */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.5, delay: 0.15, ease: PRODUCTIVE_EASE }}
      >
        {['[CLS]', 'The', 'movie', 'was', 'great'].map((tok, i) => {
          const tokW = tok === '[CLS]' ? 32 : 30;
          const gap = 4;
          const totalW = 32 + 4 * (30 + gap) + gap;
          const startX = stackX + stackW / 2 - totalW / 2;
          const tx =
            i === 0
              ? startX
              : startX + 32 + gap + (i - 1) * (30 + gap);
          const ty = stackBottom + 8;
          const isCls = tok === '[CLS]';

          return (
            <g key={tok + i}>
              <rect
                x={tx}
                y={ty}
                width={tokW}
                height={16}
                rx={3}
                fill={isCls ? 'var(--color-accent-subtle)' : 'var(--color-bg-elevated)'}
                stroke={isCls ? 'var(--color-accent)' : 'var(--color-border-primary)'}
                strokeWidth={isCls ? 1.5 : 1}
              />
              <text
                x={tx + tokW / 2}
                y={ty + 11}
                textAnchor="middle"
                fill={isCls ? 'var(--color-accent)' : 'var(--color-text-primary)'}
                fontSize={9}
                fontWeight={isCls ? 700 : 400}
              >
                {tok}
              </text>
            </g>
          );
        })}

        {/* Arrow from input tokens to first transformer layer */}
        <line
          x1={stackX + stackW / 2}
          y1={stackBottom + 4}
          x2={stackX + stackW / 2}
          y2={layerY(0) + layerH + 2}
          stroke="var(--color-text-tertiary)"
          strokeWidth={1.2}
          strokeDasharray="3 2"
        />
        <text
          x={stackX + stackW / 2}
          y={stackBottom + 46}
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize={9}
        >
          Input tokens
        </text>
      </motion.g>
    </svg>
  );
}
