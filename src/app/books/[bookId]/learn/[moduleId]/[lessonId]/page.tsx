'use client';

// Re-export the existing lesson page component.
// It reads bookId from BookProvider context (set by the [bookId] layout).
export { default } from '@/app/learn/[moduleId]/[lessonId]/page';
