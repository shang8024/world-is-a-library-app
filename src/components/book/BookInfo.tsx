'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useBookContext } from '@/hooks/useBookContext';

export default function BookInfo() {
  const { book } = useBookContext();

  if (!book) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-4 border-b w-full items-center md:px-10 flex-shrink-0 max-w-screen">
      {/* Book Cover */}
      <div className="w-[200px] h-[250px] relative flex-shrink-0 items-center">
        <Image
          src={book.coverImage || '/file.svg'}
          alt={`Cover of ${book.title}`}
          fill
          className="object-cover rounded-md"
        />
      </div>

      <div className="flex flex-col w-full min-w-0 h-full justify-between sm:min-h-[250px] pt-4">
        <h1 className="text-2xl font-bold text-primary dark:text-primary-background break-words">
          {book.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          by{' '}
          <Link
            href={`/users/${book?.author?.username}`}
            className="hover:underline text-gray-600"
          >
            {book?.author?.name}
          </Link>
        </p>

        {/* Description */}
        {book.description && (
          <p className="text-sm text-gray-700 mt-4 whitespace-pre-line break-words flex-1">
            {book.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap justify-between text-xs text-gray-500 mt-4">
          <div className="flex items-center gap-2">
            <span>{book.wordCount.toLocaleString()} words</span>
            <span>{book._count?.chapters || 0} chapters</span>
          </div>
          <div className="flex items-center gap-2">
          <span>
            Created: {new Date(book.createdAt).toLocaleDateString()}
          </span>
          <span>
            Updated: {new Date(book.updatedAt).toLocaleDateString()}
          </span>
          </div>
        </div>
      </div>
    </div>
  );
}