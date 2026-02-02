'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface NonMaxSuppressionDiagramProps {
  className?: string;
}

const PRODUCTIVE_EASE: [number, number, number, number] = [0.2, 0, 0.38, 0.9];

/** Bounding box definition with confidence score */
interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export default function NonMaxSuppressionDiagram({
  className = '',
}: NonMaxSuppressionDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // The "object" rectangle (a simple filled shape representing a detected object)
  const objectRect = { x: 30, y: 55, width: 60, height: 80 };

  // Overlapping bounding boxes around the object, sorted by confidence descending
  const boxes: BBox[] = [
    { x: 22, y: 45, width: 76, height: 98, confidence: 0.95 },
    { x: 28, y: 50, width: 70, height: 90, confidence: 0.87 },
    { x: 18, y: 42, width: 82, height: 100, confidence: 0.82 },
    { x: 34, y: 54, width: 64, height: 84, confidence: 0.73 },
    { x: 25, y: 60, width: 72, height: 78, confidence: 0.65 },
  ];

  // Panel offsets
  const beforePanelX = 10;
  const afterPanelX = 300;
  const panelWidth = 140;
  const panelHeight = 170;

  // The kept box (highest confidence)
  const keptBox = boxes[0];

  return (
    <div className={className} ref={ref}>
      <svg
        viewBox="0 0 500 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Non-Maximum Suppression diagram showing how overlapping bounding boxes are reduced to a single best detection"
        style={{
          width: '100%',
          height: 'auto',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <defs>
          <marker
            id="arrowhead-nms"
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

        {/* ===== BEFORE NMS PANEL ===== */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, ease: PRODUCTIVE_EASE }}
        >
          {/* Panel label */}
          <motion.text
            x={beforePanelX + panelWidth / 2}
            y="18"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="13"
            fontWeight="600"
            initial={{ opacity: 0, y: -8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: PRODUCTIVE_EASE }}
          >
            Before NMS
          </motion.text>

          {/* Panel background */}
          <motion.rect
            x={beforePanelX}
            y="26"
            width={panelWidth}
            height={panelHeight}
            rx="6"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: PRODUCTIVE_EASE }}
          />

          {/* The object being detected (a simple filled rectangle) */}
          <motion.rect
            x={beforePanelX + objectRect.x}
            y={objectRect.y}
            width={objectRect.width}
            height={objectRect.height}
            rx="4"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: PRODUCTIVE_EASE }}
          />

          {/* Simple icon lines inside the object to suggest it's something */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.35 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.3, ease: PRODUCTIVE_EASE }}
          >
            <line
              x1={beforePanelX + objectRect.x + 15}
              y1={objectRect.y + 20}
              x2={beforePanelX + objectRect.x + objectRect.width - 15}
              y2={objectRect.y + 20}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={beforePanelX + objectRect.x + 15}
              y1={objectRect.y + 30}
              x2={beforePanelX + objectRect.x + objectRect.width - 20}
              y2={objectRect.y + 30}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx={beforePanelX + objectRect.x + objectRect.width / 2}
              cy={objectRect.y + 55}
              r="10"
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
            />
          </motion.g>

          {/* Overlapping bounding boxes (drawn in reverse so highest confidence is on top) */}
          {[...boxes].reverse().map((box, reverseIdx) => {
            const idx = boxes.length - 1 - reverseIdx;
            const opacityValue = 0.3 + box.confidence * 0.6;
            const delay = 0.4 + idx * 0.12;

            return (
              <motion.g
                key={`before-box-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.4,
                  delay,
                  ease: PRODUCTIVE_EASE,
                }}
              >
                {/* Bounding box */}
                <rect
                  x={beforePanelX + box.x}
                  y={box.y}
                  width={box.width}
                  height={box.height}
                  rx="2"
                  fill="none"
                  stroke={
                    idx === 0
                      ? 'var(--color-accent)'
                      : 'var(--color-text-tertiary)'
                  }
                  strokeWidth={idx === 0 ? 2 : 1.5}
                  opacity={opacityValue}
                  strokeDasharray={idx === 0 ? 'none' : '4 2'}
                />
                {/* Confidence label */}
                <rect
                  x={beforePanelX + box.x + box.width - 28}
                  y={box.y - 1}
                  width="28"
                  height="14"
                  rx="2"
                  fill={
                    idx === 0
                      ? 'var(--color-accent)'
                      : 'var(--color-bg-elevated)'
                  }
                  stroke={
                    idx === 0 ? 'none' : 'var(--color-border-primary)'
                  }
                  strokeWidth="0.5"
                  opacity={opacityValue}
                />
                <text
                  x={beforePanelX + box.x + box.width - 14}
                  y={box.y + 10}
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="600"
                  fill={
                    idx === 0
                      ? 'var(--color-bg-primary)'
                      : 'var(--color-text-secondary)'
                  }
                  opacity={opacityValue}
                >
                  {box.confidence.toFixed(2)}
                </text>
              </motion.g>
            );
          })}
        </motion.g>

        {/* ===== NMS ARROW BETWEEN PANELS ===== */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.1, ease: PRODUCTIVE_EASE }}
        >
          <motion.line
            x1={beforePanelX + panelWidth + 18}
            y1={26 + panelHeight / 2}
            x2={afterPanelX - 18}
            y2={26 + panelHeight / 2}
            stroke="var(--color-text-tertiary)"
            strokeWidth="2"
            markerEnd="url(#arrowhead-nms)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.6, delay: 1.2, ease: PRODUCTIVE_EASE }}
          />

          {/* NMS label on top of arrow */}
          <motion.text
            x={(beforePanelX + panelWidth + 18 + afterPanelX - 18) / 2}
            y={26 + panelHeight / 2 - 20}
            textAnchor="middle"
            fill="var(--color-accent)"
            fontSize="12"
            fontWeight="600"
            initial={{ opacity: 0, y: 5 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }
            }
            transition={{ duration: 0.4, delay: 1.4, ease: PRODUCTIVE_EASE }}
          >
            NMS
          </motion.text>

          {/* Threshold label below arrow */}
          <motion.text
            x={(beforePanelX + panelWidth + 18 + afterPanelX - 18) / 2}
            y={26 + panelHeight / 2 + 16}
            textAnchor="middle"
            fill="var(--color-text-tertiary)"
            fontSize="9"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.5, ease: PRODUCTIVE_EASE }}
          >
            {'IoU > 0.5 \u2192 suppress'}
          </motion.text>
        </motion.g>

        {/* ===== AFTER NMS PANEL ===== */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.6, ease: PRODUCTIVE_EASE }}
        >
          {/* Panel label */}
          <motion.text
            x={afterPanelX + panelWidth / 2}
            y="18"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="13"
            fontWeight="600"
            initial={{ opacity: 0, y: -8 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
            }
            transition={{ duration: 0.4, delay: 1.6, ease: PRODUCTIVE_EASE }}
          >
            After NMS
          </motion.text>

          {/* Panel background */}
          <motion.rect
            x={afterPanelX}
            y="26"
            width={panelWidth}
            height={panelHeight}
            rx="6"
            fill="var(--color-bg-elevated)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.7, ease: PRODUCTIVE_EASE }}
          />

          {/* The same object */}
          <motion.rect
            x={afterPanelX + objectRect.x}
            y={objectRect.y}
            width={objectRect.width}
            height={objectRect.height}
            rx="4"
            fill="var(--color-bg-tertiary)"
            stroke="var(--color-border-primary)"
            strokeWidth="1"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.7 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 1.8, ease: PRODUCTIVE_EASE }}
          />

          {/* Same icon lines inside the object */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.35 } : { opacity: 0 }}
            transition={{ duration: 0.3, delay: 1.9, ease: PRODUCTIVE_EASE }}
          >
            <line
              x1={afterPanelX + objectRect.x + 15}
              y1={objectRect.y + 20}
              x2={afterPanelX + objectRect.x + objectRect.width - 15}
              y2={objectRect.y + 20}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={afterPanelX + objectRect.x + 15}
              y1={objectRect.y + 30}
              x2={afterPanelX + objectRect.x + objectRect.width - 20}
              y2={objectRect.y + 30}
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx={afterPanelX + objectRect.x + objectRect.width / 2}
              cy={objectRect.y + 55}
              r="10"
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1.5"
            />
          </motion.g>

          {/* Suppressed boxes fading out (ghost effect) */}
          {boxes.slice(1).map((box, idx) => (
            <motion.rect
              key={`suppressed-${idx}`}
              x={afterPanelX + box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              rx="2"
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth="1"
              strokeDasharray="4 2"
              initial={{ opacity: 0.5 }}
              animate={isInView ? { opacity: 0 } : { opacity: 0.5 }}
              transition={{
                duration: 0.8,
                delay: 2.0 + idx * 0.1,
                ease: PRODUCTIVE_EASE,
              }}
            />
          ))}

          {/* Only the kept box remains */}
          <motion.g
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.5, delay: 2.0, ease: PRODUCTIVE_EASE }}
          >
            <rect
              x={afterPanelX + keptBox.x}
              y={keptBox.y}
              width={keptBox.width}
              height={keptBox.height}
              rx="2"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
            />
            {/* Confidence badge */}
            <rect
              x={afterPanelX + keptBox.x + keptBox.width - 28}
              y={keptBox.y - 1}
              width="28"
              height="14"
              rx="2"
              fill="var(--color-accent)"
            />
            <text
              x={afterPanelX + keptBox.x + keptBox.width - 14}
              y={keptBox.y + 10}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill="var(--color-bg-primary)"
            >
              {keptBox.confidence.toFixed(2)}
            </text>
          </motion.g>

          {/* Checkmark indicator next to the kept box */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 0.4, delay: 2.4, ease: PRODUCTIVE_EASE }}
          >
            <circle
              cx={afterPanelX + keptBox.x + keptBox.width + 10}
              cy={keptBox.y + 8}
              r="7"
              fill="var(--color-accent)"
              opacity="0.15"
            />
            <text
              x={afterPanelX + keptBox.x + keptBox.width + 10}
              y={keptBox.y + 12}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill="var(--color-accent)"
            >
              {'\u2713'}
            </text>
          </motion.g>
        </motion.g>

        {/* ===== BOTTOM ANNOTATION ===== */}
        <motion.text
          x="250"
          y="224"
          textAnchor="middle"
          fill="var(--color-text-tertiary)"
          fontSize="10"
          fontStyle="italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, delay: 2.6, ease: PRODUCTIVE_EASE }}
        >
          Keep highest confidence, remove overlapping
        </motion.text>
      </svg>
    </div>
  );
}
