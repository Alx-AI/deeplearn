'use client';
import { useMemo } from 'react';
import { formatInline } from '@/lib/format-text';

export function FormattedText({ text, className, as: Tag = 'span' }: {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'div';
}) {
  const html = useMemo(() => formatInline(text), [text]);
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
