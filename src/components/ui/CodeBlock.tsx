'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  language: string;
  code: string;
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python',
  py: 'Python',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  bash: 'Bash',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  sql: 'SQL',
  text: 'Text',
  plaintext: 'Text',
};

export function CodeBlock({ title, language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const langLabel = LANGUAGE_LABELS[language.toLowerCase()] ?? language;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="my-6 mx-auto max-w-[65ch] rounded-xl border border-border overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-elevated)' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b border-border"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
            }}
          >
            {langLabel}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer hover:bg-[var(--color-bg-tertiary)]"
          style={{
            color: copied ? 'var(--color-success)' : 'var(--color-text-tertiary)',
          }}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre
          className="px-4 py-4 text-[13px] leading-relaxed"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-primary)',
            margin: 0,
            backgroundColor: 'transparent',
          }}
        >
          <code>{code}</code>
        </pre>
      </div>
    </motion.div>
  );
}

/**
 * Renders a list of code examples for a section.
 * Similar pattern to SectionIllustrations.
 */
export function SectionCodeExamples({
  examples,
}: {
  examples?: { title: string; language: string; code: string }[];
}) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="my-6 space-y-5">
      {examples.map((ex, i) => (
        <CodeBlock key={i} title={ex.title} language={ex.language} code={ex.code} />
      ))}
    </div>
  );
}
