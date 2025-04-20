'use client';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination" 
import { usePathname, useSearchParams } from 'next/navigation';
 
export default function PaginationComponent({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
 
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  if (totalPages <= 1) return null; // No pagination needed if there's only one page
 
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" aria-disabled={currentPage === 1} onClick={()=>createPageURL(currentPage - 1)} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive={currentPage===1} onClick={()=>createPageURL(1)}>1</PaginationLink>
        </PaginationItem>
        {currentPage > 2 && currentPage !== totalPages &&
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        }
        {currentPage > 1 && currentPage < totalPages &&
          <PaginationItem>
            <PaginationLink href='#' isActive>{currentPage}</PaginationLink>
          </PaginationItem>
        }
        {totalPages > currentPage + 1 && currentPage !== 1 &&
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationLink href="#" isActive={currentPage === totalPages} onClick={()=>createPageURL(totalPages)}>{totalPages}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" aria-disabled={currentPage === totalPages} onClick={()=>createPageURL(currentPage+1)}/>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}