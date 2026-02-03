import katex from 'katex';

// ---------------------------------------------------------------------------
// Content block parsing
// ---------------------------------------------------------------------------

export interface ContentBlock {
  type: 'paragraph' | 'code';
  content: string;
  language?: string;
}

/**
 * Parse section content into blocks, properly handling fenced code blocks.
 * Code blocks (```lang ... ```) are extracted as separate blocks so they
 * don't get broken by paragraph splitting.
 */
export function parseContentBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const codeBlockRegex = /```(\w*)\s*\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add any text before this code block as paragraph blocks
    const before = content.slice(lastIndex, match.index);
    if (before.trim()) {
      for (const para of before.split('\n\n')) {
        if (para.trim()) {
          blocks.push({ type: 'paragraph', content: para.trim() });
        }
      }
    }

    // Add the code block
    blocks.push({
      type: 'code',
      content: match[2].replace(/\n$/, ''),
      language: match[1] || 'text',
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last code block
  const remaining = content.slice(lastIndex);
  if (remaining.trim()) {
    for (const para of remaining.split('\n\n')) {
      if (para.trim()) {
        blocks.push({ type: 'paragraph', content: para.trim() });
      }
    }
  }

  return blocks;
}

export function isListBlock(text: string): boolean {
  const lines = text.split('\n');
  const isUl = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '') &&
    lines.some((l) => l.trim().startsWith('- '));
  const isOl = lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '') &&
    lines.some((l) => /^\d+\.\s/.test(l.trim()));
  return isUl || isOl;
}

// ---------------------------------------------------------------------------
// Inline and paragraph formatting (with KaTeX support)
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function formatInline(text: string): string {
  // 1. Protect backtick code spans with placeholders
  const codeSpans: string[] = [];
  let processed = text.replace(/`(.+?)`/g, (_, code) => {
    codeSpans.push(`<code class="rounded bg-surface px-1.5 py-0.5 text-sm font-mono text-accent">${escapeHtml(code)}</code>`);
    return `\x00CODE${codeSpans.length - 1}\x00`;
  });

  // 2. Display math $$...$$ (before inline $ to avoid conflicts)
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
    } catch { return `<code>${escapeHtml(tex)}</code>`; }
  });

  // 3. Inline math $...$
  processed = processed.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
    } catch { return `<code>${escapeHtml(tex)}</code>`; }
  });

  // 4. Restore code spans
  processed = processed.replace(/\x00CODE(\d+)\x00/g, (_, idx) => codeSpans[Number(idx)]);

  // 5. Bold and italic
  processed = processed
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');

  return processed;
}

export function formatParagraph(text: string): string {
  const trimmed = text.trim();

  // Display math block (entire paragraph is $$...$$)
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
    const tex = trimmed.slice(2, -2).trim();
    try {
      return `<div class="math-display">${katex.renderToString(tex, { displayMode: true, throwOnError: false })}</div>`;
    } catch { return `<pre>${escapeHtml(tex)}</pre>`; }
  }

  // Check if it's a list
  const lines = text.split('\n');
  const isUnorderedList = lines.every((l) => l.trim().startsWith('- ') || l.trim() === '');
  const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === '');

  if (isUnorderedList && lines.some((l) => l.trim().startsWith('- '))) {
    const items = lines
      .filter((l) => l.trim().startsWith('- '))
      .map((l) => `<li>${formatInline(l.trim().slice(2))}</li>`)
      .join('');
    return `<ul class="my-3 ml-4 space-y-1.5 list-disc list-outside">${items}</ul>`;
  }

  if (isOrderedList && lines.some((l) => /^\d+\.\s/.test(l.trim()))) {
    const items = lines
      .filter((l) => /^\d+\.\s/.test(l.trim()))
      .map((l) => `<li>${formatInline(l.trim().replace(/^\d+\.\s/, ''))}</li>`)
      .join('');
    return `<ol class="my-3 ml-4 space-y-1.5 list-decimal list-outside">${items}</ol>`;
  }

  return formatInline(text);
}
