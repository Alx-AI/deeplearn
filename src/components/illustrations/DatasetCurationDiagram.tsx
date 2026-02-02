'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface DatasetCurationDiagramProps {
  className?: string
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9]

export default function DatasetCurationDiagram({
  className = '',
}: DatasetCurationDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const pipelineSteps = [
    { id: 'fix-labels', label: 'Fix Labels', shortDesc: 'Correct mislabeled', x: 185 },
    { id: 'handle-missing', label: 'Handle Missing', shortDesc: 'Fill/remove gaps', x: 265 },
    { id: 'remove-outliers', label: 'Remove Outliers', shortDesc: 'Filter extremes', x: 345 },
    { id: 'select-features', label: 'Select Features', shortDesc: 'Keep useful only', x: 425 },
  ]

  return (
    <div ref={ref} className={className}>
      <svg
        viewBox="0 0 540 236"
        role="img"
        aria-label="Dataset curation pipeline showing raw messy data being cleaned through four stages: fix labels, handle missing values, remove outliers, and select features, producing high-quality training data"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-dataset-curation"
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
          <marker
            id="arrowhead-dataset-curation-muted"
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

        {/* ===== Raw Data Icon (Left) ===== */}
        <motion.g
          initial={{ opacity: 0, x: -12 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Container */}
          <rect
            x="10"
            y="30"
            width="100"
            height="110"
            rx="5"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1.5"
          />

          {/* Title */}
          <text
            x="60"
            y="22"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="11"
            fontWeight="600"
          >
            Raw Data
          </text>

          {/* Messy data rows - each row is a mini data entry with issues */}
          {/* Row 1: good row */}
          <rect x="18" y="38" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.12" />
          <text x="22" y="46" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.82  cat  OK
          </text>

          {/* Row 2: mislabeled - X marker */}
          <rect x="18" y="52" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.08" />
          <text x="22" y="60" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.91  dog
          </text>
          <text x="82" y="61" fill="var(--color-error)" fontSize="9" fontWeight="700">
            X
          </text>

          {/* Row 3: missing value - ? marker */}
          <rect x="18" y="66" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.12" />
          <text x="22" y="74" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            {'  ?   bird OK'}
          </text>
          <text x="24" y="74" fill="var(--color-warning)" fontSize="9" fontWeight="700">
            ?
          </text>

          {/* Row 4: good row */}
          <rect x="18" y="80" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.08" />
          <text x="22" y="88" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.44  cat  OK
          </text>

          {/* Row 5: outlier - ! marker */}
          <rect x="18" y="94" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.12" />
          <text x="22" y="102" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            9.99  dog
          </text>
          <text x="82" y="103" fill="var(--color-warning)" fontSize="9" fontWeight="700">
            !
          </text>

          {/* Row 6: missing value */}
          <rect x="18" y="108" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.08" />
          <text x="22" y="116" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            {'0.67   ?   OK'}
          </text>
          <text x="52" y="116" fill="var(--color-warning)" fontSize="9" fontWeight="700">
            ?
          </text>

          {/* Row 7: mislabeled */}
          <rect x="18" y="122" width="84" height="10" rx="2" fill="var(--color-accent)" opacity="0.12" />
          <text x="22" y="130" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.33  cat
          </text>
          <text x="82" y="131" fill="var(--color-error)" fontSize="9" fontWeight="700">
            X
          </text>
        </motion.g>

        {/* ===== Arrow: Raw Data -> Pipeline ===== */}
        <motion.g
          initial={{ opacity: 0, x: -8 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="116"
            y1="85"
            x2="152"
            y2="85"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-dataset-curation)"
          />
        </motion.g>

        {/* ===== Curation Pipeline Header ===== */}
        <motion.g
          initial={{ opacity: 0, y: -8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="305"
            y="16"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="10"
            fontWeight="600"
          >
            Curation Pipeline
          </text>
          {/* Bracket line under the header spanning all 4 steps */}
          <line
            x1="162"
            y1="22"
            x2="448"
            y2="22"
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </motion.g>

        {/* ===== Pipeline Step Boxes ===== */}
        {pipelineSteps.map((step, i) => (
          <motion.g
            key={step.id}
            initial={{ opacity: 0, y: 14 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.4 + i * 0.15,
              ease: PRODUCTIVE_EASE,
            }}
          >
            {/* Step box */}
            <rect
              x={step.x - 33}
              y="34"
              width="66"
              height="52"
              rx="4"
              fill="var(--color-bg-elevated)"
              stroke="var(--color-accent)"
              strokeWidth="1.2"
              opacity="0.9"
            />

            {/* Step number circle */}
            <circle
              cx={step.x}
              cy="46"
              r="8"
              fill="var(--color-accent)"
              opacity="0.15"
            />
            <text
              x={step.x}
              y="49.5"
              textAnchor="middle"
              fill="var(--color-accent)"
              fontSize="9"
              fontWeight="700"
            >
              {i + 1}
            </text>

            {/* Step label */}
            <text
              x={step.x}
              y="66"
              textAnchor="middle"
              fill="var(--color-text-primary)"
              fontSize="9"
              fontWeight="600"
            >
              {step.label}
            </text>

            {/* Step description */}
            <text
              x={step.x}
              y="77"
              textAnchor="middle"
              fill="var(--color-text-tertiary)"
              fontSize="9"
            >
              {step.shortDesc}
            </text>

            {/* Connecting arrow to next step */}
            {i < pipelineSteps.length - 1 && (
              <line
                x1={step.x + 33}
                y1="60"
                x2={pipelineSteps[i + 1].x - 33}
                y2="60"
                stroke="var(--color-text-tertiary)"
                strokeWidth="1"
                markerEnd="url(#arrowhead-dataset-curation-muted)"
              />
            )}
          </motion.g>
        ))}

        {/* ===== Detail icons under each step ===== */}
        {/* Fix Labels: tag with checkmark */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.9, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="168"
            y="94"
            width="34"
            height="18"
            rx="3"
            fill="var(--color-accent)"
            opacity="0.08"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
          />
          {/* Strikethrough X turning to checkmark */}
          <text x="177" y="106" fill="var(--color-error)" fontSize="9" textDecoration="line-through" opacity="0.5">
            X
          </text>
          <text x="186" y="107" fill="var(--color-accent)" fontSize="10" fontWeight="600">
            {'✓'}
          </text>
        </motion.g>

        {/* Handle Missing: gap being filled */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.0, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="248"
            y="94"
            width="34"
            height="18"
            rx="3"
            fill="var(--color-accent)"
            opacity="0.08"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
          />
          {/* Question mark being replaced */}
          <text x="257" y="107" fill="var(--color-warning)" fontSize="9" opacity="0.5">
            ?
          </text>
          <text x="266" y="106" fill="var(--color-accent)" fontSize="9" fontWeight="600" fontFamily="monospace">
            0.5
          </text>
        </motion.g>

        {/* Remove Outliers: extreme value being crossed out */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="328"
            y="94"
            width="34"
            height="18"
            rx="3"
            fill="var(--color-accent)"
            opacity="0.08"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
          />
          {/* Outlier value crossed out */}
          <text x="337" y="107" fill="var(--color-error)" fontSize="9" fontFamily="monospace" textDecoration="line-through" opacity="0.6">
            9.9
          </text>
          <line x1="336" y1="100" x2="352" y2="108" stroke="var(--color-error)" strokeWidth="0.8" opacity="0.6" />
        </motion.g>

        {/* Select Features: columns being filtered */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 1.2, ease: PRODUCTIVE_EASE }}
        >
          <rect
            x="408"
            y="94"
            width="34"
            height="18"
            rx="3"
            fill="var(--color-accent)"
            opacity="0.08"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
          />
          {/* Column bars - some kept, some faded */}
          <rect x="414" y="98" width="4" height="10" rx="1" fill="var(--color-accent)" opacity="0.7" />
          <rect x="420" y="100" width="4" height="8" rx="1" fill="var(--color-text-tertiary)" opacity="0.2" />
          <rect x="426" y="97" width="4" height="11" rx="1" fill="var(--color-accent)" opacity="0.7" />
          <rect x="432" y="101" width="4" height="7" rx="1" fill="var(--color-text-tertiary)" opacity="0.2" />
        </motion.g>

        {/* ===== Arrow: Pipeline -> Clean Data ===== */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          <line
            x1="460"
            y1="60"
            x2="460"
            y2="130"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead-dataset-curation)"
          />
        </motion.g>

        {/* ===== Clean Data Icon (Bottom Right) ===== */}
        <motion.g
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.3, ease: PRODUCTIVE_EASE }}
        >
          {/* Container */}
          <rect
            x="420"
            y="138"
            width="100"
            height="72"
            rx="5"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-accent)"
            strokeWidth="1.8"
          />

          {/* Title */}
          <text
            x="470"
            y="153"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="10"
            fontWeight="600"
          >
            Clean Data
          </text>

          {/* Clean, organized rows */}
          <rect x="428" y="159" width="84" height="9" rx="2" fill="var(--color-accent)" opacity="0.15" />
          <text x="432" y="166" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.82  cat  OK
          </text>

          <rect x="428" y="170" width="84" height="9" rx="2" fill="var(--color-accent)" opacity="0.1" />
          <text x="432" y="177" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.91  cat  OK
          </text>

          <rect x="428" y="181" width="84" height="9" rx="2" fill="var(--color-accent)" opacity="0.15" />
          <text x="432" y="188" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.67  bird OK
          </text>

          <rect x="428" y="192" width="84" height="9" rx="2" fill="var(--color-accent)" opacity="0.1" />
          <text x="432" y="199" fill="var(--color-text-secondary)" fontSize="9" fontFamily="monospace">
            0.44  cat  OK
          </text>
        </motion.g>

        {/* ===== Annotation ===== */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          {/* Divider line */}
          <line
            x1="10"
            y1="150"
            x2="410"
            y2="150"
            stroke="var(--color-border-primary)"
            strokeWidth="0.6"
            opacity="0.3"
          />

          {/* Annotation background */}
          <rect
            x="20"
            y="160"
            width="370"
            height="44"
            rx="6"
            fill="var(--color-accent)"
            opacity="0.06"
            stroke="var(--color-accent)"
            strokeWidth="0.8"
            strokeDasharray="4 2"
          />

          {/* Annotation text */}
          <text
            x="205"
            y="180"
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="9"
            fontWeight="600"
          >
            Most effective regularization: better data
          </text>

          {/* Supporting detail */}
          <text
            x="205"
            y="194"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            fontStyle="italic"
          >
            Clean labels, complete values, no outliers, relevant features
          </text>
        </motion.g>

        {/* ===== Before/After quality indicators ===== */}
        {/* Raw data quality bar */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="60"
            y="152"
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
          >
            Quality: Low
          </text>
          {/* Quality bar - low */}
          <rect x="30" y="156" width="60" height="3" rx="1.5" fill="var(--color-border-primary)" opacity="0.3" />
          <motion.rect
            x="30"
            y="156"
            width="18"
            height="3"
            rx="1.5"
            fill="var(--color-error)"
            opacity="0.7"
            initial={{ width: 0 }}
            animate={isInView ? { width: 18 } : {}}
            transition={{ duration: 0.6, delay: 0.9, ease: PRODUCTIVE_EASE }}
          />
        </motion.g>

        {/* Clean data quality bar */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.5, ease: PRODUCTIVE_EASE }}
        >
          <text
            x="470"
            y="216"
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="9"
            fontWeight="500"
          >
            Quality: High
          </text>
        </motion.g>
      </svg>
    </div>
  )
}
