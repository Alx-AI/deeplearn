'use client';

import { createContext, useContext } from 'react';

const BookContext = createContext<string>('deep-learning-python');

export function BookProvider({
  bookId,
  children,
}: {
  bookId: string;
  children: React.ReactNode;
}) {
  return <BookContext.Provider value={bookId}>{children}</BookContext.Provider>;
}

/** Get the current book ID from the URL-derived context. */
export function useBookId(): string {
  return useContext(BookContext);
}
