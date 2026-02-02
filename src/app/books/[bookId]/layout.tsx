import { notFound } from 'next/navigation';
import { isValidBookId } from '@/content';
import { BookProvider } from '@/components/providers/BookProvider';

export default async function BookLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;

  if (!isValidBookId(bookId)) {
    notFound();
  }

  return <BookProvider bookId={bookId}>{children}</BookProvider>;
}
